import { GameOptions } from "@/utilities/utilities.constants";
import { GameMode, GameOption, Outcome, Result } from "./utilities.types";

export function getComputerChoice(options: GameOption[]) {
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

export function getUserOutcome(
  userChoice: GameOption,
  gameBoard: GameMode,
): Result {
  let userOutcome: Outcome = "draw";
  const options = GameOptions[gameBoard];
  const houseChoice = getComputerChoice(options);

  if (houseChoice !== userChoice) {
    const userWinningRange = (options.length - 1) / 2;
    const steps = options.indexOf(houseChoice) - options.indexOf(userChoice);
    const housePosition = steps < 0 ? steps + options.length : steps;
    userOutcome = housePosition <= userWinningRange ? "win" : "lose";
  }

  return {
    outcome: userOutcome,
    timestamp: Date.now(),
    board: gameBoard,
    houseChoice,
    userChoice,
  };
}
