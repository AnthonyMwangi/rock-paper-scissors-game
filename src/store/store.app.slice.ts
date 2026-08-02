import { StateCreator } from "zustand";
import { AppState, AppStore as Store } from "./store.app.types";

export const initialAppState: AppState = {
  hasHydrated: false,
  gameMode: "standard",
  player: undefined,
  playerResults: [],
};

export const createAppSlice: StateCreator<Store, [], [], Store> = (set) => ({
  app: initialAppState,
  setHasHydrated: (hasHydrated) => {
    set((state) => ({ app: { ...state.app, hasHydrated } }));
  },
  setPlayerInfo: (player) => {
    set((state) => ({ app: { ...state.app, player } }));
  },
  setPlayerResults: (playerResults) => {
    set((state) => ({ app: { ...state.app, playerResults } }));
  },
  setGameMode: (gameMode) => {
    set((state) => ({ app: { ...state.app, gameMode } }));
  },
  resetApp: () => {
    set(() => ({ app: initialAppState }));
  },
});

export type AppStore = Store;
