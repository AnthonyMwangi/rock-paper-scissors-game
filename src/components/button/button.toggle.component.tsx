import { clsx } from "@/utilities";
import { FC } from "react";
import { Button, ButtonProps } from "./button.base.component";
import "./button.toggle.styles.scss";

type ToggleButtonProps = {
  selectedOptionID: string;
  options: Omit<ButtonProps, "className">[];
  theme?: "light" | "dark";
};

export const ToggleButton: FC<ToggleButtonProps> = ({
  options,
  selectedOptionID,
  theme = "light",
}) => {
  return (
    <div className={clsx("toggle-button-wrapper", { theme })}>
      {options.map((option) => (
        <Button
          {...option}
          className={clsx("toggle-button", {
            isSelected: option.id === selectedOptionID,
            theme,
          })}
          key={option.label}
        />
      ))}
    </div>
  );
};
