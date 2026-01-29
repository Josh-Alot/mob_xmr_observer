import { Platform, TextStyle } from 'react-native';

/**
 * Typography system following Material Design 3 type scale
 */

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

const fontFamilyMono = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
} as const;

type TypographyStyle = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing'
>;

export const typography: Record<string, TypographyStyle> = {
  // Display styles
  displayLarge: {
    fontFamily,
    fontSize: 57,
    fontWeight: fontWeights.regular,
    lineHeight: 64,
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontFamily,
    fontSize: 45,
    fontWeight: fontWeights.regular,
    lineHeight: 52,
    letterSpacing: 0,
  },
  displaySmall: {
    fontFamily,
    fontSize: 36,
    fontWeight: fontWeights.regular,
    lineHeight: 44,
    letterSpacing: 0,
  },

  // Headline styles
  headlineLarge: {
    fontFamily,
    fontSize: 32,
    fontWeight: fontWeights.semibold,
    lineHeight: 40,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily,
    fontSize: 28,
    fontWeight: fontWeights.semibold,
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontFamily,
    fontSize: 24,
    fontWeight: fontWeights.semibold,
    lineHeight: 32,
    letterSpacing: 0,
  },

  // Title styles
  titleLarge: {
    fontFamily,
    fontSize: 22,
    fontWeight: fontWeights.medium,
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily,
    fontSize: 16,
    fontWeight: fontWeights.medium,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily,
    fontSize: 14,
    fontWeight: fontWeights.medium,
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  // Body styles
  bodyLarge: {
    fontFamily,
    fontSize: 16,
    fontWeight: fontWeights.regular,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily,
    fontSize: 14,
    fontWeight: fontWeights.regular,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily,
    fontSize: 12,
    fontWeight: fontWeights.regular,
    lineHeight: 16,
    letterSpacing: 0.4,
  },

  // Label styles
  labelLarge: {
    fontFamily,
    fontSize: 14,
    fontWeight: fontWeights.medium,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily,
    fontSize: 12,
    fontWeight: fontWeights.medium,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily,
    fontSize: 11,
    fontWeight: fontWeights.medium,
    lineHeight: 16,
    letterSpacing: 0.5,
  },

  // Monospace (for addresses, hashes)
  mono: {
    fontFamily: fontFamilyMono,
    fontSize: 14,
    fontWeight: fontWeights.regular,
    lineHeight: 20,
    letterSpacing: 0,
  },
  monoSmall: {
    fontFamily: fontFamilyMono,
    fontSize: 12,
    fontWeight: fontWeights.regular,
    lineHeight: 16,
    letterSpacing: 0,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
