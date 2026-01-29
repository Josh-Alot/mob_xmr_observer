import {
  formatXMR,
  formatXMRDisplay,
  formatXMRCompact,
  parseXMR,
  sumAtomicUnits,
} from '@services/xmr-formatter';

describe('XMR Formatter', () => {
  describe('formatXMR', () => {
    it('should format 1 XMR correctly', () => {
      expect(formatXMR(1000000000000n)).toBe('1');
    });

    it('should format 0 correctly', () => {
      expect(formatXMR(0)).toBe('0');
    });

    it('should format small amounts correctly', () => {
      expect(formatXMR(3400854816)).toBe('0.003400854816');
    });

    it('should handle large amounts', () => {
      expect(formatXMR(123456789012345678n)).toBe('123456.789012345678');
    });

    it('should trim trailing zeros by default', () => {
      expect(formatXMR(1000000000000n)).toBe('1');
      expect(formatXMR(1500000000000n)).toBe('1.5');
    });

    it('should respect maxDecimals option', () => {
      expect(formatXMR(1234567890123n, { maxDecimals: 4 })).toBe('1.2345');
    });

    it('should add symbol when requested', () => {
      expect(formatXMR(1000000000000n, { showSymbol: true })).toBe('1 XMR');
    });
  });

  describe('formatXMRDisplay', () => {
    it('should format with locale and symbol', () => {
      const result = formatXMRDisplay(1000000000000n);
      expect(result).toContain('XMR');
    });

    it('should format small amounts', () => {
      const result = formatXMRDisplay(3400854816);
      expect(result).toContain('0.0034');
      expect(result).toContain('XMR');
    });
  });

  describe('formatXMRCompact', () => {
    it('should format thousands with K suffix', () => {
      expect(formatXMRCompact(1500000000000000n)).toBe('1.50K XMR');
    });

    it('should format small amounts with more decimals', () => {
      const result = formatXMRCompact(500000000n);
      expect(result).toContain('0.0005');
    });
  });

  describe('parseXMR', () => {
    it('should parse XMR string to atomic units', () => {
      expect(parseXMR('1')).toBe(1000000000000n);
    });

    it('should parse decimal amounts', () => {
      expect(parseXMR('0.5')).toBe(500000000000n);
    });

    it('should handle XMR symbol in string', () => {
      expect(parseXMR('1.5 XMR')).toBe(1500000000000n);
    });
  });

  describe('sumAtomicUnits', () => {
    it('should sum array of atomic units', () => {
      const amounts = [1000000000000n, 500000000000n, 250000000000n];
      expect(sumAtomicUnits(amounts)).toBe(1750000000000n);
    });

    it('should handle empty array', () => {
      expect(sumAtomicUnits([])).toBe(0n);
    });

    it('should handle mixed types', () => {
      const amounts = [1000000000000, '500000000000', BigInt(250000000000)];
      expect(sumAtomicUnits(amounts)).toBe(1750000000000n);
    });
  });
});
