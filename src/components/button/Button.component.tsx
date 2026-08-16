import "./Button.styles.scss";

import { useLayout } from "@/hooks";
import { Icons } from "@/images";
import { FC, useMemo, useState } from "react";

export type ButtonProps = {
  id?: string;
  icon?: keyof typeof Icons;
  label: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export const Button: FC<ButtonProps> = ({
  id,
  icon,
  label,
  disabled,
  className = "",
  isLoading,
  onClick,
}) => {
  const [iconSize, setIconSize] = useState("auto");

  const IconComponent = useMemo(() => {
    if (isLoading) return Icons.IconLoader;
    return icon ? Icons[icon] : null;
  }, [icon, isLoading]);

  // Handler to match icon height to span font size
  const spanLayoutRef = useLayout((e) => {
    setIconSize(`${e.layout.height * 1.1}px`);
  });

  return (
    <button
      onClick={() => onClick?.()}
      disabled={!!disabled || !!isLoading}
      className={`button ${className}`.trim()}
      data-testid={`${(id || label.toLowerCase()).replace(" ", "-")}`}
      data-id={id || label.toLowerCase()}
      data-label={label.toLowerCase()}
    >
      {IconComponent ? (
        <IconComponent
          style={{ width: iconSize }}
          data-testid="button-icon"
          className="button-icon"
        />
      ) : null}

      <span ref={spanLayoutRef} className="button-text">
        {label}
      </span>
    </button>
  );
};
