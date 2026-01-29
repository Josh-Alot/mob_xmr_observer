import { AxiosInstance } from 'axios';
import { ENDPOINTS } from './endpoints';
import {
  PoolInfo,
  PoolInfoSchema,
  MinerInfo,
  MinerInfoSchema,
  Payout,
  PayoutsResponseSchema,
  ShareInWindow,
  SharesInWindowSchema,
  MinerBlock,
  MinerBlocksSchema,
} from './types';

/**
 * P2Pool Observer API interface
 */
export interface P2PoolApi {
  getPoolInfo: () => Promise<PoolInfo>;
  getMinerInfo: (address: string) => Promise<MinerInfo>;
  getPayouts: (address: string, limit?: number) => Promise<Payout[]>;
  getSharesInWindow: (address: string) => Promise<ShareInWindow[]>;
  getMinerBlocks: (address: string) => Promise<MinerBlock[]>;
}

/**
 * Create typed P2Pool API methods
 */
export function createP2PoolApi(client: AxiosInstance): P2PoolApi {
  return {
    /**
     * Get current pool information
     */
    getPoolInfo: async (): Promise<PoolInfo> => {
      const response = await client.get<unknown>(ENDPOINTS.poolInfo);
      return PoolInfoSchema.parse(response.data);
    },

    /**
     * Get miner information by address
     */
    getMinerInfo: async (address: string): Promise<MinerInfo> => {
      const response = await client.get<unknown>(ENDPOINTS.minerInfo(address));
      return MinerInfoSchema.parse(response.data);
    },

    /**
     * Get miner payouts
     * @param address - Monero wallet address
     * @param limit - Maximum number of payouts to return (default: 20)
     */
    getPayouts: async (address: string, limit = 20): Promise<Payout[]> => {
      const response = await client.get<unknown>(ENDPOINTS.payouts(address), {
        params: { search_limit: limit },
      });
      return PayoutsResponseSchema.parse(response.data);
    },

    /**
     * Get shares in current PPLNS window
     */
    getSharesInWindow: async (address: string): Promise<ShareInWindow[]> => {
      const response = await client.get<unknown>(ENDPOINTS.sharesInWindow(address));
      return SharesInWindowSchema.parse(response.data);
    },

    /**
     * Get blocks found by miner
     */
    getMinerBlocks: async (address: string): Promise<MinerBlock[]> => {
      const response = await client.get<unknown>(ENDPOINTS.minerBlocks(address));
      return MinerBlocksSchema.parse(response.data);
    },
  };
}
