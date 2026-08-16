import {
  GameMode,
  GamePlayer,
  GameResult,
  LeaderboardEntry,
} from "@/utilities";

export type AppState = {
  hasHydrated: boolean;
  playerStats: Record<GameMode, LeaderboardEntry | undefined>;
  playerWantsToStayAnonymous?: boolean;
  playerResults: Record<GameMode, GameResult[]>;
  player?: GamePlayer;
  gameMode: GameMode;
};

export interface AppStore {
  app: AppState;
  setHasHydrated: (value: boolean) => void;
  setPlayerInfo: (player: GamePlayer) => void;
  setPlayerWantsToStayAnonymous: (value?: boolean) => void;
  setPlayerResults: (gameMode: GameMode, results: GameResult[]) => void;
  setPlayerStats: (gameMode: GameMode, stats: LeaderboardEntry) => void;
  setGameMode: (mode: GameMode) => void;
  resetApp: () => void;
}
