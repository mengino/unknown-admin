import Query from '@/services/base'

export interface TableListQuery extends Query {
  name?: string;
  group?: 1 | 2 | 3;
}

export interface TableListItem {
  id: number;
  status: boolean;
  name: string;
  group: 1 | 2 | 3;
  sort: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}
