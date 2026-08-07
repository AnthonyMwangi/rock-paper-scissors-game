import {
  GameMode,
  GamePlayer,
  GameResult,
  LeaderboardEntry,
} from "@/utilities";

export type AppState = {
  hasHydrated: boolean;
  playerStats?: Record<GameMode, LeaderboardEntry | undefined>;
  playerWantsToStayAnonymous?: boolean;
  playerResults: GameResult[];
  player?: GamePlayer;
  gameMode: GameMode;
};

export interface AppStore {
  app: AppState;
  setHasHydrated: (value: boolean) => void;
  setPlayerInfo: (params: Pick<AppState, "player" | "playerStats">) => void;
  setPlayerWantsToStayAnonymous: (value?: boolean) => void;
  setPlayerResults: (results: GameResult[]) => void;
  setGameMode: (mode: GameMode) => void;
  resetApp: () => void;
}
