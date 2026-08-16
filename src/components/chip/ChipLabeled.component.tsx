import "./ChipLabeled.styles.scss";

import { clsx, GameOption } from "@/utilities";
import { FC } from "react";
import { Chip } from "./Chip.component";

type LabeledChipProps = {
  option?: GameOption;
  isWinningChip: boolean;
  label: string;
};

export const LabeledChip: FC<LabeledChipProps> = ({
  label,
  option,
  isWinningChip,
}) => {
  return (
    <section className="selected-option">
      <span className="selection-label">{label}</span>

      {option ? (
        <Chip board="outcome" isWinningChip={isWinningChip} option={option} />
      ) : (
        <div
          className={clsx("chip", {
            status: "loading",
            board: "outcome",
          })}
        />
      )}
    </section>
  );
};
