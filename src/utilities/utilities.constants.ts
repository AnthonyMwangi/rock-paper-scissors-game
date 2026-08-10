import { Icons } from "@/images";
import { FC } from "react";
import { GameMode, GameOption, GameOutcome } from "./utilities.types";

export const BONUS_RULES_VIDEO = {
  ID: "iSHPVCBsnLw",
  ORIGIN: "https://www.youtube.com",
};

export const AUTO_PLAY_TIMEOUT_SECONDS = 5;

export const LEADERBOARD_MIN_GAMES_THRESHOLD = 1;
export const LEADERBOARD_FETCH_BUFFER = 30;
export const LEADERBOARD_SIZE = 10;

export const GameOptions: Record<GameMode, GameOption[]> = {
  standard: ["rock", "scissors", "paper"],
  bonus: ["rock", "scissors", "lizard", "paper", "spock"],
};

export const GameModeName: Record<GameMode, string> = {
  standard: "original",
  bonus: "bonus",
};

export const GameLogo = {
  standard: Icons.Logo,
  bonus: Icons.LogoBonus,
} as const satisfies Record<GameMode, FC>;

export const GameRules = {
  standard: Icons.ImageRules,
  bonus: Icons.ImageRulesBonus,
} as const satisfies Record<GameMode, FC>;

export const GameOptionImage = {
  rock: Icons.IconRock,
  paper: Icons.IconPaper,
  scissors: Icons.IconScissors,
  lizard: Icons.IconLizard,
  spock: Icons.IconSpock,
} as const satisfies Record<GameOption, FC>;

export const GameOutcomeLabel: Record<GameOutcome, string> = {
  win: "You Win",
  lose: "You Lose",
  draw: "Draw",
};

export const GameOutcomePoints: Record<GameOutcome, number> = {
  win: 1,
  lose: -1,
  draw: 0,
};
