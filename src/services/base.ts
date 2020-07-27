export interface Query<T = { [key: string]: any[] }> {
  pageSize?: number;
  currentPage?: number;
  filter?: T;
  sorter?: { [key: string]: 'descend' | 'ascend' };
}
