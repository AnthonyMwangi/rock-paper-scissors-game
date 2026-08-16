import { User } from "firebase/auth";

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export const enum VideoPlayerStatus {
  Pending = -1,
  Ended = 0,
  Playing = 1,
  Paused = 2,
  Buffering = 3,
  VideoCued = 5,
}

export type GameMode = "standard" | "bonus";
export type StandardOption = "rock" | "paper" | "scissors";
export type BonusOption = "lizard" | "spock";
export type GameOutcome = "win" | "draw" | "lose";
export type Predictor = "spam" | "markov" | "frequency" | "behavior";

export type GameModal = "RULES" | "LEADERBOARD" | "USERNAME";
export type GameModalOpenedEvent = `RPS_${GameModal}_MODAL_VIEWED`;
export type GameModalClosedEvent = `RPS_${GameModal}_MODAL_CLOSED`;

export type GameOption = StandardOption | BonusOption;

export type GamePlayer = Pick<User, "uid" | "displayName" | "isAnonymous"> & {
  isReturning: boolean;
};

export type GameResultPrediction = Required<
  Omit<Prediction, "source" | "params">
> & { accuracy: number };

export type GameResult = {
  id: string | null;
  mode: GameMode;
  outcome: GameOutcome;
  playerId: string | null;
  playerChoice: GameOption;
  opponentId: string | null;
  opponentChoice: GameOption;
  timestamp: number;
  predictors?: {
    predictedMove: GameOption;
    predictedMoveConfidence: number;
    predictions: Record<Predictor, GameResultPrediction>;
  };
};

export type GameModalAnalytics = Record<
  GameModalOpenedEvent | GameModalClosedEvent,
  object
>;

export type GameAnalytics = GameModalAnalytics & {
  RPS_RESULT: GameResult;
  RPS_SESSION_START: GamePlayer | null;
  RPS_PLAYER_NAME_UPDATED: Pick<GamePlayer, "displayName"> & {
    isFirstTime: boolean;
  };
  RPS_LEADERBOARD_VIEWED: null;
  RPS_RULES_VIDEO_VIEWED: { id: string };
  RPS_RULES_VIDEO_PLAYED: {
    videoUrl: string;
    currentTime: number;
    duration: number;
    playbackRate: number;
    title: string;
    eventId: string;
    author: string;
  };
};

export interface LeaderboardEntry {
  uid: string;
  mode: GameMode;
  displayName: string;
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  netScore: number;
}

export type ParsedLeaderboardEntry = LeaderboardEntry & {
  lossRate: number;
  winRate: number;
};

export type Prediction = {
  prediction: GameOption;
  confidence: number; // 0 → 1
  weight: number; // base importance
  source: Predictor;
  score?: number;
};

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  style?: React.CSSProperties;
  className?: string;
  width?: number | string;
  height?: number | string;
  viewBox?: string;
}
