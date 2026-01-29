import { StateCreator } from 'zustand';

/**
 * Address state slice
 * Manages the user's Monero wallet address
 */
export interface AddressSlice {
  address: {
    current: string | null;
    isValid: boolean;
    lastValidated: number;
  };
  setAddress: (address: string | null) => void;
  setAddressValid: (isValid: boolean) => void;
  clearAddress: () => void;
}

export const createAddressSlice: StateCreator<AddressSlice, [], [], AddressSlice> = (set) => ({
  address: {
    current: null,
    isValid: false,
    lastValidated: 0,
  },

  setAddress: (current: string | null) =>
    set((state) => ({
      address: {
        ...state.address,
        current,
        lastValidated: Date.now(),
      },
    })),

  setAddressValid: (isValid: boolean) =>
    set((state) => ({
      address: {
        ...state.address,
        isValid,
      },
    })),

  clearAddress: () =>
    set({
      address: {
        current: null,
        isValid: false,
        lastValidated: 0,
      },
    }),
});
