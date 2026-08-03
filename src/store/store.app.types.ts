import { GameMode, GamePlayer, GameResult } from "@/utilities";

export type AppState = {
  hasHydrated: boolean;
  player?: GamePlayer;
  playerResults: GameResult[];
  gameMode: GameMode;
};

export interface AppStore {
  app: AppState;
  setHasHydrated: (value: boolean) => void;
  setPlayerInfo: (user: GamePlayer) => void;
  setPlayerResults: (results: GameResult[]) => void;
  setGameMode: (mode: GameMode) => void;
  resetApp: () => void;
}
