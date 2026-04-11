import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Result } from '../types/auth';
import { authStorage } from '../utils/authStorage';

const BASE_URL = 'http://localhost:8080';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<Result>) => {
    if (error.response?.status === 401) {
      const refreshToken = authStorage.getRefreshToken();
      if (refreshToken && error.config && !error.config.url?.includes('/refresh')) {
        try {
          const response = await axios.post<Result<{ accessToken: string; refreshToken: string }>>(
            `${BASE_URL}/api/auth/refresh`,
            { refreshToken }
          );
          if (response.data.success && response.data.data) {
            authStorage.saveTokens({
              accessToken: response.data.data.accessToken,
              refreshToken: response.data.data.refreshToken,
              accessTokenExpireTime: Date.now() + 1800000,
              refreshTokenExpireTime: Date.now() + 604800000,
              tokenType: 'Bearer',
              expiresIn: 1800,
            });
            if (error.config.headers) {
              error.config.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
            }
            return axios(error.config);
          }
        } catch {
          authStorage.clearAll();
          window.location.href = '/login';
        }
      } else {
        authStorage.clearAll();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;