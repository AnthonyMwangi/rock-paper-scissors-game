import { Footer, GameBoard, Modal } from "@/components";
import {
  AUTO_PLAY_TIMEOUT_SECONDS,
  GameMode,
  GameOption,
  GameResult,
  getUserOutcome,
} from "@/utilities";
import { useCallback, useMemo, useRef, useState } from "react";
import { Header } from "./components";

export const App: React.FC = () => {
  const gameplayTimeoutRef = useRef<NodeJS.Timeout>(null);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout>(null);

  const [gameMode, setGameMode] = useState<GameMode>("standard");
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [selectedOption, setSelectedOption] = useState<GameOption>();
  const [computedResult, setComputedResult] = useState<GameResult>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const userScore = useMemo(() => {
    return gameResults.filter((game) => game.outcome === "win").length;
  }, [gameResults]);

  const handleReset = useCallback(() => {
    setSelectedOption(undefined);
    setComputedResult(undefined);
  }, []);

  const handleToggleGameMode = useCallback(() => {
    setGameMode((currentMode) =>
      currentMode === "standard" ? "bonus" : "standard",
    );
    return handleReset();
  }, [handleReset]);

  const handleSelectOption = useCallback(
    (userChoice: GameOption) => {
      setSelectedOption(userChoice);

      if (gameplayTimeoutRef.current) {
        clearTimeout(gameplayTimeoutRef.current);
      }

      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }

      gameplayTimeoutRef.current = setTimeout(() => {
        const result = getUserOutcome(userChoice, gameMode);

        // Automatically play again if its a draw
        if (result.outcome === "draw") {
          autoplayTimeoutRef.current = setTimeout(() => {
            handleReset();
          }, AUTO_PLAY_TIMEOUT_SECONDS * 1000);
        }

        setGameResults((values) => [...values, result]);
        setComputedResult(result);
      }, 85000);
    },
    [gameMode, handleReset],
  );

  const handleToggleRulesModal = () => {
    setIsModalVisible((currentValue) => !currentValue);
  };

  return (
    <div className="app">
      <div className="content">
        <Header board={gameMode} score={userScore} />

        <GameBoard
          board={gameMode}
          result={computedResult}
          userChoice={selectedOption}
          onSelectOption={handleSelectOption}
          onReset={handleReset}
        />

        <Footer
          board={gameMode}
          onToggleGameMode={handleToggleGameMode}
          onToggleRules={handleToggleRulesModal}
        />

        {isModalVisible ? (
          <Modal board={gameMode} onCloseModal={handleToggleRulesModal} />
        ) : null}
      </div>
    </div>
  );
};
