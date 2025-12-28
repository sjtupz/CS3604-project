// API客户端配置
import axios, { AxiosRequestConfig } from 'axios';

// 创建axios实例
const apiClient = axios.create({
  // 在开发环境走相对路径，交由 Vite 代理；在预览/生产环境使用显式后端地址
  baseURL: import.meta.env.DEV ? undefined : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'),
  timeout: 10000,
});

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权错误
      localStorage.removeItem('authToken');
    }
    const cfg: (AxiosRequestConfig & { __retryWithBase?: boolean }) = error.config || {};
    const shouldRetry = !cfg.__retryWithBase && typeof cfg?.url === 'string' && cfg.url.startsWith('/api');
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || /Network Error/i.test(error.message || '');
    if (shouldRetry && isNetworkError) {
      const fallbackBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const newCfg: AxiosRequestConfig & { __retryWithBase?: boolean } = { ...cfg, baseURL: fallbackBase, __retryWithBase: true };
      return axios.request(newCfg);
    }
    return Promise.reject(error);
  }
);

// 导出API客户端实例
export default apiClient;
