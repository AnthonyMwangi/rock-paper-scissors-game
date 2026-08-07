import { useGlobalStore } from "@/store";
import { GameOptions } from "@/utilities/utilities.constants";
import {
  GameOption,
  GameOutcome,
  GameResult,
  LeaderboardEntry,
} from "./utilities.types";

/**
 * Computer just picks a random value
 */
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
export function getPlayerOutcome(playerChoice: GameOption): GameResult {
  let playerOutcome: GameOutcome = "draw";
  const { gameMode, player } = useGlobalStore.getState().app;

  const options = GameOptions[gameMode];
  const houseChoice = getComputerChoice(options);

  if (houseChoice !== playerChoice) {
    const userChoiceIndex = options.indexOf(playerChoice);
    const houseChoiceIndex = options.indexOf(houseChoice);

    const userWinningRange = (options.length - 1) / 2;
    const userModularDistance =
      houseChoiceIndex - userChoiceIndex + options.length;
    const userStepsToHouse = userModularDistance % options.length;

    playerOutcome = userStepsToHouse <= userWinningRange ? "win" : "lose";
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
  };
}

/**
 * Parse leaderboard entry
 */
export function parseLeaderboardEntry(entry: LeaderboardEntry) {
  console.log("entry", entry);
  return { ...entry, winRate: (entry.wins / entry.totalGames) * 100 };
}
