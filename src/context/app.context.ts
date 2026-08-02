import { GameMode, GameOption, GameResult } from "@/utilities";
import { createContext, useContext } from "react";

type AppContextValues = {
  uid: string;
  gameMode: GameMode;
  onResetGame: () => void;
  onToggleRulesModal: () => void;
  onSelectPlayerOption: (option: GameOption) => void;
  currentPlayerChoice?: GameOption;
  currentGameResult?: GameResult;
  currentPlayerResults: GameResult[];
  isRulesModalVisible: boolean;
};

export const AppContext = createContext<AppContextValues>({
  uid: "",
  gameMode: "standard",
  onResetGame: () => undefined,
  onToggleRulesModal: () => undefined,
  onSelectPlayerOption: () => undefined,
  currentPlayerChoice: undefined,
  currentGameResult: undefined,
  currentPlayerResults: [],
  isRulesModalVisible: false,
});

export const useAppContext = () => useContext(AppContext);
