export interface ErrorResponse {
  message: string | string[];
  statusCode: number;
}

export interface ResultData<T> {
  items?: T[];
  totalCount?: number;
}

export interface ParamsSearch {
  page: number;
  take: number;
  keySearch?: string;
  sortOrder?: 'ASC' | 'DESC';
  showHomePage?: 'Yes' | 'No' | 'Both';
  fromDate?: string | null;
  toDate?: string | null;
  productId?: string | null;
}

export interface BaseTypeResponse {
  id?: string;
  name?: string;
  createdAt?: string;
}
