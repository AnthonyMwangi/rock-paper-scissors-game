export type CamelToSnake<S extends string> =
  S extends `${infer Head}${infer Tail}`
    ? Head extends Uppercase<Head>
      ? Head extends Lowercase<Head>
        ? `${Head}${CamelToSnake<Tail>}` // non-letter char (number, _, etc.) — leave as-is
        : `_${Lowercase<Head>}${CamelToSnake<Tail>}` // actual uppercase letter — snake it
      : `${Head}${CamelToSnake<Tail>}`
    : S;

export type SnakeCaseKeys<T> = T extends readonly (infer U)[]
  ? SnakeCaseKeys<U>[]
  : T extends Date
    ? T
    : T extends object
      ? { [K in keyof T as CamelToSnake<K & string>]: SnakeCaseKeys<T[K]> }
      : T;

export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

export function toKebabCase(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function objectKeysToSnakeCase<T extends object>(
  input: T,
): SnakeCaseKeys<T> {
  if (Array.isArray(input)) {
    return input.map(objectKeysToSnakeCase) as SnakeCaseKeys<T>;
  }

  if (input !== null && typeof input === "object" && !(input instanceof Date)) {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        toSnakeCase(key),
        objectKeysToSnakeCase(value),
      ]),
    ) as SnakeCaseKeys<T>;
  }

  return input as SnakeCaseKeys<T>;
}
