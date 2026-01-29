import {
  isValidMoneroAddress,
  validateMoneroAddress,
  getAddressType,
  truncateAddress,
  sanitizeAddressInput,
} from '@services/address-validator';

describe('Address Validator', () => {
  // Valid test addresses (format only, not real addresses)
  const validPrimaryAddress =
    '4' + 'A'.repeat(94);
  const validSubaddress =
    '8' + 'B'.repeat(94);

  describe('isValidMoneroAddress', () => {
    it('should return true for valid primary address format', () => {
      expect(isValidMoneroAddress(validPrimaryAddress)).toBe(true);
    });

    it('should return true for valid subaddress format', () => {
      expect(isValidMoneroAddress(validSubaddress)).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isValidMoneroAddress('')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isValidMoneroAddress(null as any)).toBe(false);
      expect(isValidMoneroAddress(undefined as any)).toBe(false);
    });

    it('should return false for wrong length', () => {
      expect(isValidMoneroAddress('4' + 'A'.repeat(93))).toBe(false);
      expect(isValidMoneroAddress('4' + 'A'.repeat(95))).toBe(false);
    });

    it('should return false for wrong prefix', () => {
      expect(isValidMoneroAddress('5' + 'A'.repeat(94))).toBe(false);
      expect(isValidMoneroAddress('9' + 'A'.repeat(94))).toBe(false);
    });

    it('should return false for invalid characters', () => {
      expect(isValidMoneroAddress('4' + '0' + 'A'.repeat(93))).toBe(false); // 0 not in base58
      expect(isValidMoneroAddress('4' + 'O' + 'A'.repeat(93))).toBe(false); // O not in base58
      expect(isValidMoneroAddress('4' + 'I' + 'A'.repeat(93))).toBe(false); // I not in base58
      expect(isValidMoneroAddress('4' + 'l' + 'A'.repeat(93))).toBe(false); // l not in base58
    });
  });

  describe('validateMoneroAddress', () => {
    it('should return validation result with type', () => {
      const result = validateMoneroAddress(validPrimaryAddress);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('primary');
      expect(result.error).toBeUndefined();
    });

    it('should identify subaddress type', () => {
      const result = validateMoneroAddress(validSubaddress);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('subaddress');
    });

    it('should return error message for invalid address', () => {
      const result = validateMoneroAddress('invalid');
      expect(result.isValid).toBe(false);
      expect(result.type).toBe('invalid');
      expect(result.error).toBeDefined();
    });
  });

  describe('getAddressType', () => {
    it('should return primary for valid primary address', () => {
      expect(getAddressType(validPrimaryAddress)).toBe('primary');
    });

    it('should return subaddress for valid subaddress', () => {
      expect(getAddressType(validSubaddress)).toBe('subaddress');
    });

    it('should return invalid for invalid address', () => {
      expect(getAddressType('invalid')).toBe('invalid');
    });
  });

  describe('truncateAddress', () => {
    it('should truncate long address', () => {
      const truncated = truncateAddress(validPrimaryAddress, 8);
      expect(truncated).toBe('4AAAAAAA...AAAAAAAA');
    });

    it('should return original if too short', () => {
      expect(truncateAddress('short')).toBe('short');
    });

    it('should handle empty string', () => {
      expect(truncateAddress('')).toBe('');
    });
  });

  describe('sanitizeAddressInput', () => {
    it('should remove whitespace', () => {
      const input = '  4AAAA AAAA  ';
      expect(sanitizeAddressInput(input)).toBe('4AAAAAAAA');
    });

    it('should remove invalid characters', () => {
      const input = '4AAA@#$%AAA';
      expect(sanitizeAddressInput(input)).toBe('4AAAAAA');
    });
  });
});
