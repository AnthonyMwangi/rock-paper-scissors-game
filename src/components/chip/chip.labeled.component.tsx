import { clsx, GameOption } from "@/utilities";
import { FC } from "react";
import { Chip } from "./chip.base.component";
import "./chip.labeled.styles.scss";

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
