import { useAppContext } from "@/context";
import { GameLogo } from "@/utilities";
import { FC, useMemo } from "react";
import "./header.styles.scss";

export const Header: FC = () => {
  const { gameMode, currentPlayerScore } = useAppContext();

  const LogoComponent = useMemo(() => GameLogo[gameMode], [gameMode]);

  return (
    <header className="header">
      <LogoComponent className="logo" />

      <div className="score-card">
        <span className="score-card-label">SCORE</span>
        <h2 className="score-card-value">{currentPlayerScore}</h2>
      </div>
    </header>
  );
};
