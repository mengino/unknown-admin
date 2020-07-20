import request from '@/utils/request';
import { Query } from '@/services/base';
import { TableListFilter, TableListItem, TableListCreate } from './data';

export async function queryRule(params: Query<TableListFilter>) {
  return request('/api/product', {
    params,
  });
}

export async function addRule(params: TableListCreate) {
  console.log(params)
  return request('/api/product', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params: Partial<TableListItem>) {
  return request(`/api/product/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/product', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}
