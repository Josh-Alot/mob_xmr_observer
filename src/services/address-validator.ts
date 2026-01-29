/**
 * Monero address validation service
 */

const MONERO_ADDRESS_LENGTH = 95;
const MONERO_INTEGRATED_ADDRESS_LENGTH = 106;
const MONERO_PRIMARY_PREFIX = '4';
const MONERO_SUBADDRESS_PREFIX = '8';
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Address type enumeration
 */
export type AddressType = 'primary' | 'subaddress' | 'integrated' | 'invalid';

/**
 * Translation key for validation errors (use with t(`address.${error}`))
 */
export type ValidationErrorKey = 'required' | 'invalidLength' | 'invalidPrefix' | 'invalidChars';

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  type: AddressType;
  error?: ValidationErrorKey;
}

/**
 * Check if a character is valid in Base58 encoding
 */
function isBase58Char(char: string): boolean {
  return BASE58_ALPHABET.includes(char);
}

/**
 * Validate Monero address format
 * @param address - The address to validate
 * @returns true if the address format is valid
 */
export function isValidMoneroAddress(address: string): boolean {
  return validateMoneroAddress(address).isValid;
}

/**
 * Validate Monero address with detailed result
 * @param address - The address to validate
 * @returns Validation result with type and error message
 */
export function validateMoneroAddress(address: string): ValidationResult {
  // Null/undefined check
  if (!address || typeof address !== 'string') {
    return {
      isValid: false,
      type: 'invalid',
      error: 'required',
    };
  }

  // Trim whitespace
  const trimmedAddress = address.trim();

  // Length check
  if (
    trimmedAddress.length !== MONERO_ADDRESS_LENGTH &&
    trimmedAddress.length !== MONERO_INTEGRATED_ADDRESS_LENGTH
  ) {
    return {
      isValid: false,
      type: 'invalid',
      error: 'invalidLength',
    };
  }

  // Prefix check
  const firstChar = trimmedAddress[0];
  if (firstChar !== MONERO_PRIMARY_PREFIX && firstChar !== MONERO_SUBADDRESS_PREFIX) {
    return {
      isValid: false,
      type: 'invalid',
      error: 'invalidPrefix',
    };
  }

  // Base58 character validation
  for (const char of trimmedAddress) {
    if (!isBase58Char(char)) {
      return {
        isValid: false,
        type: 'invalid',
        error: 'invalidChars',
      };
    }
  }

  // Determine address type
  let type: AddressType;
  if (trimmedAddress.length === MONERO_INTEGRATED_ADDRESS_LENGTH) {
    type = 'integrated';
  } else if (firstChar === MONERO_PRIMARY_PREFIX) {
    type = 'primary';
  } else {
    type = 'subaddress';
  }

  return {
    isValid: true,
    type,
  };
}

/**
 * Get the type of a Monero address
 * @param address - The address to check
 * @returns The address type
 */
export function getAddressType(address: string): AddressType {
  return validateMoneroAddress(address).type;
}

/**
 * Truncate address for display
 * @param address - Full address
 * @param chars - Number of characters to show on each side (default: 8)
 * @returns Truncated address string
 */
export function truncateAddress(address: string, chars = 8): string {
  if (!address || address.length < chars * 2 + 3) {
    return address;
  }
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Sanitize address input
 * @param input - Raw input string
 * @returns Sanitized address string
 */
export function sanitizeAddressInput(input: string): string {
  return input
    .trim()
    .replace(/\s/g, '') // Remove all whitespace
    .replace(/[^1-9A-HJ-NP-Za-km-z]/g, ''); // Keep only Base58 chars
}
