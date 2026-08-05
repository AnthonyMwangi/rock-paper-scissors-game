import { GameMode, GamePlayer, GameResult } from "@/utilities";

export type AppState = {
  hasHydrated: boolean;
  playerWantsToStayAnonymous?: boolean;
  playerResults: GameResult[];
  player?: GamePlayer;
  gameMode: GameMode;
};

export interface AppStore {
  app: AppState;
  setHasHydrated: (value: boolean) => void;
  setPlayerInfo: (user: GamePlayer) => void;
  setPlayerWantsToStayAnonymous: (value?: boolean) => void;
  setPlayerResults: (results: GameResult[]) => void;
  setGameMode: (mode: GameMode) => void;
  resetApp: () => void;
}
