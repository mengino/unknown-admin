import request from '@/utils/request';
import { Query } from '@/services/base';
import { ArticleQuery, ArticleCreate, ArticleUpdate } from './data';

export async function queryRule(params?: ArticleQuery & Query) {
  return request('/api/article', {
    params,
  });
}

export async function addRule(params: Partial<ArticleCreate>) {
  return request('/api/article', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params: Partial<ArticleUpdate>) {
  return request(`/api/article/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/article', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}
