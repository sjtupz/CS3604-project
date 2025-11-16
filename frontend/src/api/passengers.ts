// TODO: 实现乘车人相关API调用
// import apiClient from './client';

// 获取乘车人列表
// export const getPassengers = async (params?: { name?: string }) => {
//   const response = await apiClient.get('/api/passengers', { params });
//   return response.data;
// };

// 创建乘车人
// export const createPassenger = async (passengerData: {
//   name: string;
//   idType: string;
//   idNumber: string;
//   phone: string;
//   discountType: string;
//   expiryDate?: string;
//   birthDate?: string;
// }) => {
//   const response = await apiClient.post('/api/passengers', passengerData);
//   return response.data;
// };

// 更新乘车人
// export const updatePassenger = async (
//   passengerId: string,
//   updateData: {
//     name?: string;
//     idType?: string;
//     idNumber?: string;
//     phone?: string;
//     discountType?: string;
//     expiryDate?: string;
//     birthDate?: string;
//   }
// ) => {
//   const response = await apiClient.put(`/api/passengers/${passengerId}`, updateData);
//   return response.data;
// };

// 删除单个乘车人
// export const deletePassenger = async (passengerId: string) => {
//   const response = await apiClient.delete(`/api/passengers/${passengerId}`);
//   return response.data;
// };

// 批量删除乘车人
// export const deletePassengers = async (passengerIds: string[]) => {
//   const response = await apiClient.delete('/api/passengers', {
//     data: { passengerIds }
//   });
//   return response.data;
// };
