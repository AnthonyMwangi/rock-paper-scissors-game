import iconLizard from '@/images/icon-lizard.svg'
import iconPaper from '@/images/icon-paper.svg'
import iconRock from '@/images/icon-rock.svg'
import iconScissors from '@/images/icon-scissors.svg'
import iconSpock from '@/images/icon-spock.svg'
import logoBonus from '@/images/logo-bonus.svg'
import logo from '@/images/logo.svg'
import { GameBoard, GameOption } from "./utilities.types"

export const DefaultOptions: GameOption[] = ['rock', 'paper', 'scissors'];
export const BonusOptions: GameOption[] = [...DefaultOptions, 'lizard', 'spock'];

export const GameOptions: Record<GameBoard, GameOption[]> = {
  standard: DefaultOptions,
  bonus: BonusOptions
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
