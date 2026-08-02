import { LabeledChip } from "@/components";
import { useAppContext } from "@/context/app.context";
import {
  AUTO_PLAY_TIMEOUT_SECONDS,
  classnames,
  GameOutcomeLabel,
} from "@/utilities";
import { FC } from "react";

export const GameBoardOutcome: FC = () => {
  const { currentPlayerChoice, currentGameResult, onResetGame } =
    useAppContext();

  return (
    <div
      className={classnames("board-content-wrapper", {
        isLoading: !currentGameResult?.outcome,
        board: "outcome",
      })}
    >
      <LabeledChip
        label="YOU PICKED"
        isWinningChip={["win", "draw"].includes(
          currentGameResult?.outcome || "",
        )}
        option={currentPlayerChoice}
      />

      {currentGameResult?.outcome ? (
        <div className="selection-outcome">
          <label>{GameOutcomeLabel[currentGameResult.outcome]}</label>

          <button
            className={classnames(`button`, {
              outcome: currentGameResult.outcome,
            })}
            style={{
              animationDuration: `${AUTO_PLAY_TIMEOUT_SECONDS}s`,
            }}
            onClick={onResetGame}
          >
            <span>Play Again</span>
          </button>
        </div>
      ) : null}

      <LabeledChip
        label="THE HOUSE PICKED"
        isWinningChip={["lose", "draw"].includes(
          currentGameResult?.outcome || "",
        )}
        option={currentGameResult?.opponentChoice}
      />
    </div>
  );
};
