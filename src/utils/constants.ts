/**
 * Application constants
 */

// App metadata
export const APP_NAME = 'P2Pool Observer';
export const APP_VERSION = '0.0.1';

// Monero constants
export const XMR_DECIMALS = 12;
export const ATOMIC_UNITS_PER_XMR = BigInt(10 ** XMR_DECIMALS);

// Address validation
export const MONERO_ADDRESS_LENGTH = 95;
export const MONERO_INTEGRATED_ADDRESS_LENGTH = 106;

// API configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const MAX_RETRIES = 3;
export const RETRY_DELAY_BASE = 1000; // 1 second

// Cache configuration
export const CACHE_STALE_TIME = 30 * 1000; // 30 seconds
export const CACHE_GC_TIME = 5 * 60 * 1000; // 5 minutes
export const MAX_CACHED_PAYOUTS = 1000;
export const MAX_CACHE_SIZE = 10 * 1024 * 1024; // 10MB

// Refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  1: 60 * 1000, // 1 minute
  5: 5 * 60 * 1000, // 5 minutes
  10: 10 * 60 * 1000, // 10 minutes
  15: 15 * 60 * 1000, // 15 minutes
  30: 30 * 60 * 1000, // 30 minutes
} as const;

// UI constants
export const MIN_TOUCH_SIZE = 44;
export const ANIMATION_DURATION = 300;
export const SHIMMER_DURATION = 1500;

// Payout limits
export const PAYOUT_LIMIT_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_PAYOUT_LIMIT = 20;

// Error messages
export const ERROR_MESSAGES = {
  network: 'No internet connection. Please check your network.',
  timeout: 'Request timed out. Please try again.',
  notFound: 'Miner not found. This address may not have any shares yet.',
  rateLimit: 'Too many requests. Please wait a moment.',
  server: 'Server error. Please try again later.',
  validation: 'Invalid input. Please check your data.',
  unknown: 'An unexpected error occurred.',
} as const;

// External URLs
export const EXTERNAL_URLS = {
  p2poolDocs: 'https://p2pool.io/',
  moneroDocs: 'https://www.getmonero.org/',
  blockExplorer: 'https://xmrchain.net/',
  github: 'https://github.com/SChernykh/p2pool',
} as const;
