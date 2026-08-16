import { useGlobalStore } from "@/store";
import {
  GameOptions,
  PREDICTION_ACCURACY_DECAY_RATE,
  PREDICTION_ACCURACY_MIN_THRESHOLD,
  PREDICTION_ACCURACY_MULTIPLIER,
  PREDICTION_HOUSE_WINNING_EDGE,
  PREDICTION_WEIGHTS,
  RESULTS_DOMINANCE_THRESHOLD,
} from "./utilities.constants";
import {
  GameOption,
  GameResultPrediction,
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
 */
export function getPredictorAccuracy() {
  const { options, playerHistory } = getParams();

  const scores = {} as Record<
    Predictor,
    {
      total: number;
      accurate: number;
      count: number;
    }
  >;

  const predictorAccuracy = {} as Record<Predictor, number>;

  playerHistory.forEach((result, index) => {
    if (result?.predictors?.predictions) {
      (
        Object.entries(result.predictors.predictions) as [
          Predictor,
          GameResultPrediction,
        ][]
      ).forEach(([source, values]) => {
        if (!scores[source]) {
          scores[source] = { count: 0, total: 0, accurate: 0 };
        }

        const decay = Math.pow(PREDICTION_ACCURACY_DECAY_RATE, index);

        if (values.prediction === result.playerChoice) {
          scores[source].accurate += decay;
        }

        scores[source].total += decay;
        scores[source].count++;
      });
    }
  });

  Object.entries(scores).forEach(([source, predictions]) => {
    if (predictions.count < PREDICTION_ACCURACY_MIN_THRESHOLD) {
      predictorAccuracy[source as Predictor] = 1; // Neutral
      return;
    }

    const baseAccuracy = 1 / options.length;
    const weightedAccuracy = predictions.accurate / predictions.total;

    const normalizedAccuracy =
      (weightedAccuracy - baseAccuracy) / (1 - baseAccuracy);

    predictorAccuracy[source as Predictor] =
      1 + normalizedAccuracy * PREDICTION_ACCURACY_MULTIPLIER;
  });

  return predictorAccuracy;
}

/**
 * Occasionally weaken prediction
 * - Allows players to maintain a decent win rate
 * - Prevent the house from playing too aggressively
 */
export function applyHouseEdge() {
  const { playerStats } = getParams();

  if (
    playerStats?.uid &&
    playerStats.lossRate > PREDICTION_HOUSE_WINNING_EDGE
  ) {
    return Math.random() < 0.3;
  }

  return false;
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
      weight: PREDICTION_WEIGHTS.spam,
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

  const weightedScore = predictionScore / playerHistory.length;

  if (weightedScore >= RESULTS_DOMINANCE_THRESHOLD) {
    return {
      source: "frequency",
      prediction: predictedMove,
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
    for (let i = 0; i < playerHistory.length - 1; i++) {
      const prev = playerHistory?.[i + 1]?.playerChoice;
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
    prediction: mostRecentMove.playerChoice,
    weight: PREDICTION_WEIGHTS.behavior,
    confidence: 0.3, // Default (draw)
  };

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

    nextMovePrediction.prediction = getRandomMove(movesThatBeatOpponentChoice);
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
