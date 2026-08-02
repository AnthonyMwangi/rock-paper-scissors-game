import { useAppContext } from "@/context";
import { GameLogo, GameOutcomePoints } from "@/utilities";
import { FC, useMemo } from "react";
import "./header.styles.scss";

export const Header: FC = () => {
  const { gameMode, currentPlayerResults } = useAppContext();

  const logo = useMemo(() => GameLogo[gameMode], [gameMode]);

  const playerScore = useMemo(() => {
    return currentPlayerResults
      .filter((result) => result.mode === gameMode)
      .reduce((total, result) => total + GameOutcomePoints[result.outcome], 0);
  }, [currentPlayerResults, gameMode]);

  return (
    <header className="header">
      <img className="logo" alt="app logo" src={logo} />

      <div className="score-card">
        <label>SCORE</label>
        <h2>{playerScore}</h2>
      </div>
    </header>
  );
};
