import lodashMerge from "lodash.mergewith";

export function deepMerge<T extends object, S extends object>(
  target: T,
  source: S,
  options?: { allowEmptyValues: boolean },
): T & S {
  return lodashMerge({}, target, source, (objValue, srcValue, key, object) => {
    // force-assign explicit incoming undefined values
    if (srcValue === undefined && !!options?.allowEmptyValues) {
      object[key] = undefined;
      return undefined; // default behavior
    }
  });
}
