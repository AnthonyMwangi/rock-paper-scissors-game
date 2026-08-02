import { useAppContext } from "@/context/app.context";
import { FC } from "react";
import "./board.base.styles.scss";
import { GameBoardOutcome } from "./board.outcome.component";
import { GameBoardSelection } from "./board.selection.component";

export const GameBoard: FC = () => {
  const { currentPlayerChoice } = useAppContext();

  return (
    <main className="game-board">
      {!currentPlayerChoice ? <GameBoardSelection /> : <GameBoardOutcome />}
    </main>
  );
};
