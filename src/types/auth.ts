export interface LoginDTO {
  email: string;
  password: string;
  captchaCode: string;
}

export interface RegisterDTO {
  nickname: string;
  password: string;
  email: string;
  captchaCode: string;
}

export interface RegisterCaptchaDTO {
  email: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface TokenDTO {
  accessToken: string;
  refreshToken: string;
  accessTokenExpireTime: number;
  refreshTokenExpireTime: number;
  tokenType: string;
  expiresIn: number;
}

export interface UserDTO {
  id: number;
  nickname: string;
  email: string;
  avatar: string;
  gender: number;
  birthday: string;
  status: number;
  role: string;
  permissions: string;
}

export interface Result<T = unknown> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
  success: boolean;
}