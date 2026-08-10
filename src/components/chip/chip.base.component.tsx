import { classnames, GameMode, GameOption, GameOptionImage } from "@/utilities";
import { FC, useMemo } from "react";
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
  const Icon = useMemo(() => GameOptionImage[option], [option]);

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
        <div className="chip-icon">
          <Icon style={{ width: "100%", height: "auto" }} />
        </div>
      </div>
      <div className="chip-hover-animation" />
    </button>
  );
};
