import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { BASE_URLS, Sidechain } from './endpoints';

/**
 * Rate limiter for API requests
 */
class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter((timestamp) => now - timestamp < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      if (oldestRequest) {
        const waitTime = this.windowMs - (now - oldestRequest);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return this.acquire();
      }
    }

    this.requests.push(now);
  }
}

// Global rate limiter: 10 requests per minute
const rateLimiter = new RateLimiter(10, 60 * 1000);

/**
 * API Client configuration
 */
const DEFAULT_TIMEOUT = 30000;
const MAX_BODY_SIZE = 5 * 1024 * 1024; // 5MB

interface ApiClientConfig {
  sidechain: Sidechain;
  timeout?: number;
  enableRateLimiting?: boolean;
}

/**
 * Sanitize address for logging (security)
 */
function sanitizeUrl(url: string): string {
  // Replace wallet addresses with truncated version in logs
  return url.replace(/\/([48][1-9A-HJ-NP-Za-km-z]{94})/g, (_, address: string) => {
    return `/${address.slice(0, 8)}...${address.slice(-8)}`;
  });
}

/**
 * Create API client instance for a specific sidechain
 */
export function createApiClient(config: ApiClientConfig): AxiosInstance {
  const { sidechain, timeout = DEFAULT_TIMEOUT, enableRateLimiting = true } = config;

  const client = axios.create({
    baseURL: BASE_URLS[sidechain],
    timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'P2PoolObserver-Mobile/1.0.0',
    },
    maxContentLength: MAX_BODY_SIZE,
    maxBodyLength: MAX_BODY_SIZE,
  });

  // Request interceptor
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Rate limiting
      if (enableRateLimiting) {
        await rateLimiter.acquire();
      }

      // Log request (development only)
      if (__DEV__) {
        console.log(`[API] ${config.method?.toUpperCase()} ${sanitizeUrl(config.url ?? '')}`);
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response status (development only)
      if (__DEV__) {
        console.log(`[API] Response ${response.status} from ${sanitizeUrl(response.config.url ?? '')}`);
      }

      return response;
    },
    (error: AxiosError) => {
      // Log error (sanitized)
      if (__DEV__) {
        console.error(
          `[API] Error ${error.response?.status ?? 'NETWORK'}: ${error.message}`,
          sanitizeUrl(error.config?.url ?? '')
        );
      }

      return Promise.reject(error);
    }
  );

  return client;
}

/**
 * API error types
 */
export type ApiErrorType =
  | 'network'
  | 'timeout'
  | 'validation'
  | 'not_found'
  | 'rate_limit'
  | 'server'
  | 'unknown';

export interface AppError {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  retry?: boolean;
}

/**
 * Handle API errors and return standardized error object
 */
export function handleApiError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    // Network error (no response)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return {
          type: 'timeout',
          message: 'Request timed out. Please try again.',
          retry: true,
        };
      }
      return {
        type: 'network',
        message: 'No internet connection. Please check your network.',
        retry: true,
      };
    }

    // HTTP error responses
    const { status } = error.response;
    switch (status) {
      case 400:
        return {
          type: 'validation',
          message: 'Invalid request. Please check your input.',
          statusCode: status,
          retry: false,
        };
      case 404:
        return {
          type: 'not_found',
          message: 'Miner not found. This address may not have any shares yet.',
          statusCode: status,
          retry: false,
        };
      case 429:
        return {
          type: 'rate_limit',
          message: 'Too many requests. Please wait a moment.',
          statusCode: status,
          retry: true,
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: 'server',
          message: 'Server error. Please try again later.',
          statusCode: status,
          retry: true,
        };
      default:
        return {
          type: 'unknown',
          message: 'An unexpected error occurred.',
          statusCode: status,
          retry: true,
        };
    }
  }

  // Non-Axios error
  return {
    type: 'unknown',
    message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    retry: false,
  };
}
