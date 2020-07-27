import request from '@/utils/request';
import { Query } from '@/services/base';
import { CategorySearch, CategoryCreate, CategoryUpdate } from './data';

export async function queryRule(params?: CategorySearch & Query) {
  return request('/api/category', {
    params,
  });
}

export async function addRule(params: Partial<CategoryCreate>) {
  return request('/api/category', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params: Partial<CategoryUpdate>) {
  return request(`/api/category/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/category', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}
