import { StateCreator } from 'zustand';
import { MinerInfo, PoolInfo, Payout } from '@api/types';

/**
 * Cache state slice
 * Manages cached API data for offline support
 */
export interface CacheSlice {
  cache: {
    lastSync: number;
    isStale: boolean;
    minerInfo: MinerInfo | null;
    poolInfo: PoolInfo | null;
    payouts: Payout[];
  };
  setMinerInfoCache: (minerInfo: MinerInfo | null) => void;
  setPoolInfoCache: (poolInfo: PoolInfo | null) => void;
  setPayoutsCache: (payouts: Payout[]) => void;
  updateLastSync: () => void;
  setStale: (isStale: boolean) => void;
  clearCache: () => void;
}

export const createCacheSlice: StateCreator<CacheSlice, [], [], CacheSlice> = (set) => ({
  cache: {
    lastSync: 0,
    isStale: true,
    minerInfo: null,
    poolInfo: null,
    payouts: [],
  },

  setMinerInfoCache: (minerInfo: MinerInfo | null) =>
    set((state) => ({
      cache: {
        ...state.cache,
        minerInfo,
        lastSync: Date.now(),
        isStale: false,
      },
    })),

  setPoolInfoCache: (poolInfo: PoolInfo | null) =>
    set((state) => ({
      cache: {
        ...state.cache,
        poolInfo,
        lastSync: Date.now(),
        isStale: false,
      },
    })),

  setPayoutsCache: (payouts: Payout[]) =>
    set((state) => ({
      cache: {
        ...state.cache,
        payouts,
        lastSync: Date.now(),
        isStale: false,
      },
    })),

  updateLastSync: () =>
    set((state) => ({
      cache: {
        ...state.cache,
        lastSync: Date.now(),
        isStale: false,
      },
    })),

  setStale: (isStale: boolean) =>
    set((state) => ({
      cache: {
        ...state.cache,
        isStale,
      },
    })),

  clearCache: () =>
    set({
      cache: {
        lastSync: 0,
        isStale: true,
        minerInfo: null,
        poolInfo: null,
        payouts: [],
      },
    }),
});
