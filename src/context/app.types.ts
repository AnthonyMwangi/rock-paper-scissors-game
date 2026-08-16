import { GameModal, GameMode, GameOption, GameResult } from "@/utilities";

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
