import { Chip } from "@/components/chip";
import { useAppContext } from "@/context/app.context";
import { classnames, GameOptions } from "@/utilities";
import { FC, useMemo } from "react";

export const GameBoardSelection: FC = () => {
  const { gameMode, onSelectPlayerOption } = useAppContext();

  const options = useMemo(() => GameOptions[gameMode], [gameMode]);

  return (
    <div className={classnames("board-content-wrapper", { board: gameMode })}>
      {options.map((option) => (
        <Chip
          key={option}
          option={option}
          onSelectOption={onSelectPlayerOption}
          board={gameMode}
        />
      ))}
    </div>
  );
};
