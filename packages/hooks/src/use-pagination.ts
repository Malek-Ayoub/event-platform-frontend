import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '@event-platform/shared';

export type PaginationState = {
  page: number;
  pageSize: number;
};

export type PaginationResult = PaginationState & {
  offset: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  reset: () => void;
};

export function usePagination(
  initialPage = 1,
  initialPageSize: number = DEFAULT_PAGE_SIZE,
): PaginationResult {
  const [page, setPageState] = useState(Math.max(1, initialPage));
  const [pageSize, setPageSizeState] = useState(Math.max(1, initialPageSize));

  const setPage = useCallback((nextPage: number) => {
    setPageState(Math.max(1, nextPage));
  }, []);

  const setPageSize = useCallback((nextPageSize: number) => {
    setPageSizeState(Math.max(1, nextPageSize));
    setPageState(1);
  }, []);

  const nextPage = useCallback(() => {
    setPageState((current) => current + 1);
  }, []);

  const previousPage = useCallback(() => {
    setPageState((current) => Math.max(1, current - 1));
  }, []);

  const reset = useCallback(() => {
    setPageState(Math.max(1, initialPage));
    setPageSizeState(Math.max(1, initialPageSize));
  }, [initialPage, initialPageSize]);

  const offset = useMemo(() => (page - 1) * pageSize, [page, pageSize]);

  return {
    page,
    pageSize,
    offset,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    reset,
  };
}
