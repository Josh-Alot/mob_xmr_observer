import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useApiClient } from '../useApiClient';
import { useCacheActions, useCachedMinerInfo, useSidechain } from '@store/store';
import { MinerInfo } from '@api/types';
import { handleApiError, AppError } from '@api/client';
import { isValidMoneroAddress } from '@services/address-validator';

/**
 * Query key factory for miner info
 */
export const minerInfoQueryKey = (address: string | null, sidechain: string) =>
  ['minerInfo', address, sidechain] as const;

/**
 * Hook to fetch and cache miner information
 */
export function useMinerInfo(
  address: string | null,
  options?: Omit<UseQueryOptions<MinerInfo, AppError>, 'queryKey' | 'queryFn'>
) {
  const api = useApiClient();
  const sidechain = useSidechain();
  const cachedMinerInfo = useCachedMinerInfo();
  const { setMinerInfoCache } = useCacheActions();

  const isEnabled = !!address && isValidMoneroAddress(address);

  return useQuery<MinerInfo, AppError>({
    queryKey: minerInfoQueryKey(address, sidechain),
    queryFn: async () => {
      if (!address) {
        throw { type: 'validation', message: 'Address is required' };
      }
      try {
        const data = await api.getMinerInfo(address);
        setMinerInfoCache(data);
        return data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    enabled: isEnabled,
    placeholderData: cachedMinerInfo ?? undefined,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 (miner not found)
      if (error.type === 'not_found') return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}
