import { StateCreator } from "zustand";
import { AppState, AppStore as Store } from "./store.app.types";

export const initialAppState: AppState = {
  hasHydrated: false,
  gameMode: "standard",
  player: undefined,
  playerResults: [],
  playerWantsToStayAnonymous: false,
  playerStats: undefined,
};

export const createAppSlice: StateCreator<Store, [], [], Store> = (set) => ({
  app: initialAppState,
  setHasHydrated: (hasHydrated) => {
    set((state) => ({ app: { ...state.app, hasHydrated } }));
  },
  setPlayerInfo: ({ player, playerStats }) => {
    set((state) => ({ app: { ...state.app, player, playerStats } }));
  },
  setPlayerWantsToStayAnonymous: (playerWantsToStayAnonymous = true) => {
    set((state) => ({ app: { ...state.app, playerWantsToStayAnonymous } }));
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
