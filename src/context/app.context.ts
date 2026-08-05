import { GameMode, GameOption, GameResult } from "@/utilities";
import { createContext, useContext } from "react";

export type OnResetGameOptions = {
  showUsernameModal: boolean;
};

type AppContextValues = {
  uid: string;
  gameMode: GameMode;
  onResetGame: (options: OnResetGameOptions) => void;
  onToggleRulesModal: () => void;
  onToggleUsernameModal: () => void;
  onSelectPlayerOption: (option: GameOption) => void;
  currentPlayerChoice?: GameOption;
  currentGameResult?: GameResult;
  currentPlayerResults: GameResult[];
  isUsernameModalVisible: boolean;
  isRulesModalVisible: boolean;
};

export const AppContext = createContext<AppContextValues>({
  uid: "",
  gameMode: "standard",
  onResetGame: () => undefined,
  onToggleRulesModal: () => undefined,
  onToggleUsernameModal: () => undefined,
  onSelectPlayerOption: () => undefined,
  currentPlayerChoice: undefined,
  currentGameResult: undefined,
  currentPlayerResults: [],
  isUsernameModalVisible: false,
  isRulesModalVisible: false,
});

export const useAppContext = () => useContext(AppContext);
