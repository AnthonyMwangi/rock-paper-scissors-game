import { useLayout } from "@/hooks";
import { FC, useState } from "react";
import "./button.styles.scss";

type ButtonProps = {
  id?: string;
  icon?: string;
  label: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const Button: FC<ButtonProps> = ({
  id,
  icon,
  label,
  disabled,
  className = "",
  onClick,
}) => {
  const [iconSize, setIconSize] = useState("auto");

  // Handler to match icon height to span font size
  const spanLayoutRef = useLayout((e) =>
    setIconSize(`${e.layout.height * 1}px`),
  );

  return (
    <button
      onClick={() => onClick?.()}
      className={`button ${className}`.trim()}
      disabled={!!disabled}
      data-label={label}
      data-id={id}
    >
      {icon ? (
        <img
          src={icon}
          alt={`${label.toLowerCase()} button  icon`}
          style={{ width: iconSize, height: "auto" }}
          className="button-icon"
        />
      ) : null}

      <span ref={spanLayoutRef} className="button-text">
        {label}
      </span>
    </button>
  );
};
