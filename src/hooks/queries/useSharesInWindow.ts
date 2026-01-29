import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useApiClient } from '../useApiClient';
import { useSidechain } from '@store/store';
import { ShareInWindow } from '@api/types';
import { handleApiError, AppError } from '@api/client';
import { isValidMoneroAddress } from '@services/address-validator';

/**
 * Query key factory for shares in window
 */
export const sharesInWindowQueryKey = (address: string | null, sidechain: string) =>
  ['sharesInWindow', address, sidechain] as const;

/**
 * Hook to fetch shares in PPLNS window
 */
export function useSharesInWindow(
  address: string | null,
  options?: Omit<UseQueryOptions<ShareInWindow[], AppError>, 'queryKey' | 'queryFn'>
) {
  const api = useApiClient();
  const sidechain = useSidechain();

  const isEnabled = !!address && isValidMoneroAddress(address);

  return useQuery<ShareInWindow[], AppError>({
    queryKey: sharesInWindowQueryKey(address, sidechain),
    queryFn: async () => {
      if (!address) {
        throw { type: 'validation', message: 'Address is required' };
      }
      try {
        return await api.getSharesInWindow(address);
      } catch (error) {
        throw handleApiError(error);
      }
    },
    enabled: isEnabled,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error.type === 'not_found') return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}
