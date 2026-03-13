import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/config/constants';

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      console.log('[API Request]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
      return config;
    },
    (error) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      console.log('[API Response]', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
      return response;
    },
    (error: AxiosError) => {
      const errorMessage = error.message || 'Unknown error';
      const isTimeout = errorMessage.includes('timeout') || error.code === 'ECONNABORTED';
      const isNetworkError = !error.response && errorMessage.includes('Network');
      
      console.error('[API Error]', {
        status: error.response?.status,
        url: error.config?.url,
        error: error.response?.data,
        message: errorMessage,
        code: error.code,
        isTimeout,
        isNetworkError,
      });

      // Custom error handling
      if (error.response?.status === 404) {
        console.warn('[API] Endpoint not found:', error.config?.url);
      }

      if (error.response?.status === 500) {
        console.error('[API] Server error:', error.response?.data);
      }

      if (isTimeout) {
        console.error('[API] Request timeout - the server took too long to respond');
      }

      if (isNetworkError) {
        console.error('[API] Network error - unable to connect to server. Make sure backend is running on', API_BASE_URL);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiClient = createApiClient();
