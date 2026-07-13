export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  keys: readonly K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (key in object) {
      result[key] = object[key];
    }
  }

  return result;
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  keys: readonly K[],
): Omit<T, K> {
  const result = { ...object };

  for (const key of keys) {
    delete result[key];
  }

  return result;
}

export function compact<T>(values: readonly (T | null | undefined | false)[]): T[] {
  return values.filter((value): value is T => Boolean(value));
}
