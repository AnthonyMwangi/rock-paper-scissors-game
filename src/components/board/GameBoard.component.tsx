import "./GameBoard.styles.scss";

import { useAppContext } from "@/context/app.context";
import { FC } from "react";
import { GameBoardOutcome } from "./GameBoardOutcome.component";
import { GameBoardSelection } from "./GameBoardSelection.component";

export const GameBoard: FC = () => {
  const { currentPlayerChoice } = useAppContext();

  return (
    <main className="game-board">
      {!currentPlayerChoice ? <GameBoardSelection /> : <GameBoardOutcome />}
    </main>
  );
};
