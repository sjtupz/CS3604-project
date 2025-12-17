import client from './client';

export interface Passenger {
  passengerId: string;
  name: string;
  idType: string;
  idNumber: string;
  phone: string;
  discountType: string;
  expiryDate?: string;
  birthDate?: string;
  verificationStatus: string;
  isSelf?: boolean;
}

// 获取乘车人列表
export const getPassengers = async (params?: { name?: string; page?: number; pageSize?: number }): Promise<Passenger[]> => {
  const response = await client.get('/api/passengers', { params });
  return response.data.data.items;
};

// 获取单个乘车人 (Frontend helper, usually fetched from list or separate API if needed)
// Backend doesn't have a specific get-by-id endpoint for non-self, but we can reuse getPassengers with name filter or just find in list
// However, requirements say "Click edit -> jump to info page", usually we fetch fresh data.
// Since backend getPassengers returns list, we might need to filter client side or add get-by-id in backend.
// But for now let's assume we pass data or fetch list.
// Actually, let's keep it simple and just fetch list and find client side if needed, OR add get-by-id to backend later.
// But wait, the previous mock implementation had getPassengerById.
// We can simulate it by fetching list and finding.
export const getPassengerById = async (passengerId: string): Promise<Passenger | undefined> => {
    // Ideally backend should support /api/passengers/:id GET
    // But currently backend routes only have GET / (list).
    // Let's use list and filter for now as a temporary solution.
    const response = await client.get('/api/passengers', { params: { pageSize: 1000 } });
    const items = response.data.data.items as Passenger[];
    return items.find(p => p.passengerId === passengerId);
};

// 创建乘车人
export const createPassenger = async (passengerData: Omit<Passenger, 'passengerId' | 'verificationStatus'>): Promise<Passenger> => {
  const response = await client.post('/api/passengers', passengerData);
  return { ...passengerData, passengerId: response.data.data.id, verificationStatus: '已通过' }; // Mock status return
};

// 更新乘车人
export const updatePassenger = async (
  passengerId: string,
  updateData: Partial<Passenger>
): Promise<Passenger> => {
  await client.put(`/api/passengers/${passengerId}`, updateData);
  return { passengerId, ...updateData } as Passenger;
};

// 删除单个乘车人 (Backend expects batch delete interface mostly, or we can use batch for single)
// Backend route DELETE /api/passengers takes { ids: [] }
export const deletePassenger = async (passengerId: string): Promise<void> => {
  await client.delete('/api/passengers', { data: { ids: [passengerId] } });
};

// 批量删除乘车人
export const deletePassengers = async (passengerIds: string[]): Promise<void> => {
  await client.delete('/api/passengers', { data: { ids: passengerIds } });
};

