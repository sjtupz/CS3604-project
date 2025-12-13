import axios, { AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  // 预览/生产环境默认回落到本地后端，避免 vite preview 无代理导致的请求失败
  baseURL: import.meta.env.DEV ? undefined : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'),
  timeout: 10000,
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || /Network Error/i.test(error.message || '');
    if (!import.meta.env.DEV && !isNetworkError) {
      console.error('API Error:', error.response?.data || error.message);
    }
    const cfg: (AxiosRequestConfig & { __retryCount?: number }) = error.config || {};
    const shouldRetry = (cfg.__retryCount || 0) < 3 && typeof cfg?.url === 'string' && cfg.url.startsWith('/api');
    if (shouldRetry && isNetworkError) {
      cfg.__retryCount = (cfg.__retryCount || 0) + 1;
      const fallbackBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const newCfg: AxiosRequestConfig & { __retryCount?: number } = { ...cfg, baseURL: fallbackBase };
      console.warn(`Retrying request (${cfg.__retryCount}/3)...`);
      return new Promise(resolve => setTimeout(() => resolve(axios.request(newCfg)), 1000 * cfg.__retryCount));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
