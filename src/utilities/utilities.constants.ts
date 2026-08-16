import { Icons } from "@/images";
import { FC } from "react";
import {
  GameMode,
  GameOption,
  GameOutcome,
  Predictor,
} from "./utilities.types";

export const BONUS_RULES_VIDEO = {
  ID: "iSHPVCBsnLw",
  ORIGIN: "https://www.youtube.com",
};

export const AUTO_PLAY_TIMEOUT_SECONDS = 5;

export const RESULTS_MIN_THRESHOLD = 5;
export const RESULTS_DOMINANCE_THRESHOLD = 0.6;
export const RESULTS_RECENT_LIMIT = 20;

export const LEADERBOARD_MIN_GAMES_THRESHOLD = 1;
export const LEADERBOARD_FETCH_BUFFER = 30;
export const LEADERBOARD_SIZE = 10;

export const PREDICTION_HOUSE_WINNING_EDGE = 0.7;
export const PREDICTION_ACCURACY_DECAY_RATE = 0.95;
export const PREDICTION_ACCURACY_MULTIPLIER = 0.5;
export const PREDICTION_ACCURACY_MIN_THRESHOLD = 5;
export const PREDICTION_EXPLORATION_RATE = 0.1;
export const PREDICTION_WEIGHTS = {
  spam: 0.9,
  markov: 0.7,
  behavior: 0.6,
  frequency: 0.5,
} as const satisfies Record<Predictor, number>;

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
