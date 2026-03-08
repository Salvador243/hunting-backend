export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationResponseDto<T> {
  data: T[];
  meta: PaginationMeta;
}
