// TODO: 实现API客户端配置
// 导入必要的库
// import axios from 'axios';

// TODO: 创建axios实例
// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
//   timeout: 10000,
// });

// TODO: 请求拦截器 - 添加认证token
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// TODO: 响应拦截器 - 统一错误处理
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // TODO: 处理未授权错误，可能跳转到登录页
//     }
//     return Promise.reject(error);
//   }
// );

// TODO: 导出API客户端实例
// export default apiClient;
