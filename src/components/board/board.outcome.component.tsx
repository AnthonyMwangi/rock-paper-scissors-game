import { LabeledChip } from "@/components";
import {
  AUTO_PLAY_TIMEOUT_SECONDS,
  classnames,
  GameOption,
  GameOutcomeLabel,
  GameResult,
} from "@/utilities";
import { FC } from "react";

export type GameBoardOutcomeProps = {
  userChoice: GameOption;
  result?: GameResult;
  onReset: () => void;
};

export const GameBoardOutcome: FC<GameBoardOutcomeProps> = ({
  result,
  userChoice,
  onReset,
}) => {
  return (
    <div
      className={classnames("board-content-wrapper", {
        isLoading: !result?.outcome,
        board: "outcome",
      })}
    >
      <LabeledChip
        label="YOU PICKED"
        isWinningChip={["win", "draw"].includes(result?.outcome || "")}
        option={userChoice}
      />

      {result?.outcome ? (
        <div className="selection-outcome">
          <label>{GameOutcomeLabel[result.outcome]}</label>

          <button
            className={classnames(`button`, { outcome: result.outcome })}
            style={{
              animationDuration: `${AUTO_PLAY_TIMEOUT_SECONDS}s`,
            }}
            onClick={onReset}
          >
            <span>Play Again</span>
          </button>
        </div>
      ) : null}

      <LabeledChip
        label="THE HOUSE PICKED"
        isWinningChip={["lose", "draw"].includes(result?.outcome || "")}
        option={result?.houseChoice}
      />
    </div>
  );
};
