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
