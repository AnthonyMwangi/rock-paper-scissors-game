import { useLayout } from "@/hooks";
import { Icons } from "@/images";
import { FC, useMemo, useState } from "react";
import "./button.base.styles.scss";

export type ButtonProps = {
  id?: string;
  icon?: keyof typeof Icons;
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

  const IconComponent = useMemo(() => (icon ? Icons[icon] : null), [icon]);

  // Handler to match icon height to span font size
  const spanLayoutRef = useLayout((e) =>
    setIconSize(`${e.layout.height * 1.1}px`),
  );

  return (
    <button
      onClick={() => onClick?.()}
      className={`button ${className}`.trim()}
      disabled={!!disabled}
      data-label={label}
      data-id={id}
    >
      {IconComponent ? (
        <IconComponent
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
