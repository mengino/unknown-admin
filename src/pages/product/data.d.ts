import { Query } from '@/services/base';
import { UploadFile } from 'antd/lib/upload/interface';

export interface TableListParams {
  title?: string;
  category?: Array<number>;
}

export interface TableListFilter {
  title?: string;
  group?: number;
  category?: number;
}

export interface TableListCreate {
  title: string;
  sort: number;
  size: string;
  intro: string;
  content: string;
  url: string;
  version: string;
  language: number;

  image: string;
  slide: Array<string>;
  group: number;
  category: number;

  status: boolean;
  hot: number;
  top: boolean;
}

export interface TableListItem {
  id: number;
  status: boolean;
  sort: number;
  title: string;
  image: UploadFile<{data: {file_name: string, url: string}, code: number, message: string}>[];
  slide: UploadFile<{data: {file_name: string, url: string}, code: number, message: string}>[];
  category: Array<number>;
  version: string;
  language: number;
  size: string;
  intro: string;
  content: string;
  hot: number;
  top: boolean;
  url: string;
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
