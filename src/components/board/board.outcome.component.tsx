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
          <span className="outcome-label">
            {GameOutcomeLabel[currentGameResult.outcome]}
          </span>

          <button
            className={classnames("outcome-button", {
              outcome: currentGameResult.outcome,
            })}
            style={{
              animationDuration: `${AUTO_PLAY_TIMEOUT_SECONDS}s`,
            }}
            onClick={() => onResetGame({ showUsernameModal: true })}
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
