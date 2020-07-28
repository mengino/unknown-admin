// import { Query } from '@/services/base';
import { UploadFile } from 'antd/lib/upload/interface';

export interface ArticleSearch {
  title?: string;
  category_id?: number;
  product_id?: number;
}

export interface ArticleQuery {
  title?: string;
  category_id?: number;
  product_id?: number;
}

export interface ArticleAdd {
  title: string;
  sort: number;
  content: string;

  image: UploadFile<{ data: { file_name: string; url: string }; code: number; message: string }>[];
  category_id: number;
  product_id: number;
}

export interface ArticleCreate {
  title: string;
  sort: number;
  content: string;

  image: string;
  category_id: number;
  product_id: number;
}

export interface ArticleEdit {
  id: number;
  title: string;
  sort: number;
  content: string;

  image: UploadFile<{ data: { file_name: string; url: string }; code: number; message: string }>[];
  category_id: number;
  product_id: number;
  product: {
    title: string;
  };
}

export interface ArticleUpdate {
  id: number;
  title: string;
  sort: number;
  content: string;

  image: string;
  category_id: number;
  product_id: number;
}

export interface ArticleItem {
  id: number;
  title: string;
  sort: number;
  content: string;
  image: string;
  category_id: number;
  product_id: number;
  product: {
    title: string;
  };
  updatedAt: Date;
  createdAt: Date;
}

export interface ArticlePagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface ArticleData {
  list: ArticleItem[];
  pagination: Partial<ArticlePagination>;
}
