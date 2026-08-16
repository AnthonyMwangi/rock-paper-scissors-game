import "./Chip.styles.scss";

import { clsx, GameMode, GameOption, GameOptionImage } from "@/utilities";
import { FC, useMemo } from "react";

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
  const Icon = useMemo(() => GameOptionImage[option], [option]);

  return (
    <button
      data-option={option}
      data-winning={isWinningChip}
      onClick={() => onSelectOption?.(option)}
      className={clsx("chip", {
        status: isWinningChip ? "winner" : "neutral",
        option,
        board,
      })}
    >
      <div className="chip-wrapper">
        <Icon className="chip-icon" />
      </div>
      <div className="chip-hover-animation" />
    </button>
  );
};
