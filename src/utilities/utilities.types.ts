export type GameMode = "standard" | "bonus";
export type StandardOption = "rock" | "paper" | "scissors";
export type BonusOption = "lizard" | "spock";
export type GameOutcome = "win" | "draw" | "lose";

export type GameOption = StandardOption | BonusOption;

export type GameResult = {
  board: GameMode;
  userChoice: GameOption;
  houseChoice: GameOption;
  outcome: GameOutcome;
  timestamp: number;
};
