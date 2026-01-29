import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useApiClient } from '../useApiClient';
import { useCacheActions, useCachedPoolInfo } from '@store/store';
import { PoolInfo } from '@api/types';
import { handleApiError, AppError } from '@api/client';

/**
 * Query key for pool info
 */
export const poolInfoQueryKey = ['poolInfo'] as const;

/**
 * Hook to fetch and cache pool information
 */
export function usePoolInfo(
  options?: Omit<UseQueryOptions<PoolInfo, AppError>, 'queryKey' | 'queryFn'>
) {
  const api = useApiClient();
  const cachedPoolInfo = useCachedPoolInfo();
  const { setPoolInfoCache } = useCacheActions();

  return useQuery<PoolInfo, AppError>({
    queryKey: poolInfoQueryKey,
    queryFn: async () => {
      try {
        const data = await api.getPoolInfo();
        setPoolInfoCache(data);
        return data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    placeholderData: cachedPoolInfo ?? undefined,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}
