import { GameOption, Outcome } from "./utilities.types";

export function getComputerChoice(options: GameOption[]) {
  const randomIndex = Math.floor(Math.random() * (Math.floor(options.length - 1) - 1));
  return options[randomIndex];
}

export function getUserOutcome(userChoice: GameOption, computerChoice: GameOption): Outcome {
  switch (`${userChoice}->${computerChoice}`) {
    case 'rock->scissors': return 'win';
    case 'scissors->paper': return 'win';
    case 'paper->rock': return 'win';
    default: return userChoice === computerChoice  ? 'draw' : 'lose';
  }
}
