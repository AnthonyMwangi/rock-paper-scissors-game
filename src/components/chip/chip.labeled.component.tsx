import { GameOption } from "@/utilities";
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
    <div className="selected-option">
      <label className="selection-label">{label}</label>

      {option ? (
        <Chip board="outcome" isWinningChip={isWinningChip} option={option} />
      ) : (
        <div className="chip board--outcome chip--loader" />
      )}
    </div>
  );
};
