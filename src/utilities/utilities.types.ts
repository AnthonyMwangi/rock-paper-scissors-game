export type GameMode = "standard" | "bonus";
export type StandardOption = "rock" | "paper" | "scissors";
export type BonusOption = "lizard" | "spock";
export type GameOutcome = "win" | "draw" | "lose";

export type GameOption = StandardOption | BonusOption;

export type GameResult = {
  id: string | null;
  mode: GameMode;
  outcome: GameOutcome;
  playerId: string | null;
  playerChoice: GameOption;
  opponentId: string | null;
  opponentChoice: GameOption;
  timestamp: number;
};
