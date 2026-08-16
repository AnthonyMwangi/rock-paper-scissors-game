import { useGlobalStore } from "@/store";
import {
  GameOptions,
  PREDICTION_ACCURACY_DECAY_RATE,
  PREDICTION_ACCURACY_MULTIPLIER,
  PREDICTION_WEIGHTS,
  RESULTS_DOMINANCE_THRESHOLD,
} from "./utilities.constants";
import {
  GameOption,
  LeaderboardEntry,
  Prediction,
  Predictor,
} from "./utilities.types";

/**
 * Fetch all game options
 */
export function getParams() {
  const { gameMode, playerResults, playerStats } =
    useGlobalStore.getState().app;
  const options = GameOptions[gameMode];
  return {
    playerHistory: playerResults[gameMode],
    playerStats: playerStats[gameMode]
      ? parseLeaderboardEntry(playerStats[gameMode])
      : undefined,
    optionsMap: getMappedOptions(options),
    options,
  };
}

/**
 * Picks a random value
 */
export function getRandomMove(options: GameOption[]) {
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

/**
 * Create a map of game options
 */
export function getMappedOptions<T = number>(
  options: GameOption[],
  valueFn?: (option: GameOption) => T,
) {
  return Object.fromEntries(
    options.map((key) => [key, valueFn ? valueFn(key) : (0 as T)]),
  ) as Record<GameOption, T>;
}

/**
 * Checks previous predictions to see how accurate they were
 * - recent games matter more thats why a decay rate is applied
 * -
 */
export function getPredictorAccuracy(source: Predictor): number {
  const { options, playerHistory } = getParams();

  let weightedTotal = 0;
  let weightedAccurate = 0;

  playerHistory.forEach((result, index) => {
    if (result.predictors?.predictions?.[source]) {
      const decay = Math.pow(PREDICTION_ACCURACY_DECAY_RATE, index);

      const { prediction } = result.predictors?.predictions?.[source] || {};

      if (prediction === result.playerChoice) {
        weightedAccurate += decay;
      }

      weightedTotal += decay;
    }
  });

  if (weightedTotal > 0) {
    const baselineAccuracy = 1 / options.length;
    const weightedAccuracy = weightedAccurate / weightedTotal;
    const normalizedAccuracy =
      (weightedAccuracy - baselineAccuracy) / (1 - baselineAccuracy);
    return 1 + normalizedAccuracy * PREDICTION_ACCURACY_MULTIPLIER;
  }

  return 1; // Neutral
}

/**
 * Occasionally weaken prediction (keep ~60% win rate)
 */
export function applyHouseEdge(prediction: GameOption) {
  const { playerStats, options } = getParams();

  if (playerStats?.uid && playerStats.lossRate > 0.7) {
    return Math.random() < 0.3 ? getRandomMove(options) : prediction;
  }

  return prediction;
}

/**
 * Given a move, return every option that beats it within the current game's options set.
 * - Each option beats a fixed number of options ahead of it in the cycle (`winningRange`).
 * - For each candidate, measure number of steps forward from candidate to `move`
 * — If the steps are within the winning range, candidate beats move.
 */
export function getBeatingMoves(
  move: GameOption,
  options: GameOption[],
): GameOption[] {
  const moveIndex = options.indexOf(move);
  const winningRange = (options.length - 1) / 2;

  return options.filter((candidate) => {
    if (candidate === move) return false;

    const candidateIndex = options.indexOf(candidate);
    const modularDistance = moveIndex - candidateIndex + options.length;
    const stepsFromCandidate = modularDistance % options.length;

    return stepsFromCandidate <= winningRange;
  });
}

/**
 * Detect spam (same move repetition)
 * - confidence is determined by how much the option was repeated
 */
export function spamPredictor(): Prediction | null {
  const { playerHistory } = getParams();

  const streak: GameOption[] = [];
  const [mostRecentMove, ...otherMoves] = playerHistory;

  for (let i = 0; i < otherMoves.length; i++) {
    if (otherMoves[i].playerChoice === mostRecentMove.playerChoice) {
      streak.push(mostRecentMove.playerChoice);
    } else {
      break;
    }
  }

  if (streak.length >= 3) {
    const confidence = Math.min(1, (streak.length - 2) / 5);

    return {
      source: "spam",
      prediction: mostRecentMove.playerChoice,
      accuracy: getPredictorAccuracy("spam"),
      weight: PREDICTION_WEIGHTS.spam,
      params: { streak },
      confidence,
    };
  }

  return null;
}

/**
 * Detects weighted frequency bias
 *  - if the player has been picking the same move in a row
 */
export function frequencyPredictor(): Prediction | null {
  const { optionsMap, playerHistory } = getParams();

  const frequencyMap = { ...optionsMap };
  playerHistory.forEach((r) => frequencyMap[r.playerChoice]++);

  const [predictedMove, predictionScore] = Object.entries(frequencyMap).sort(
    (a, b) => b[1] - a[1],
  )[0] as [GameOption, number];

  const threshold = Math.max(0, Math.min(1 - RESULTS_DOMINANCE_THRESHOLD, 1));
  const weightedScore = predictionScore / playerHistory.length - threshold;

  if (weightedScore > 0) {
    return {
      source: "frequency",
      prediction: predictedMove,
      accuracy: getPredictorAccuracy("frequency"),
      params: { frequencyMap, threshold: 1 - threshold },
      weight: PREDICTION_WEIGHTS.frequency,
      confidence: weightedScore,
    };
  }

  return null;
}

/**
 * Detects conditional patterns (Markov-style: what comes next)
 */
export function markovPredictor(): Prediction | null {
  const { playerHistory, options } = getParams();

  if (playerHistory.length >= 2) {
    const markovMap = getMappedOptions(options, () => {
      return getMappedOptions(options);
    });

    // build transition matrix
    for (let i = 1; i < playerHistory.length; i++) {
      const prev = playerHistory?.[i - 1]?.playerChoice;
      const curr = playerHistory?.[i]?.playerChoice;
      markovMap[prev][curr]++;
    }

    const nextMove = markovMap[playerHistory[0].playerChoice];
    const totalScore = Object.values(nextMove).reduce((a, b) => a + b, 0);

    if (totalScore > 0) {
      const [predictedMove, predictedMoveScore] = Object.entries(nextMove).sort(
        (a, b) => b[1] - a[1],
      )[0] as [GameOption, number];

      return {
        source: "markov",
        prediction: predictedMove,
        accuracy: getPredictorAccuracy("markov"),
        params: { markovMap: nextMove, predictedMoveScore },
        confidence: predictedMoveScore / totalScore,
        weight: PREDICTION_WEIGHTS.markov,
      };
    }
  }

  return null;
}

/**
 * Predict from behavior/psychology that people often:
 * - switch their choice after a loss
 * - repeat their choice after a win
 */
export function behavioralPredictor(): Prediction | null {
  const { playerHistory, options } = getParams();

  const [mostRecentMove] = playerHistory;

  const nextMovePrediction: Prediction = {
    source: "behavior",
    params: { mostRecentMove },
    accuracy: getPredictorAccuracy("behavior"),
    prediction: null as unknown as GameOption,
    weight: PREDICTION_WEIGHTS.behavior,
    confidence: 0,
  };

  // Default (draw)
  if (mostRecentMove?.outcome === "draw") {
    nextMovePrediction.prediction = mostRecentMove.playerChoice;
    nextMovePrediction.confidence = 0.3; // draw bias
  }

  // win → repeat
  if (mostRecentMove?.outcome === "win") {
    nextMovePrediction.prediction = mostRecentMove.playerChoice;
    nextMovePrediction.confidence = 0.6; // repeat bias
  }

  // loss → switch (guess they move to what beats their last move)
  if (mostRecentMove?.outcome === "lose") {
    const movesThatBeatOpponentChoice = getBeatingMoves(
      mostRecentMove.opponentChoice,
      options,
    );

    nextMovePrediction.prediction = movesThatBeatOpponentChoice[0];
    nextMovePrediction.confidence = 0.5; // switch bias
  }

  return nextMovePrediction;
}

/**
 * Parse leaderboard entry
 */
export function parseLeaderboardEntry(entry: LeaderboardEntry) {
  if (!entry?.uid) return;
  return {
    ...entry,
    lossRate: parseFloat((entry.losses / entry.totalGames).toFixed(2)),
    winRate: parseFloat((entry.wins / entry.totalGames).toFixed(2)),
  };
}
