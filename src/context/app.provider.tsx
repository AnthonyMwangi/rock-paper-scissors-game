import { useGlobalStore } from "@/store";
import {
  AUTO_PLAY_TIMEOUT_SECONDS,
  Firebase,
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
import { AppContext } from "./app.context";

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
  const [isRulesModalVisible, setIsRulesModalVisible] = useState(false);

  const onResetGame = useCallback(() => {
    setCurrentPlayerChoice(undefined);
    setCurrentGameResult(undefined);
  }, []);

  const onToggleRulesModal = useCallback(() => {
    const newValue = !isRulesModalVisible;

    if (newValue) {
      Firebase.trackEvent("RPS_RULES_MODAL_VIEWED", { mode: gameMode });
    }

    return setIsRulesModalVisible(newValue);
  }, [gameMode, isRulesModalVisible]);

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
          onResetGame();
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
        isRulesModalVisible,
        onSelectPlayerOption,
        onToggleRulesModal,
        onResetGame,
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
