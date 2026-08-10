import { Button, ToggleButton } from "@/components/button";
import { useAppContext } from "@/context/app.context";
import leaderboardIcon from "@/images/ranking.svg";
import { useGlobalStore } from "@/store";
import { classnames, GameMode, GameModeName } from "@/utilities";
import { FC, useCallback, useMemo, useState } from "react";
import "./footer.styles.scss";

export const Footer: FC = () => {
  const { gameMode, currentPlayerChoice, onResetGame, onToggleModal } =
    useAppContext();

  const [showFabActions, setShowFabActions] = useState(false);

  const handleToggleGameMode = useCallback(
    (mode: GameMode) => {
      if (mode === gameMode) return;
      useGlobalStore.getState().setGameMode(mode);
      return onResetGame({ showUsernameModal: false });
    },
    [gameMode, onResetGame],
  );

  const gameModes = useMemo(() => {
    return Object.entries(GameModeName).map(([name, label]) => ({
      id: name,
      disabled: !!currentPlayerChoice,
      onClick: () => handleToggleGameMode(name as GameMode),
      label,
    }));
  }, [currentPlayerChoice, handleToggleGameMode]);

  return (
    <footer className="footer">
      <div
        className={classnames("footer-container", {
          isMobileOpen: showFabActions,
        })}
      >
        <ToggleButton selectedOptionID={gameMode} options={gameModes} />
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
      </div>

      <button
        onClick={() => setShowFabActions((v) => !v)}
        className={classnames("fab-action-button", {
          isMenuOpen: showFabActions,
        })}
      />
    </footer>
  );
};
