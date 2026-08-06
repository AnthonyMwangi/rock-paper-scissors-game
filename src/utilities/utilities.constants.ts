import iconLizard from "@/images/icon-lizard.svg";
import iconPaper from "@/images/icon-paper.svg";
import iconRock from "@/images/icon-rock.svg";
import iconScissors from "@/images/icon-scissors.svg";
import iconSpock from "@/images/icon-spock.svg";
import imageRulesBonus from "@/images/image-rules-bonus.svg";
import imageRules from "@/images/image-rules.svg";
import logoBonus from "@/images/logo-bonus.svg";
import logo from "@/images/logo.svg";
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

export const GameLogo: Record<GameMode, string> = {
  standard: logo,
  bonus: logoBonus,
};

export const GameRules: Record<GameMode, string> = {
  standard: imageRules,
  bonus: imageRulesBonus,
};

export const GameOptionImage: Record<GameOption, string> = {
  rock: iconRock,
  paper: iconPaper,
  scissors: iconScissors,
  lizard: iconLizard,
  spock: iconSpock,
};

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
