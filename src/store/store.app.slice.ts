import { StateCreator } from "zustand";
import { AppState, AppStore as Store } from "./store.app.types";

export const initialAppState: AppState = {
  hasHydrated: false,
  gameMode: "standard",
  player: undefined,
  playerResults: { bonus: [], standard: [] },
  playerStats: { bonus: undefined, standard: undefined },
  playerWantsToStayAnonymous: false,
};

export const createAppSlice: StateCreator<Store, [], [], Store> = (
  set,
  get,
) => ({
  app: initialAppState,
  setHasHydrated: (hasHydrated) => {
    set((state) => ({ app: { ...state.app, hasHydrated } }));
  },
  setPlayerInfo: (player) => {
    set((state) => ({ app: { ...state.app, player } }));
  },
  setPlayerWantsToStayAnonymous: (playerWantsToStayAnonymous = true) => {
    set((state) => ({ app: { ...state.app, playerWantsToStayAnonymous } }));
  },
  setPlayerResults: (mode, results) => {
    let prevResults = initialAppState.playerResults;
    const currentStoredValue = get().app.playerResults;

    if (
      typeof currentStoredValue === "object" &&
      !Array.isArray(currentStoredValue)
    ) {
      prevResults = currentStoredValue;
    }

    set((state) => ({
      app: { ...state.app, playerResults: { ...prevResults, [mode]: results } },
    }));
  },
  setPlayerStats: (mode, stats) => {
    let prevStats = initialAppState.playerStats;
    const currentStoredValue = get().app.playerStats;

    if (
      typeof currentStoredValue === "object" &&
      !Array.isArray(currentStoredValue)
    ) {
      prevStats = currentStoredValue;
    }

    set((state) => ({
      app: { ...state.app, playerStats: { ...prevStats, [mode]: stats } },
    }));
  },
  setGameMode: (gameMode) => {
    set((state) => ({ app: { ...state.app, gameMode } }));
  },
  resetApp: () => {
    set(() => ({ app: initialAppState }));
  },
});
