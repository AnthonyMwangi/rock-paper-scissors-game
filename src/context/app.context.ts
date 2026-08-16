import { createContext, useContext } from "react";
import { AppContextValues } from "./app.types";

export const initialAppContext = {
  uid: "",
  gameMode: "standard",
  onResetGame: () => undefined,
  onToggleModal: () => undefined,
  onSelectPlayerOption: () => undefined,
  currentPlayerChoice: undefined,
  currentGameResult: undefined,
  currentPlayerScore: 0,
  isModalOpen: {
    rules: false,
    leaderboard: false,
    username: false,
  },
} satisfies AppContextValues;

export const AppContext = createContext<AppContextValues>(initialAppContext);

export const useAppContext = () => useContext(AppContext);
