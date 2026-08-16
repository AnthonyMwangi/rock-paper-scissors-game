import { ModalStatus, OnResetGameOptions } from "@/context/app.types";
import { Icons } from "@/images";
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
  useMemo,
  useRef,
  useState,
} from "react";
import { AppContext } from "./app.context";

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const gameplayTimeoutRef = useRef<NodeJS.Timeout>(null);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout>(null);

  const gameMode = useGlobalStore((state) => state.app.gameMode);
  const isLoading = useGlobalStore((state) => !state.app.hasHydrated);
  const currentPlayerStats = useGlobalStore((state) => state.app.playerStats);

  const currentPlayer = useGlobalStore((state) => state.app.player);

  const currentPlayerScore = useMemo(
    () => currentPlayerStats?.[gameMode]?.netScore ?? 0,
    [currentPlayerStats, gameMode],
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

        return {
          ...(Object.fromEntries(
            Object.entries(currValue).map(([key]) => [key, false]),
          ) as ModalStatus),
          [modal]: isModalOpen,
        };
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
      try {
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
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("RPS_SAVE_RESULT", (e as Error).message);
        onResetGame({ showUsernameModal: false });
      }
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
        currentPlayerScore,
        uid: currentPlayer?.uid || "",
        isModalOpen: isModalVisible,
        onSelectPlayerOption,
        onResetGame,
        onToggleModal,
      }}
    >
      {isLoading || !currentPlayer?.uid ? (
        <div className="app-loader-wrapper">
          <Icons.IconLoader className="loading-icon" />
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};
