import { useMemo } from 'react';
import { useSidechain } from '@store/store';
import { createApiClient } from '@api/client';
import { createP2PoolApi, P2PoolApi } from '@api/p2pool-api';

/**
 * Hook to get an API client configured for the current sidechain
 */
export function useApiClient(): P2PoolApi {
  const sidechain = useSidechain();

  const api = useMemo(() => {
    const client = createApiClient({ sidechain });
    return createP2PoolApi(client);
  }, [sidechain]);

  return api;
}
