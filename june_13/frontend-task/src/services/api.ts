import axios from 'axios';
import { User } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const api = {
  register: async (userData: RegisterRequest) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  login: async (username: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { username, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  },

  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await axiosInstance.delete(`/users/${userId}`);
  },

  logout: () => {
    localStorage.removeItem('token');
  }
}; 