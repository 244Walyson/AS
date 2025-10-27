export type PaginationType<T> = {
  content: T[];
  page: number;
  size: number;
  totalItems?: number;
  totalPages?: number;
  isFirstPage?: boolean;
  isLastPage?: boolean;
};