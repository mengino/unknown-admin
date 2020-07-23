// import { Query } from '@/services/base';
import { UploadFile } from 'antd/lib/upload/interface';

export interface ProductSearch {
  title?: string;
  category?: number[];
}

export interface ProductQuery {
  title?: string;
  group: number;
  category_id: number;
}

export interface ProductAdd {
  title: string;
  sort: number;
  size: string;
  intro: string;
  content: string;
  url: string;
  version: string;
  language: number;

  image: UploadFile<{ data: { file_name: string; url: string }; code: number; message: string }>[];
  slide: UploadFile<{ data: { file_name: string; url: string }; code: number; message: string }>[];
  category: number[];

  status: boolean;
  hot: number;
  top: boolean;
}

export interface ProductCreate {
  title: string;
  sort: number;
  size: string;
  intro: string;
  content: string;
  url: string;
  version: string;
  language: number;

  image: string;
  slide: string[];
  group: number;
  category_id: number;

  status: boolean;
  hot: number;
  top: boolean;
}

export interface ProductItem {
  id: number;
  status: boolean;
  sort: number;
  title: string;
  image: string;
  slide: string[];
  group: number;
  category_id: number;
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

export interface ProductPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface ProductData {
  list: ProductItem[];
  pagination: Partial<ProductPagination>;
}
