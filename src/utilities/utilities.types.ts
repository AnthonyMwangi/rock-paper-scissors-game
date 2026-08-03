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

export type GameOption = StandardOption | BonusOption;

export type GamePlayer = Pick<User, "uid" | "displayName" | "isAnonymous"> & {
  isReturning: boolean;
};

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

export type GameAnalytics = {
  RPS_RESULT: GameResult;
  RPS_SESSION_START: GamePlayer | null;
  RPS_PLAYER_NAME_SET: Pick<GamePlayer, "displayName"> & {
    isFirstTime: boolean;
  };
  RPS_LEADERBOARD_VIEWED: null;
  RPS_RULES_MODAL_VIEWED: { mode: GameMode };
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
