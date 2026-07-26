import { GameMode, GameOption, GameOptionImage } from "@/utilities";
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
      className={`chip ${option} chip--${isWinningChip ? "winning-chip" : "neutral"} board--${board}`}
      onClick={() => onSelectOption?.(option)}
    >
      <div className="wrapper">
        <img
          className="icon"
          alt={`${option} icon`}
          src={GameOptionImage[option]}
        />
      </div>
      <div className="hover-animation" />
    </button>
  );
};
