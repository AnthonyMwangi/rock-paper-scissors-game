import clsx from "clsx";

type ModifierValue = boolean | string | number | undefined | null;

function toKebabCase(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function classnames(
  baseName: string,
  modifiers: Record<string, ModifierValue> = {},
) {
  return clsx(
    baseName,
    ...Object.entries(modifiers)
      .filter(([, value]) => !!value)
      .map(([key, value]) => {
        const kebabKey = toKebabCase(key);
        return typeof value === "boolean"
          ? `${baseName}--${kebabKey}`
          : `${baseName}__${kebabKey}-${value}`;
      }),
  );
}
