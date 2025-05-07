import api from './api';
import { AuthResponse, SigninData, SignupData } from '../types/auth';
import * as SecureStore from 'expo-secure-store';

export const authService = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },
  
  signin: async (data: SigninData): Promise<AuthResponse> => {    
    const response = await api.post('/api/auth/login', data);
    
    if (response.data.token) {
      SecureStore.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
    await SecureStore.deleteItemAsync('token');
  },
  
  getUser: async (): Promise<AuthResponse['user']> => {
    const response = await api.get('/api/user');
    return response.data;
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return SecureStore.getItem('token') !== null;
  }
};

export default authService;