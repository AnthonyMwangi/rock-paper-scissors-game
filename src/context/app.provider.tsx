import { useGlobalStore } from "@/store";
import {
  AUTO_PLAY_TIMEOUT_SECONDS,
  Firebase,
  GameModal,
  GameOption,
  GameResult,
} from "@/utilities";
import {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppContext, ModalStatus, OnResetGameOptions } from "./app.context";

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const gameplayTimeoutRef = useRef<NodeJS.Timeout>(null);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout>(null);

  const gameMode = useGlobalStore((state) => state.app.gameMode);
  const isLoading = useGlobalStore((state) => !state.app.hasHydrated);
  const currentPlayer = useGlobalStore((state) => state.app.player);
  const currentPlayerResults = useGlobalStore(
    (state) => state.app.playerResults,
  );

  const [currentPlayerChoice, setCurrentPlayerChoice] = useState<GameOption>();
  const [currentGameResult, setCurrentGameResult] = useState<GameResult>();

  const [isModalVisible, setIsModalVisible] = useState<ModalStatus>({
    rules: false,
    leaderboard: false,
    username: false,
  });

  const onToggleModal = useCallback(
    (
      modal: keyof ModalStatus,
      analyticsEventParams?: Record<string, unknown>,
    ) => {
      return setIsModalVisible((currValue) => {
        const isModalOpen = !currValue[modal];
        const modalAction = isModalOpen ? "VIEWED" : "CLOSED";

        if (isModalOpen) {
          Firebase.trackEvent(
            `RPS_${modal.toUpperCase() as Uppercase<GameModal>}_MODAL_${modalAction}`,
            analyticsEventParams || {},
          );
        }

        return { ...currValue, [modal]: isModalOpen };
      });
    },
    [],
  );

  const onResetGame = useCallback(
    (options: OnResetGameOptions) => {
      // Show the input modal if the player hasn't chosen to stay anonymous
      if (
        options.showUsernameModal &&
        !useGlobalStore.getState().app.player?.displayName &&
        !useGlobalStore.getState().app.playerWantsToStayAnonymous
      ) {
        onToggleModal("username");
      }

      setCurrentPlayerChoice(undefined);
      setCurrentGameResult(undefined);
    },
    [onToggleModal],
  );

  const onSelectPlayerOption = useCallback(
    async (option: GameOption) => {
      setCurrentPlayerChoice(option);

      if (gameplayTimeoutRef.current) {
        clearTimeout(gameplayTimeoutRef.current);
      }

      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }

      const result = await Firebase.savePlayerChoice(option);

      // Automatically play again if its a draw
      if (result.outcome === "draw") {
        autoplayTimeoutRef.current = setTimeout(() => {
          onResetGame({ showUsernameModal: true });
        }, AUTO_PLAY_TIMEOUT_SECONDS * 1000);
      }

      setCurrentGameResult(result);
    },
    [onResetGame],
  );

  useEffect(() => {
    Firebase.guestSignIn();
  }, []);

  return (
    <AppContext.Provider
      value={{
        gameMode,
        currentGameResult,
        currentPlayerChoice,
        currentPlayerResults,
        uid: currentPlayer?.uid || "",
        isModalOpen: isModalVisible,
        onSelectPlayerOption,
        onResetGame,
        onToggleModal,
      }}
    >
      {isLoading || !currentPlayer?.uid ? (
        <div className="app-loading__animation" />
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};
