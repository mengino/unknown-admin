// import Query from '@/services/base';

export interface CategorySearch {
  name?: string;
  group?: 1 | 2 | 3;
}

export interface CategoryQuery {
  name?: string;
  group?: 1 | 2 | 3;
}

export interface CategoryAdd {
  name: string;
  group: 1 | 2 | 3;
  sort: number;
}
export interface CategoryCreate {
  name: string;
  group: 1 | 2 | 3;
  sort: number;
}

export interface CategoryEdit {
  id: number;
  name: string;
  group: 1 | 2 | 3;
  sort: number;
}
export interface CategoryUpdate {
  id: number;
  name: string;
  group: 1 | 2 | 3;
  sort: number;
}

export interface CategoryItem {
  id: number;
  name: string;
  group: 1 | 2 | 3;
  sort: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface CategoryPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface CategoryData {
  list: CategoryItem[];
  pagination: Partial<CategoryPagination>;
}
