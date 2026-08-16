import { useGlobalStore } from "@/store";
import {
  GameOptions,
  PREDICTION_EXPLORATION_RATE,
  RESULTS_MIN_THRESHOLD,
} from "./utilities.constants";
import {
  applyHouseEdge,
  behavioralPredictor,
  frequencyPredictor,
  getBeatingMoves,
  getMappedOptions,
  getParams,
  getPredictorAccuracy,
  getRandomMove,
  markovPredictor,
  spamPredictor,
} from "./utilities.prediction";
import {
  GameOption,
  GameOutcome,
  GameResult,
  GameResultPrediction,
  Prediction,
  Predictor,
} from "./utilities.types";

/**
 * Predict a move for the house
 * - Checks the player's recent gameplay and predicts a beating move
 * - If there isn't enough data it simply picks a random move to establish a baseline
 * -
 */
export function predictAndCounterMove() {
  const { playerHistory, options } = getParams();

  // Not enough data → stay random
  if (playerHistory.length < RESULTS_MIN_THRESHOLD) {
    return { move: getRandomMove(options) };
  }

  // Randomly pick a value to prevent exploitation
  if (Math.random() < PREDICTION_EXPLORATION_RATE) {
    return { move: getRandomMove(options) };
  }

  // Randomly pick a value to prevent the house being too aggressive
  if (applyHouseEdge()) {
    return { move: getRandomMove(options) };
  }

  const predictors = [
    spamPredictor(),
    frequencyPredictor(),
    markovPredictor(),
    behavioralPredictor(),
  ].filter(Boolean) as Prediction[];

  // No predictors → stay random
  if (!predictors.length) {
    return { move: getRandomMove(options) };
  }

  const aggregateScores = getMappedOptions(options);
  const predictorAccuracy = getPredictorAccuracy();

  const predictorScores = {} as Record<Predictor, number>;

  predictors.forEach((p) => {
    const accuracy = predictorAccuracy[p.source];
    const score = p.confidence * p.weight * accuracy;
    aggregateScores[p.prediction] += Number(score.toFixed(4));
    predictorScores[p.source] = Number(score.toFixed(4));
  });

  // sort moves by score
  const ranked = Object.entries(aggregateScores).sort(
    (a, b) => b[1] - a[1],
  ) as [GameOption, number][];

  let predictedMove = ranked[0][0];

  // if scores are close → randomize between top 2
  if (Math.abs(ranked[0][1] - ranked[1][1]) < 0.15) {
    predictedMove = getRandomMove([ranked[0][0], ranked[1][0]]);
  }

  const predictions = Object.fromEntries(
    predictors.map((p) => [
      p.source,
      {
        prediction: p.prediction,
        score: predictorScores[p.source],
        accuracy: predictorAccuracy[p.source],
        confidence: p.confidence,
        weight: p.weight,
      } satisfies GameResultPrediction,
    ]),
  ) as unknown as Record<Predictor, GameResultPrediction>;

  return {
    move: getRandomMove(getBeatingMoves(predictedMove, options)),
    predictors: {
      predictedMove,
      predictedMoveConfidence: aggregateScores[predictedMove],
      predictions,
    } satisfies GameResult["predictors"],
  };
}

/**
 * Evaluate the user's choice against the house choice
 * - Modular arithmetic is used to get the actual index in the cycle
 */
export function getPlayerOutcome(playerChoice: GameOption): GameResult {
  let playerOutcome: GameOutcome = "draw";
  const { gameMode, player } = useGlobalStore.getState().app;

  const options = GameOptions[gameMode];
  const { move: houseChoice, predictors } = predictAndCounterMove();

  if (houseChoice !== playerChoice) {
    const houseWinningOptions = getBeatingMoves(playerChoice, options);
    playerOutcome = houseWinningOptions.includes(houseChoice) ? "lose" : "win";
  }

  return {
    id: null,
    mode: gameMode,
    outcome: playerOutcome,
    opponentChoice: houseChoice,
    opponentId: null,
    timestamp: Date.now(),
    playerId: player?.uid || null,
    playerChoice,
    predictors,
  };
}
