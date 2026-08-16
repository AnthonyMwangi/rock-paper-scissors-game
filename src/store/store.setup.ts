import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createAppSlice, initialAppState } from "./store.app.slice";
import { AppStore } from "./store.app.types";

type GlobalStore = AppStore;

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (...a) => ({
      ...createAppSlice(...a),
    }),
    {
      name: "rps-global-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        app: { ...initialAppState, ...state.app },
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
