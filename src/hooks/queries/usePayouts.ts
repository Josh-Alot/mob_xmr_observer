import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useApiClient } from '../useApiClient';
import { useCacheActions, useCachedPayouts, useSidechain, useSettings } from '@store/store';
import { Payout } from '@api/types';
import { handleApiError, AppError } from '@api/client';
import { isValidMoneroAddress } from '@services/address-validator';

/**
 * Query key factory for payouts
 */
export const payoutsQueryKey = (address: string | null, sidechain: string, limit: number) =>
  ['payouts', address, sidechain, limit] as const;

/**
 * Hook to fetch and cache payout information
 */
export function usePayouts(
  address: string | null,
  options?: Omit<UseQueryOptions<Payout[], AppError>, 'queryKey' | 'queryFn'>
) {
  const api = useApiClient();
  const sidechain = useSidechain();
  const { payoutLimit } = useSettings();
  const cachedPayouts = useCachedPayouts();
  const { setPayoutsCache } = useCacheActions();

  const isEnabled = !!address && isValidMoneroAddress(address);

  return useQuery<Payout[], AppError>({
    queryKey: payoutsQueryKey(address, sidechain, payoutLimit),
    queryFn: async () => {
      if (!address) {
        throw { type: 'validation', message: 'Address is required' };
      }
      try {
        const data = await api.getPayouts(address, payoutLimit);
        setPayoutsCache(data);
        return data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    enabled: isEnabled,
    placeholderData: cachedPayouts.length > 0 ? cachedPayouts : undefined,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (error.type === 'not_found') return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}
