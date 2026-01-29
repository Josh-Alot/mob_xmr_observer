import { useCallback } from 'react';
import { useAddress, useAddressActions, useIsAddressValid } from '@store/store';
import { isValidMoneroAddress, validateMoneroAddress } from '@services/address-validator';

/**
 * Hook for managing wallet address with validation
 */
export function useAddressWithValidation() {
  const address = useAddress();
  const isValid = useIsAddressValid();
  const { setAddress, setAddressValid, clearAddress } = useAddressActions();

  const updateAddress = useCallback(
    (newAddress: string | null) => {
      if (!newAddress) {
        clearAddress();
        return { isValid: false, error: undefined };
      }

      const validation = validateMoneroAddress(newAddress);
      setAddress(newAddress);
      setAddressValid(validation.isValid);

      return {
        isValid: validation.isValid,
        error: validation.error,
        type: validation.type,
      };
    },
    [setAddress, setAddressValid, clearAddress]
  );

  const validateCurrentAddress = useCallback(() => {
    if (!address) {
      return { isValid: false, error: 'No address set' };
    }
    return validateMoneroAddress(address);
  }, [address]);

  return {
    address,
    isValid,
    updateAddress,
    clearAddress,
    validateCurrentAddress,
  };
}
