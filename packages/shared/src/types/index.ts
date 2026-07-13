import type { CurrencyCode } from '../constants/index.js';

/** Monetary amount represented as a decimal string (matches backend API). */
export type MoneyAmount = string;

/** Inclusive calendar date range (`from` / `to` query params). */
export type DateRange = {
  from: string | null;
  to: string | null;
};

/** Standard Laravel paginator meta shape. */
export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
};

/** Generic API envelope used by dashboard and report endpoints. */
export type ApiDataResponse<TData> = {
  data: TData;
};

export type ApiPaginatedResponse<TItem> = {
  data: TItem[];
  meta: PaginationMeta;
};

export type ApiErrorBody = {
  message: string;
  errors?: Record<string, string[]>;
};

export type Money = {
  amount: MoneyAmount;
  currency: CurrencyCode;
};

export type IsoDateTimeString = string;

export type Nullable<T> = T | null;
