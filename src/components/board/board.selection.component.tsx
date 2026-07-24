import { Chip } from "@/components/chip";
import { GameMode, GameOption, GameOptions } from "@/utilities";
import { FC, useMemo } from "react";

export type GameBoardSelectionProps = {
  board: GameMode;
  onSelectOption: (option: GameOption) => void;
};

export const GameBoardSelection: FC<GameBoardSelectionProps> = ({
  board,
  onSelectOption,
}) => {
  const options = useMemo(() => GameOptions[board], [board]);

  return (
    <div className={`board-content-wrapper board--${board}`}>
      {options.map((option) => (
        <Chip
          key={option}
          option={option}
          onSelectOption={onSelectOption}
          board={board}
        />
      ))}
    </div>
  );
};
