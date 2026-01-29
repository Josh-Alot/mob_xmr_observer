import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { zustandStorage } from './storage';
import {
  AddressSlice,
  createAddressSlice,
  SettingsSlice,
  createSettingsSlice,
  CacheSlice,
  createCacheSlice,
} from './slices';

/**
 * Combined app state type
 */
export type AppState = AddressSlice & SettingsSlice & CacheSlice;

/**
 * Main application store
 * Combines all slices with persistence
 */
export const useStore = create<AppState>()(
  persist(
    (...args) => ({
      ...createAddressSlice(...args),
      ...createSettingsSlice(...args),
      ...createCacheSlice(...args),
    }),
    {
      name: 'p2pool-observer-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        // Persist only these fields
        address: state.address,
        settings: state.settings,
        cache: {
          lastSync: state.cache.lastSync,
          minerInfo: state.cache.minerInfo,
          poolInfo: state.cache.poolInfo,
          payouts: state.cache.payouts.slice(0, 100), // Limit cached payouts
          isStale: true, // Always mark as stale on reload
        },
      }),
      version: 1,
      migrate: (persistedState, version) => {
        // Handle state migrations for future versions
        if (version === 0) {
          // Migration from version 0 to 1
          return persistedState as AppState;
        }
        return persistedState as AppState;
      },
    }
  )
);

/**
 * Selector hooks for better performance
 */

// Address selectors
export const useAddress = () => useStore((state) => state.address.current);
export const useIsAddressValid = () => useStore((state) => state.address.isValid);
export const useAddressActions = () =>
  useStore(
    useShallow((state) => ({
      setAddress: state.setAddress,
      setAddressValid: state.setAddressValid,
      clearAddress: state.clearAddress,
    }))
  );

// Settings selectors
export const useSettings = () => useStore((state) => state.settings);
export const useSidechain = () => useStore((state) => state.settings.sidechain);
export const useThemeMode = () => useStore((state) => state.settings.theme);
export const useLanguage = () => useStore((state) => state.settings.language);
export const useSettingsActions = () =>
  useStore(
    useShallow((state) => ({
      setSidechain: state.setSidechain,
      setTheme: state.setTheme,
      setLanguage: state.setLanguage,
      setRefreshInterval: state.setRefreshInterval,
      setNotificationsEnabled: state.setNotificationsEnabled,
      setHapticFeedbackEnabled: state.setHapticFeedbackEnabled,
      setPayoutLimit: state.setPayoutLimit,
      resetSettings: state.resetSettings,
    }))
  );

// Cache selectors
export const useCache = () => useStore((state) => state.cache);
export const useCachedMinerInfo = () => useStore((state) => state.cache.minerInfo);
export const useCachedPoolInfo = () => useStore((state) => state.cache.poolInfo);
export const useCachedPayouts = () => useStore((state) => state.cache.payouts);
export const useLastSync = () => useStore((state) => state.cache.lastSync);
export const useCacheActions = () =>
  useStore(
    useShallow((state) => ({
      setMinerInfoCache: state.setMinerInfoCache,
      setPoolInfoCache: state.setPoolInfoCache,
      setPayoutsCache: state.setPayoutsCache,
      updateLastSync: state.updateLastSync,
      setStale: state.setStale,
      clearCache: state.clearCache,
    }))
  );
