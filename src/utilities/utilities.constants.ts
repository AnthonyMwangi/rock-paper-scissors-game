import iconLizard from '@/images/icon-lizard.svg'
import iconPaper from '@/images/icon-paper.svg'
import iconRock from '@/images/icon-rock.svg'
import iconScissors from '@/images/icon-scissors.svg'
import iconSpock from '@/images/icon-spock.svg'
import logoBonus from '@/images/logo-bonus.svg'
import logo from '@/images/logo.svg'
import { GameBoard, GameOption, Outcome } from "./utilities.types"

export const AUTO_PLAY_TIMEOUT_SECONDS = 8;

export const GameOptions: Record<GameBoard, GameOption[]> = {
  standard: ['rock', 'scissors', 'paper'],
  bonus: ['rock', 'scissors', 'lizard', 'paper', 'spock']
}

export const GameLogo: Record<GameBoard, string> = {
  standard: logo,
  bonus: logoBonus,
};

export const GameOptionImage: Record<GameOption, string> = {
  rock: iconRock,
  paper: iconPaper,
  scissors: iconScissors,
  lizard: iconLizard,
  spock: iconSpock,
};

export const GameOutcomeLabel: Record<Outcome, string> = {
  win: 'You Win',
  lose: 'You Lose',
  draw: 'Draw',
};
