import { GameModal, GameMode, GameOption, GameResult } from "@/utilities";
import { createContext, useContext } from "react";

export type OnResetGameOptions = {
  showUsernameModal: boolean;
};

export type ModalStatus = Record<Lowercase<GameModal>, boolean>;

export type AppContextValues = {
  uid: string;
  gameMode: GameMode;
  onResetGame: (options: OnResetGameOptions) => void;
  onToggleModal: (
    modal: Lowercase<GameModal>,
    options?: Record<string, unknown>,
  ) => void;
  onSelectPlayerOption: (option: GameOption) => void;
  currentPlayerChoice?: GameOption;
  currentGameResult?: GameResult;
  currentPlayerScore: number;
  isModalOpen: ModalStatus;
};

export const AppContext = createContext<AppContextValues>({
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
});

export const useAppContext = () => useContext(AppContext);
