export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}