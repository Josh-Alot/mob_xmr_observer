import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

/**
 * NOTE:
 * `react-native-mmkv` is NOT available in Expo Go and will also be unavailable
 * until you rebuild a dev/production client that includes the native module.
 *
 * To avoid crashing the app at import-time, we:
 * - Use MMKV when it can be instantiated
 * - Fall back to AsyncStorage for Zustand persistence
 * - Fall back to an in-memory map for cache utilities (sync API)
 */
type SyncKV = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
  clearAll: () => void;
  getAllKeys: () => string[];
};

class MemoryKV implements SyncKV {
  private map = new Map<string, string>();

  getString(key: string) {
    return this.map.get(key);
  }

  set(key: string, value: string) {
    this.map.set(key, value);
  }

  delete(key: string) {
    this.map.delete(key);
  }

  clearAll() {
    this.map.clear();
  }

  getAllKeys() {
    return Array.from(this.map.keys());
  }
}

let mmkvInstance: MMKV | null = null;
try {
  mmkvInstance = new MMKV({
    id: 'p2pool-observer-store',
    // IMPORTANT: Hardcoding an encryption key is not secure, but keeping the
    // existing behavior for now. Consider moving to secure key management.
    encryptionKey: 'p2pool-observer-v1',
  });
} catch {
  mmkvInstance = null;
}

export const isMMKVAvailable = mmkvInstance != null;

// Backwards-compatible export: "storage" exists even when MMKV doesn't.
export const storage: SyncKV = (mmkvInstance ?? new MemoryKV()) as unknown as SyncKV;

/**
 * Zustand-compatible storage adapter
 * - MMKV when available (sync)
 * - AsyncStorage otherwise (async, but supported by Zustand persist)
 */
export const zustandStorage: StateStorage = {
  getItem: (name: string) => {
    if (isMMKVAvailable) return storage.getString(name) ?? null;
    return AsyncStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    if (isMMKVAvailable) {
      storage.set(name, value);
      return;
    }
    return AsyncStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    if (isMMKVAvailable) {
      storage.delete(name);
      return;
    }
    return AsyncStorage.removeItem(name);
  },
};

/**
 * Cache storage utilities
 */
export const cacheStorage = {
  get: <T>(key: string): T | null => {
    const value = storage.getString(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },

  delete: (key: string): void => {
    storage.delete(key);
  },

  clear: (): void => {
    storage.clearAll();
  },

  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },

  /**
   * Get storage size in bytes
   */
  getSize: (): number => {
    let size = 0;
    const keys = storage.getAllKeys();
    for (const key of keys) {
      const value = storage.getString(key);
      if (value) {
        size += key.length + value.length;
      }
    }
    return size;
  },

  /**
   * Check if storage exceeds limit (10MB)
   */
  isOverLimit: (): boolean => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    return cacheStorage.getSize() > MAX_SIZE;
  },
};
