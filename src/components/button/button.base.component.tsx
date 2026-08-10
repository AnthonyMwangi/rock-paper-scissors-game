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
  const spanLayoutRef = useLayout((e) =>
    setIconSize(`${e.layout.height * 1.1}px`),
  );

  return (
    <button
      onClick={() => onClick?.()}
      className={`button ${className}`.trim()}
      disabled={!!disabled || !!isLoading}
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
