import clsxUtil from "clsx";
import { toKebabCase } from "./utilities.parsers";

export type ModifierValue = boolean | string | number | undefined | null;

export function clsx(
  baseName: string,
  modifiers: Record<string, ModifierValue> = {},
) {
  return clsxUtil(
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
