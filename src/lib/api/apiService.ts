import { store } from '@/lib/store';
import { addError } from '@/lib/features/app/appSlice';
import { logout } from '@/lib/features/auth/authSlice';
import { API_CONFIG } from './config';
import type {
  ApiResponse,
  ApiError,
  RequestConfig,
  RetryConfig,
  HttpMethod,
} from '@/types/api.types';
// import type { RootState } from '@/lib/store';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private baseURL: string;
  private xsrfToken: string | null = null;

  constructor(baseURL: string = API_CONFIG.baseURL) {
    this.baseURL = baseURL;
  }

  private async handleRetry(config: RetryConfig): Promise<boolean> {
    const { attempt, maxAttempts, delay: retryDelay, error } = config;

    if (attempt >= maxAttempts) {
      return false;
    }

    const shouldRetry = API_CONFIG.statusCodesToRetry.includes(error.status as 408 | 500 | 502 | 503 | 504);
    if (!shouldRetry) {
      return false;
    }

    await delay(retryDelay * attempt);
    return true;
  }

  private getDefaultHeaders(): HeadersInit {
    const headers: HeadersInit = {
      ...API_CONFIG.headers
    };

    // Add XSRF token if available
    if (this.xsrfToken) {
      headers['X-XSRF-TOKEN'] = this.xsrfToken;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Update XSRF token if present in response
    const xsrfToken = response.headers.get('X-XSRF-TOKEN');
    if (xsrfToken) {
      this.xsrfToken = xsrfToken;
    }

    if (!response.ok) {
      const error: ApiError = new Error(response.statusText);
      error.status = response.status;
      error.statusText = response.statusText;

      try {
        error.data = await response.json();
      } catch {
        error.data = null;
      }

      // Handle authentication errors
      if (response.status === 401) {
        store.dispatch(logout());
      }
      throw error;
    }

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers,
    };
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint.startsWith('http') ? endpoint : endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  public async request<T = any>(
    method: HttpMethod,
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      params,
      retryAttempts = API_CONFIG.retryAttempts,
      retryDelay = API_CONFIG.retryDelay,
      skipRetry = false,
      skipAuth = false,
      timeout = API_CONFIG.timeout,
      ...fetchConfig
    } = config;

    const url = this.buildUrl(endpoint, params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const headers = new Headers({
      ...this.getDefaultHeaders(),
      ...(!skipAuth && this.getDefaultHeaders()),
      ...fetchConfig.headers,
    });

    const requestConfig: RequestInit = {
      method,
      headers,
      credentials: 'include',
      mode: API_CONFIG.mode,
      cache: API_CONFIG.cache,
      redirect: API_CONFIG.redirect,
      referrerPolicy: API_CONFIG.referrerPolicy,
      signal: controller.signal,
      ...fetchConfig,
    };

    // Don't send empty body for GET/HEAD requests
    if (!['GET', 'HEAD'].includes(method) && fetchConfig.body) {
      requestConfig.body = typeof fetchConfig.body === 'string' 
        ? fetchConfig.body 
        : JSON.stringify(fetchConfig.body);
    }

    let attempt = 0;
    let lastError: ApiError | null = null;

    while (attempt < (skipRetry ? 1 : retryAttempts)) {
      try {
        const response = await fetch(url, requestConfig);
        clearTimeout(timeoutId);
        return await this.handleResponse<T>(response);
      } catch (error: any) {
        lastError = error;

        if (error.name === 'AbortError') {
          lastError = new Error('Request timeout');
          lastError.status = 408;
          break;
        }

        const shouldRetry = await this.handleRetry({
          attempt,
          maxAttempts: retryAttempts,
          delay: retryDelay,
          error: lastError as ApiError,
        });

        if (!shouldRetry) break;
        attempt++;
      }
    }

    store.dispatch(addError({
      message: lastError?.message || 'Request failed',
      severity: 'error',
      code: String(lastError?.status || 'UNKNOWN'),
      source: endpoint,
      timestamp: Date.now(),
    }));

    throw lastError;
  }

  // Convenience methods
  public async get<T = any>(endpoint: string, config?: RequestConfig) {
    return this.request<T>('GET', endpoint, config);
  }

  public async post<T = any>(endpoint: string, data?: any, config?: RequestConfig) {
    return this.request<T>('POST', endpoint, {
      ...config,
      body: data,
    });
  }

  public async put<T = any>(endpoint: string, data?: any, config?: RequestConfig) {
    return this.request<T>('PUT', endpoint, {
      ...config,
      body: data,
    });
  }

  public async patch<T = any>(endpoint: string, data?: any, config?: RequestConfig) {
    return this.request<T>('PATCH', endpoint, {
      ...config,
      body: data,
    });
  }

  public async delete<T = any>(endpoint: string, config?: RequestConfig) {
    return this.request<T>('DELETE', endpoint, config);
  }
}

export const apiService = new ApiService();
export default apiService; 