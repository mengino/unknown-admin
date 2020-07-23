import request from '@/utils/request';
import { Query } from '@/services/base';
import { ProductQuery, ProductCreate, ProductItem } from './data';

export async function queryRule(params: ProductQuery & Query) {
  return request('/api/product', {
    params,
  });
}

export async function addRule(params: Partial<ProductCreate>) {
  return request('/api/product', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params: Partial<ProductItem>) {
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
