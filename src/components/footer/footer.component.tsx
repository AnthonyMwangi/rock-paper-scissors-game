import { useAppContext } from "@/context/app.context";
import { useGlobalStore } from "@/store";
import { classnames, GameMode } from "@/utilities";
import { FC, useCallback, useMemo, useState } from "react";
import "./footer.styles.scss";

export const Footer: FC = () => {
  const [prevState, setPrevState] = useState<GameMode>(
    useGlobalStore.getState().app.gameMode,
  );

  const { gameMode, currentPlayerChoice, onToggleRulesModal, onResetGame } =
    useAppContext();

  const handleToggleGameMode = useCallback(
    (mode: GameMode) => {
      if (mode === gameMode) return;
      setPrevState(gameMode);
      useGlobalStore.getState().setGameMode(mode);
      return onResetGame({ showUsernameModal: false });
    },
    [gameMode, onResetGame],
  );

  const options = useMemo<GameMode[]>(() => ["standard", "bonus"], []);

  return (
    <footer className="footer">
      <div className="toggle-button-wrapper">
        {options.map((option) => (
          <button
            key={option}
            data-option-name={option}
            disabled={!!currentPlayerChoice}
            onClick={() => handleToggleGameMode(option)}
            className={classnames("toggle-button", {
              isSelected: gameMode === option,
              isPrev: prevState === option,
            })}
          />
        ))}
      </div>

      <button className="outline-button" onClick={onToggleRulesModal}>
        <span>Rules</span>
      </button>
    </footer>
  );
};
