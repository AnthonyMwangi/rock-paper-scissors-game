import { useAppContext } from "@/context/app.context";
import { useGlobalStore } from "@/store";
import { GameMode } from "@/utilities";
import { FC, useCallback } from "react";
import "./footer.styles.scss";

export const Footer: FC = () => {
  const { gameMode, onToggleRulesModal } = useAppContext();

  const handleToggleGameMode = useCallback(() => {
    const newMode: GameMode = gameMode === "standard" ? "bonus" : "standard";
    return useGlobalStore.getState().setGameMode(newMode);
  }, [gameMode]);

  return (
    <footer className="footer">
      <button className="button-toggle" onClick={handleToggleGameMode}>
        <span className={gameMode === "standard" ? "selected" : ""}>
          Original
        </span>
        <span className={gameMode === "bonus" ? "selected" : ""}>Bonus</span>
      </button>

      <button className="button-outline" onClick={onToggleRulesModal}>
        <span>Rules</span>
      </button>
    </footer>
  );
};
