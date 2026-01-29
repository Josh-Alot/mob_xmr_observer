import BigNumber from 'bignumber.js';

/**
 * XMR amount formatting service
 * Handles conversion between atomic units and XMR
 */

// 1 XMR = 10^12 atomic units (piconero)
const ATOMIC_UNITS_PER_XMR = new BigNumber(1e12);

/**
 * Formatting options for XMR display
 */
export interface FormatOptions {
  maxDecimals?: number;
  minDecimals?: number;
  trimTrailingZeros?: boolean;
  showSymbol?: boolean;
  locale?: string;
}

const DEFAULT_OPTIONS: Required<FormatOptions> = {
  maxDecimals: 12,
  minDecimals: 0,
  trimTrailingZeros: true,
  showSymbol: false,
  locale: 'en-US',
};

/**
 * Format atomic units to XMR string
 * @param atomicUnits - Amount in atomic units (piconero)
 * @param options - Formatting options
 * @returns Formatted XMR string
 */
export function formatXMR(
  atomicUnits: number | bigint | string,
  options: FormatOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const bn = new BigNumber(atomicUnits.toString());
  const xmr = bn.dividedBy(ATOMIC_UNITS_PER_XMR);

  let formatted = xmr.toFixed(opts.maxDecimals);

  if (opts.trimTrailingZeros) {
    const [integer, decimal = ''] = formatted.split('.');
    const trimmedDecimal = decimal.replace(/0+$/, '').padEnd(opts.minDecimals, '0');
    formatted = trimmedDecimal ? `${integer}.${trimmedDecimal}` : (integer ?? '0');
  }

  if (opts.showSymbol) {
    formatted += ' XMR';
  }

  return formatted;
}

/**
 * Format XMR for display with locale-aware number formatting
 * @param atomicUnits - Amount in atomic units
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted display string
 */
export function formatXMRDisplay(
  atomicUnits: number | bigint | string,
  locale = 'en-US'
): string {
  const xmr = formatXMR(atomicUnits, { maxDecimals: 8, trimTrailingZeros: true });
  const number = parseFloat(xmr);

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  }).format(number);

  return `${formatted} XMR`;
}

/**
 * Format XMR for compact display (shorter format)
 * @param atomicUnits - Amount in atomic units
 * @returns Compact formatted string
 */
export function formatXMRCompact(atomicUnits: number | bigint | string): string {
  const bn = new BigNumber(atomicUnits.toString());
  const xmr = bn.dividedBy(ATOMIC_UNITS_PER_XMR);
  const value = xmr.toNumber();

  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K XMR`;
  }
  if (value >= 1) {
    return `${value.toFixed(4)} XMR`;
  }
  if (value >= 0.001) {
    return `${value.toFixed(6)} XMR`;
  }
  return `${value.toFixed(8)} XMR`;
}

/**
 * Parse XMR string to atomic units
 * @param xmr - XMR amount as string
 * @returns Amount in atomic units as bigint
 */
export function parseXMR(xmr: string): bigint {
  // Remove any XMR symbol and whitespace
  const cleaned = xmr.replace(/\s*XMR\s*/gi, '').trim();
  const bn = new BigNumber(cleaned);
  const atomicUnits = bn.multipliedBy(ATOMIC_UNITS_PER_XMR);
  return BigInt(atomicUnits.toFixed(0));
}

/**
 * Calculate total from array of atomic unit amounts
 * @param amounts - Array of amounts in atomic units
 * @returns Total in atomic units as bigint
 */
export function sumAtomicUnits(amounts: (number | bigint | string)[]): bigint {
  return amounts.reduce((acc, amount) => {
    return acc + BigInt(amount.toString());
  }, BigInt(0));
}

/**
 * Convert XMR to USD (placeholder - would need price feed)
 * @param atomicUnits - Amount in atomic units
 * @param xmrPrice - Current XMR price in USD
 * @returns USD amount
 */
export function atomicUnitsToUSD(
  atomicUnits: number | bigint | string,
  xmrPrice: number
): number {
  const bn = new BigNumber(atomicUnits.toString());
  const xmr = bn.dividedBy(ATOMIC_UNITS_PER_XMR);
  return xmr.multipliedBy(xmrPrice).toNumber();
}
