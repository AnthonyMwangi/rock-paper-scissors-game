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

function parseToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

export function toSnakeCase<T>(input: T): SnakeCaseKeys<T> {
  if (Array.isArray(input)) {
    return input.map(toSnakeCase) as SnakeCaseKeys<T>;
  }

  if (input !== null && typeof input === "object" && !(input instanceof Date)) {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        parseToSnakeCase(key),
        toSnakeCase(value),
      ]),
    ) as SnakeCaseKeys<T>;
  }

  return input as SnakeCaseKeys<T>;
}
