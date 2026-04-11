import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { Result, TokenDTO } from '../types/auth';
import { authStorage } from './authStorage';

const BASE_URL = 'http://localhost:8080';
const TOKEN_EXPIRE_BUFFER = 5 * 60 * 1000;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

export const axiosInstanceLongTimeout = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

export const isTokenExpiringSoon = (): boolean => {
  const tokens = authStorage.getTokens();
  if (!tokens) return false;
  const expireTime = tokens.accessTokenExpireTime;
  if (!expireTime) return false;
  return Date.now() + TOKEN_EXPIRE_BUFFER >= expireTime;
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post<Result<TokenDTO>>(
      `${BASE_URL}/api/auth/refresh`,
      { refreshToken: refreshToken }
    );

    if (response.data.success && response.data.data) {
      const newTokens = response.data.data;
      authStorage.saveTokens({
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        accessTokenExpireTime: Date.now() + (newTokens.expiresIn * 1000),
        refreshTokenExpireTime: Date.now() + 604800000,
        tokenType: newTokens.tokenType || 'Bearer',
        expiresIn: newTokens.expiresIn,
      });
      return newTokens.accessToken;
    }
    return null;
  } catch {
    return null;
  }
};

export const ensureValidToken = async (): Promise<string | null> => {
  const tokens = authStorage.getTokens();
  if (!tokens || !tokens.accessToken) {
    return null;
  }

  if (!isTokenExpiringSoon()) {
    return tokens.accessToken;
  }

  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => resolve(token));
    });
  }

  isRefreshing = true;

  try {
    const newToken = await refreshAccessToken();
    if (newToken) {
      onRefreshed(newToken);
      return newToken;
    }
    return null;
  } catch {
    return null;
  } finally {
    isRefreshing = false;
  }
};

const setupInterceptors = (instance: typeof axiosInstance) => {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const url = config.url || '';
      const isAuthEndpoint = url.includes('/api/auth/');

      if (isAuthEndpoint) {
        return config;
      }

      if (config.headers) {
        const token = await ensureValidToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError<Result>) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && originalRequest) {
        const url = originalRequest.url || '';
        const isAuthEndpoint = url.includes('/api/auth/');

        if (isAuthEndpoint) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve) => {
            subscribeTokenRefresh((token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(instance(originalRequest));
            });
          });
        }

        const refreshToken = authStorage.getRefreshToken();
        if (!refreshToken) {
          authStorage.clearAll();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        if (url.includes('/auth/refresh')) {
          authStorage.clearAll();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        isRefreshing = true;

        try {
          const response = await axios.post<Result<TokenDTO>>(
            `${BASE_URL}/api/auth/refresh`,
            { refreshToken: refreshToken }
          );

          if (response.data.success && response.data.data) {
            const newTokens = response.data.data;
            authStorage.saveTokens({
              accessToken: newTokens.accessToken,
              refreshToken: newTokens.refreshToken,
              accessTokenExpireTime: Date.now() + (newTokens.expiresIn * 1000),
              refreshTokenExpireTime: Date.now() + 604800000,
              tokenType: newTokens.tokenType || 'Bearer',
              expiresIn: newTokens.expiresIn,
            });

            onRefreshed(newTokens.accessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            }
            return instance(originalRequest);
          } else {
            throw new Error('Refresh failed');
          }
        } catch (refreshError) {
          authStorage.clearAll();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );
};

setupInterceptors(axiosInstance);
setupInterceptors(axiosInstanceLongTimeout);

export default axiosInstance;