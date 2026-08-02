import { GameOptions } from "@/utilities/utilities.constants";
import {
  GameMode,
  GameOption,
  GameOutcome,
  GameResult,
} from "./utilities.types";

export function getComputerChoice(options: GameOption[]) {
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

/**
 * Evaluate the user's choice against the house choice
 * - Every option beats a limited number of options ahead of it (`winningRange`) in a cycle.
 * - Measure how many steps forward from the user's choice you land on house's choice.
 * - If the number of steps are within the winning range, the user's choice wins.
 * - Modular arithmetic is used to get the actual index in the cycle
 */
export function getUserOutcome(
  userChoice: GameOption,
  gameBoard: GameMode,
): GameResult {
  let userOutcome: GameOutcome = "draw";
  const options = GameOptions[gameBoard];
  const houseChoice = getComputerChoice(options);

  if (houseChoice !== userChoice) {
    const userChoiceIndex = options.indexOf(userChoice);
    const houseChoiceIndex = options.indexOf(houseChoice);

    const userWinningRange = (options.length - 1) / 2;
    const userModularDistance =
      houseChoiceIndex - userChoiceIndex + options.length;
    const userStepsToHouse = userModularDistance % options.length;

    userOutcome = userStepsToHouse <= userWinningRange ? "win" : "lose";
  }

  return {
    outcome: userOutcome,
    timestamp: Date.now(),
    board: gameBoard,
    houseChoice,
    userChoice,
  };
}
