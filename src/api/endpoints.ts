/**
 * P2Pool Observer API endpoints configuration
 */

export const BASE_URLS = {
  main: 'https://p2pool.observer/api',
  mini: 'https://mini.p2pool.observer/api',
  nano: 'https://nano.p2pool.observer/api',
} as const;

export type Sidechain = keyof typeof BASE_URLS;

export const SIDECHAINS: Sidechain[] = ['main', 'mini', 'nano'];

export const SIDECHAIN_LABELS: Record<Sidechain, string> = {
  main: 'Main',
  mini: 'Mini',
  nano: 'Nano',
};

export const SIDECHAIN_DESCRIPTIONS: Record<Sidechain, string> = {
  main: 'Standard P2Pool sidechain (~100 KH/s minimum)',
  mini: 'Lower difficulty sidechain (~10 KH/s minimum)',
  nano: 'Lowest difficulty sidechain (~1 KH/s minimum)',
};

/**
 * API endpoint paths
 */
export const ENDPOINTS = {
  poolInfo: '/pool_info',
  minerInfo: (address: string) => `/miner_info/${encodeURIComponent(address)}`,
  payouts: (address: string) => `/payouts/${encodeURIComponent(address)}`,
  sharesInWindow: (address: string) =>
    `/side_blocks_in_window/${encodeURIComponent(address)}`,
  minerBlocks: (address: string) => `/found_blocks/${encodeURIComponent(address)}`,
  recentBlocks: '/found_blocks',
} as const;

/**
 * Monero block explorer URLs
 */
export const EXPLORER_URLS = {
  transaction: (txId: string) => `https://xmrchain.net/tx/${txId}`,
  block: (height: number) => `https://xmrchain.net/block/${height}`,
} as const;
