import axios from 'axios';
import {getUser, clearAuth} from '../utils/authUtils';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const user = getUser();
    
    if (!user || !user.token) {
      // Token expired or not found, reject request
      clearAuth();
      window.location.href = '/login';
      return Promise.reject(new Error('No valid authentication token'));
    }
    
    // Add token to headers
    config.headers.Authorization = `Bearer ${user.token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // Handle 401 Unauthorized - token invalid or expired
      if (status === 401) {
        toast.error('Session expired. Please login again.');
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(new Error('Authentication failed'));
      }
      
      // Handle 403 Forbidden - insufficient permissions
      if (status === 403) {
        toast.error('Access denied. Insufficient permissions.');
        return Promise.reject(error);
      }
      
      // Handle 500 Server Error
      if (status >= 500) {
        toast.error('Server error. Please try again later.');
        return Promise.reject(error);
      }
    }
    
    // Network error
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;