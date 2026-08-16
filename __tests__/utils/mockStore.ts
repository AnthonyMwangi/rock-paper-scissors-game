import { initialAppState } from "@/store/store.app.slice";
import { AppState, AppStore } from "@/store/store.app.types";
import { deepMerge, DeepPartial } from "@/utilities";

export class MockStore {
  private static actions = {};
  private static state = initialAppState;

  static getState() {
    return {
      app: this.state,
      ...this.actions,
    };
  }

  static update(newState: DeepPartial<Omit<AppStore, "app"> & AppState>) {
    const newActions = {} as Record<keyof Omit<AppStore, "app">, unknown>;
    const newAppState = {} as Record<keyof AppState, unknown>;

    Object.entries(newState).forEach(([key, value]) => {
      if (typeof value === "function") {
        newActions[key as keyof Omit<AppStore, "app">] = value;
      } else {
        newAppState[key as keyof AppState] = value;
      }
    });

    this.state = deepMerge(this.state, newAppState, {
      allowEmptyValues: true,
    });

    this.actions = deepMerge(this.actions, newActions, {
      allowEmptyValues: true,
    });
  }

  static reset() {
    this.state = initialAppState;
  }
}
