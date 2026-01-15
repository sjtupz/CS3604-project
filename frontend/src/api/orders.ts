import apiClient from './client';

export interface CreateOrderParams {
  trainId: string;
  date: string;
  fromStationId: string;
  toStationId: string;
  seatType: string;
  passengers: Array<{
    id: string;
    name: string;
    idType: string;
    idNumber: string;
    ticketType: string;
    seatType?: string;
    price?: number;
  }>;
  trainInfo: unknown;
}

export const createOrder = async (data: CreateOrderParams) => {
  const response = await apiClient.post('/api/orders', data);
  return response.data;
};

export const getOrderDetails = async (orderId: string) => {
  const response = await apiClient.get(`/api/orders/${orderId}`);
  return response.data;
};

export const confirmOrder = async (orderId: string) => {
  const response = await apiClient.post(`/api/orders/${orderId}/confirm`);
  return response.data;
};

export const cancelOrder = async (orderId: string) => {
  const response = await apiClient.post(`/api/orders/${orderId}/cancel`);
  return response.data;
};

export const getOrderStatus = async (orderId: string) => {
  const response = await apiClient.get(`/api/orders/${orderId}/status`);
  return response.data;
};

export const payOrder = async (orderId: string) => {
  const response = await apiClient.post(`/api/orders/${orderId}/pay`);
  return response.data;
};

export const getOrders = async (params: { status?: string; page?: number; pageSize?: number }) => {
  const response = await apiClient.get('/api/orders', { params });
  return response.data;
};

export interface RefundPreviewData {
  orderId: string;
  orderNo: string;
  originalPrice: number;
  refundFee: number;
  refundFeeRate: number;
  refundAmount: number;
}

export const getRefundPreview = async (orderId: string): Promise<{ data: RefundPreviewData }> => {
  const response = await apiClient.get(`/api/orders/${orderId}/refund-preview`);
  return response.data;
};

export const refundOrder = async (orderId: string) => {
  const response = await apiClient.post(`/api/orders/${orderId}/refund`);
  return response.data;
};
