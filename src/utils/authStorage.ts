import { TokenDTO, UserDTO } from '../types/auth';

const TOKEN_KEY = 'cb_anime_tokens';
const USER_KEY = 'cb_anime_user';

export class AuthStorage {
  saveTokens(tokens: TokenDTO): void {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  }

  getTokens(): TokenDTO | null {
    const tokensStr = localStorage.getItem(TOKEN_KEY);
    if (!tokensStr) return null;
    try {
      return JSON.parse(tokensStr);
    } catch {
      return null;
    }
  }

  getAccessToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.accessToken || null;
  }

  getRefreshToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.refreshToken || null;
  }

  removeTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  saveUser(user: UserDTO): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): UserDTO | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  clearAll(): void {
    this.removeTokens();
    this.removeUser();
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authStorage = new AuthStorage();