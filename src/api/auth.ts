import axiosInstance from '../utils/api';
import { Result, LoginDTO, RegisterDTO, RegisterCaptchaDTO, TokenDTO, UserDTO } from '../types/auth';

export const authApi = {
  sendCaptcha: async (data: RegisterCaptchaDTO): Promise<Result> => {
    const response = await axiosInstance.post<Result>('/api/auth/captcha', data);
    return response.data;
  },

  login: async (data: LoginDTO): Promise<Result<TokenDTO>> => {
    const response = await axiosInstance.post<Result<TokenDTO>>('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterDTO): Promise<Result> => {
    const response = await axiosInstance.post<Result>('/api/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<Result> => {
    const response = await axiosInstance.post<Result>('/api/auth/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<Result<UserDTO>> => {
    const response = await axiosInstance.get<Result<UserDTO>>('/api/auth/me');
    return response.data;
  },

  getProfile: async (): Promise<Result<UserDTO>> => {
    const response = await axiosInstance.get<Result<UserDTO>>('/api/user/profile');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<Result<TokenDTO>> => {
    const response = await axiosInstance.post<Result<TokenDTO>>('/api/auth/refresh', { refreshToken });
    return response.data;
  },
};