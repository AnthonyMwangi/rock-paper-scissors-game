import { initialAppContext } from "@/context/app.context";
import { AppContextValues } from "@/context/app.types";
import { deepMerge, DeepPartial } from "@/utilities";

export class MockAppContext {
  private static state = initialAppContext;

  static getState() {
    return this.state;
  }

  static update(newState: DeepPartial<AppContextValues>) {
    this.state = deepMerge(this.state, newState, {
      allowEmptyValues: true,
    });
  }

  static reset() {
    this.state = initialAppContext;
  }
}
