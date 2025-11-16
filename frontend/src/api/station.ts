import apiClient from './client';
import { Station } from '../types/station';

export const getStations = async (): Promise<Station[]> => {
  try {
    const response = await apiClient.get<Station[]>('/stations');
    return response.data;
  } catch (error) {
    console.error('Error fetching stations:', error);
    throw error;
  }
};