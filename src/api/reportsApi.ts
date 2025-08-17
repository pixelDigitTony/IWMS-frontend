import { http } from './baseApi';

export type StockSummary = {
  totalSkus: number;
  totalQuantity: number;
  warehouses: number;
};

export type AgingBucket = { label: string; count: number };

export async function getStockSummary() {
  const { data } = await http.get<StockSummary>('/reports/stock/summary');
  return data;
}

export async function getAgingSummary() {
  const { data } = await http.get<AgingBucket[]>('/reports/stock/aging/summary');
  return data;
}


