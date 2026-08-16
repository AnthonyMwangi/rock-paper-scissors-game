import { Button, ToggleButton } from "@/components/button";
import { useAppContext } from "@/context/app.context";
import { Icons } from "@/images";
import { useGlobalStore } from "@/store";
import { clsx, GameMode, GameModeName } from "@/utilities";
import { FC, useCallback, useMemo, useState } from "react";
import "./footer.styles.scss";

export const Footer: FC = () => {
  const { gameMode, currentPlayerChoice, onResetGame, onToggleModal } =
    useAppContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <footer className={clsx("footer", { isMenuOpen })}>
      <div className="footer-container">
        <ToggleButton selectedOptionID={gameMode} options={gameModes} />
        <Button
          icon="IconRanking"
          label="Leaderboard"
          onClick={() => onToggleModal("leaderboard")}
          className="outline-button"
          id="leaderboard-modal-button"
        />

        <Button
          label="Profile"
          id="username-modal-button"
          onClick={() => onToggleModal("username")}
          className="outline-button"
          icon="IconUser"
        />

        <Button
          label="Rules"
          onClick={() => onToggleModal("rules")}
          className="outline-button"
          id="rules-modal-button"
        />
      </div>

      <button
        data-testid="menu-button"
        onClick={() => setIsMenuOpen((v) => !v)}
        className="fab-action-button"
      >
        {isMenuOpen ? (
          <Icons.IconClose
            className="fab-action-icon"
            data-testid="menu-close-icon"
          />
        ) : (
          <Icons.IconMenu
            className="fab-action-icon"
            data-testid="menu-open-icon"
          />
        )}
      </button>
    </footer>
  );
};
