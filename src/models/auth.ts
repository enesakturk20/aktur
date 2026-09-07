export interface LoginResponse {
  token: string;
  email?: string;
  name?: string;
  plate?: string;
  [key: string]: any;
}

export interface AuthUser {
  email?: string;
  name?: string;
  role: string;
}
