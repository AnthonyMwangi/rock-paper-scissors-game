import { GameOption } from "@/utilities";
import { FC } from "react";
import "./board.base.styles.scss";
import {
  GameBoardOutcome,
  GameBoardOutcomeProps,
} from "./board.outcome.component";
import {
  GameBoardSelection,
  GameBoardSelectionProps,
} from "./board.selection.component";

type GameBoardProps = GameBoardSelectionProps &
  Omit<GameBoardOutcomeProps, "userChoice"> & {
    userChoice?: GameOption;
  };

export const GameBoard: FC<GameBoardProps> = ({
  board,
  result,
  userChoice,
  onSelectOption,
  onReset,
}) => {
  return (
    <section className="game-board">
      {!userChoice ? (
        <GameBoardSelection onSelectOption={onSelectOption} board={board} />
      ) : (
        <GameBoardOutcome
          result={result}
          userChoice={userChoice}
          onReset={onReset}
        />
      )}
    </section>
  );
};
