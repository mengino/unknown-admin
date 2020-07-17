import request from '@/utils/request';
import { TableListQuery, TableListItem } from './data';

export async function queryRule(params?: TableListQuery): Promise<{ code: number, data: TableListItem[], message: string }> {
  return request('/api/category', {
    params
  });
}

export async function addRule(params: TableListItem) {
  return request('/api/category', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function updateRule(params: Partial<TableListItem>) {
  return request(`/api/category/${params.id}`, {
    method: 'PUT',
    data: {
      ...params
    },
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/category', {
    method: 'DELETE',
    data: {
      ...params
    },
  });
}
