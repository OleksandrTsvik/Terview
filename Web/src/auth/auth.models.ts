import { PermissionType } from './permission-type.enum';

export interface AuthState {
  user: AuthUser | null;
}

export interface AuthUser {
  email: string;
  permissions: string[];
}

export interface AuthItem<TValue> {
  show?: boolean;
  permissions?: PermissionType[];
  value: TValue;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  permissions: string[];
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  email: string;
  permissions: string[];
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}
