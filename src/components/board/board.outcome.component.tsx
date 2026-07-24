import { Chip } from "@/components";
import {
  AUTO_PLAY_TIMEOUT_SECONDS,
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
      className={`board-content-wrapper board--outcome board--status-${result?.outcome ? "loaded" : "loading"}`}
    >
      <div className="selected-option selection--user">
        <label className="selection-label">YOU PICKED</label>
        <Chip
          option={userChoice}
          board={"outcome"}
          isWinningChip={["win", "draw"].includes(result?.outcome || "")}
        />
      </div>

      {result?.outcome ? (
        <div className="selection-outcome">
          <label>{GameOutcomeLabel[result.outcome]}</label>

          <button
            className={`button--${result.outcome}`}
            style={{
              animationDuration: `${AUTO_PLAY_TIMEOUT_SECONDS}s`,
            }}
            onClick={onReset}
          >
            <span>Play Again</span>
          </button>
        </div>
      ) : null}

      <div className="selected-option selection--house">
        <label className="selection-label">THE HOUSE PICKED</label>

        {result?.houseChoice ? (
          <Chip
            board="outcome"
            option={result.houseChoice}
            isWinningChip={["lose", "draw"].includes(result.outcome)}
          />
        ) : (
          <div className="chip chip--loader" />
        )}
      </div>
    </div>
  );
};
