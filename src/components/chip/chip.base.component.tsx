import { classnames, GameMode, GameOption, GameOptionImage } from "@/utilities";
import { FC } from "react";
import "./chip.base.styles.scss";

type ChipProps = {
  board: GameMode | "outcome";
  option: GameOption;
  onSelectOption?: (option: GameOption) => void;
  isWinningChip?: boolean;
};

export const Chip: FC<ChipProps> = ({
  board,
  option,
  isWinningChip,
  onSelectOption,
}) => {
  return (
    <button
      onClick={() => onSelectOption?.(option)}
      className={classnames("chip", {
        status: isWinningChip ? "winner" : "neutral",
        option,
        board,
      })}
    >
      <div className="chip-wrapper">
        <img
          className="chip-icon"
          alt={`chip ${option} icon`}
          src={GameOptionImage[option]}
        />
      </div>
      <div className="chip-hover-animation" />
    </button>
  );
};
