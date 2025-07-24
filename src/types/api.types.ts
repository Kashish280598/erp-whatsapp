export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  data?: any;
  config?: any;
  code?: string;
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  retryAttempts?: number;
  retryDelay?: number;
  skipRetry?: boolean;
  skipAuth?: boolean;
  timeout?: number;
}

export interface RetryConfig {
  attempt: number;
  maxAttempts: number;
  delay: number;
  error: ApiError;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LoginResponseData {
    token: string;
}

export interface LoginResponse {
    status: number;
    message: string;
    data: LoginResponseData;
} 