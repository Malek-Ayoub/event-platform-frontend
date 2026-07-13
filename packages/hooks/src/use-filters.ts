import { useCallback, useMemo, useState } from 'react';

export type FilterMap = Record<string, string | number | boolean | null | undefined>;

export function useFilters<T extends FilterMap>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters);

  const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  }, []);

  const patchFilters = useCallback((patch: Partial<T>) => {
    setFilters((current) => ({ ...current, ...patch }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const activeCount = useMemo(
    () =>
      Object.values(filters).filter(
        (value) => value !== null && value !== undefined && value !== '',
      ).length,
    [filters],
  );

  return {
    filters,
    setFilter,
    patchFilters,
    resetFilters,
    activeCount,
  };
}
