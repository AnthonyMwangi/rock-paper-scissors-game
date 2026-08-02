import { GameMode, GameResult } from "@/utilities";
import type { User } from "firebase/auth";

export type AppState = {
  hasHydrated: boolean;
  player?: Pick<User, "uid" | "displayName" | "isAnonymous">;
  playerResults: GameResult[];
  gameMode: GameMode;
};

export interface AppStore {
  app: AppState;
  setHasHydrated: (value: boolean) => void;
  setPlayerInfo: (user: AppState["player"]) => void;
  setPlayerResults: (results: GameResult[]) => void;
  setGameMode: (mode: GameMode) => void;
  resetApp: () => void;
}
