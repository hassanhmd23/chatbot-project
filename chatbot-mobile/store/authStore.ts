import { create } from 'zustand';
import { AuthState, SigninData, SignupData } from '../types/auth';
import authService from '../services/authService';
import * as SecureStore from 'expo-secure-store';

// Helper for handling token storage consistently across platforms
const tokenStorage = {
  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('token');
    } catch (error) {
      console.error('Error retrieving token from SecureStore:', error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('token', token);
    } catch (error) {
      console.error('Error saving token to SecureStore:', error);
    }
  },

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('token');
    } catch (error) {
      console.error('Error removing token from SecureStore:', error);
    }
  },
};

export const useAuthStore = create<
  AuthState & {
    signup: (data: SignupData) => Promise<void>;
    signin: (data: SigninData) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    isAuthenticated: boolean;
  }
>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  signup: async (data: SignupData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signup(data);
      await tokenStorage.setToken(response.token);
      set({
        user: response.user,
        token: response.token,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Registration failed',
        isAuthenticated: false,
      });
      throw error;
    }
  },

  signin: async (data: SigninData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signin(data);
      await tokenStorage.setToken(response.token);

      set({
        user: response.user,
        token: response.token,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Login failed',
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      await tokenStorage.removeToken();
      set({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      // Even if logout API fails, clear the local state
      await tokenStorage.removeToken();
      set({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await tokenStorage.getToken();

      if (!token) {
        set({
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
        return;
      }

      set({ token });
      const user = await authService.getUser();
      set({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      await tokenStorage.removeToken();
      set({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  },
}));

export default useAuthStore;
