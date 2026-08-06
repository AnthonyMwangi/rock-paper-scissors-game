import { Button } from "@/components/button";
import { useAppContext } from "@/context/app.context";
import leaderboardIcon from "@/images/ranking.svg";
import { useGlobalStore } from "@/store";
import { classnames, GameMode, GameModeName } from "@/utilities";
import { FC, useCallback, useMemo, useState } from "react";
import "./footer.styles.scss";

export const Footer: FC = () => {
  const [prevState, setPrevState] = useState<GameMode>(
    useGlobalStore.getState().app.gameMode,
  );

  const { gameMode, currentPlayerChoice, onResetGame, onToggleModal } =
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

  const gameModes = useMemo(
    () =>
      Object.entries(GameModeName).map(([name, label]) => ({
        name: name as GameMode,
        label,
      })),
    [],
  );

  return (
    <footer className="footer">
      <div className="toggle-button-wrapper">
        {gameModes.map((option) => (
          <Button
            id={option.name}
            key={option.name}
            label={option.label}
            disabled={!!currentPlayerChoice}
            onClick={() => handleToggleGameMode(option.name)}
            className={classnames("toggle-button", {
              isSelected: gameMode === option.name,
              isPrev: prevState === option.name,
            })}
          />
        ))}
      </div>

      <Button
        label="Leaderboard"
        icon={leaderboardIcon}
        onClick={() => onToggleModal("leaderboard")}
        className="outline-button"
      />

      <Button
        label="Rules"
        onClick={() => onToggleModal("rules")}
        className="outline-button"
      />
    </footer>
  );
};
