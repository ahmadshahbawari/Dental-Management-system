import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('dental_lab_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add idempotency key for specific endpoints
    if (
      config.method === 'post' &&
      (config.url?.includes('/payments') || config.url?.includes('/stock-adjustments'))
    ) {
      config.headers['Idempotency-Key'] = Date.now().toString();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('dental_lab_refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update stored tokens
        localStorage.setItem('dental_lab_token', accessToken);
        localStorage.setItem('dental_lab_refresh_token', newRefreshToken);

        // Update authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('dental_lab_user');
        localStorage.removeItem('dental_lab_token');
        localStorage.removeItem('dental_lab_refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      const { status, data } = error.response;
      interface ApiErrorData {
        message?: string;
      }
      const errorMessage = (data as ApiErrorData)?.message || 'An error occurred';

      switch (status) {
        case 400:
          toast.error('Bad Request', {
            description: errorMessage,
          });
          break;
        case 403:
          toast.error('Forbidden', {
            description: 'You do not have permission to perform this action',
          });
          break;
        case 404:
          toast.error('Not Found', {
            description: 'The requested resource was not found',
          });
          break;
        case 409:
          toast.error('Conflict', {
            description: 'Version conflict. Please refresh and try again.',
          });
          break;
        case 422:
          toast.error('Validation Error', {
            description: errorMessage,
          });
          break;
        case 500:
          toast.error('Server Error', {
            description: 'An internal server error occurred',
          });
          break;
        default:
          toast.error('Error', {
            description: errorMessage,
          });
      }
    } else if (error.request) {
      // Network error
      toast.error('Network Error', {
        description: 'Unable to connect to the server. Please check your connection.',
      });
    } else {
      // Request setup error
      toast.error('Request Error', {
        description: error.message,
      });
    }

    return Promise.reject(error);
  }
);

// API response types
export interface ApiResponse<T> {
  data: T;
  page?: number;
  total?: number;
  hasMore?: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
}

// Helper functions
export const apiGet = <T>(url: string, params?: Record<string, unknown>) =>
  api.get<ApiResponse<T>>(url, { params });

export const apiPost = <T>(url: string, data?: unknown) => api.post<ApiResponse<T>>(url, data);

export const apiPut = <T>(url: string, data?: unknown) => api.put<ApiResponse<T>>(url, data);

export const apiPatch = <T>(url: string, data?: unknown) => api.patch<ApiResponse<T>>(url, data);

export const apiDelete = <T>(url: string) => api.delete<ApiResponse<T>>(url);

// Cases API
export const getCases = async (): Promise<any[]> => {
  try {
    const response = await api.get('/cases');
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch cases:', error);
    return [];
  }
};

export const getCaseById = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/cases/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch case:', error);
    throw error;
  }
};

export const createCase = async (caseData: unknown): Promise<any> => {
  try {
    const response = await api.post('/cases', caseData);
    return response.data.data;
  } catch (error) {
    console.error('Failed to create case:', error);
    throw error;
  }
};

export const updateCaseStatus = async (id: string, status: string): Promise<any> => {
  try {
    const response = await api.patch(`/cases/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    console.error('Failed to update case status:', error);
    throw error;
  }
};