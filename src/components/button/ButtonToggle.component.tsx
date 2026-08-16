import "./ButtonToggle.styles.scss";

import { clsx } from "@/utilities";
import { FC } from "react";
import { Button, ButtonProps } from "./Button.component";

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
    <div
      className={clsx("toggle-button-wrapper", { theme })}
      data-testid="toggle-button-wrapper"
    >
      {options.map((option) => (
        <Button
          {...option}
          id={`${option.id}-toggle-button`}
          className={clsx("toggle-button", {
            disabled: option.disabled,
            isSelected: option.id === selectedOptionID,
            option: option.id,
            theme,
          })}
          key={option.label}
        />
      ))}
    </div>
  );
};
