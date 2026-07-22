export type GameBoard = 'standard' | 'bonus';
export type StandardOption = 'rock' | 'paper' | 'scissors';
export type BonusOption = 'lizard' | 'spock';
export type Outcome = 'win' | 'draw' | 'lose';

export type GameOption = StandardOption | BonusOption;

export type Result = {
  board: GameBoard;
  userChoice: GameOption;
  computerChoice: GameOption;
  outcome: Outcome;
  timestamp: number;
}
