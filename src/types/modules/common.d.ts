export interface CommonPageData<T = any> {
  keyword?: string;
  page?: number;
  pageSize?: number;
  total?: number;
  [key?: string]: T;
}
export interface CommonTableResult {
  list?: any;
  total: number;
  page: number;
  pageSize: number;
}
export interface CommonIdData {
  id?: number;
}

export interface CommonIdsData {
  ids?: number[];
}
