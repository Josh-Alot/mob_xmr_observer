/**
 * Color palette for P2Pool Observer
 * Monero orange (#FF6600) as accent color
 */

export const colors = {
  // Brand colors
  primary: {
    50: '#FFF3E6',
    100: '#FFE0CC',
    200: '#FFC299',
    300: '#FFA366',
    400: '#FF8533',
    500: '#FF6600', // Monero orange
    600: '#CC5200',
    700: '#993D00',
    800: '#662900',
    900: '#331400',
  },

  // Neutral colors
  neutral: {
    0: '#FFFFFF',
    50: '#F8F9FA',
    100: '#F1F3F4',
    200: '#E8EAED',
    300: '#DADCE0',
    400: '#BDC1C6',
    500: '#9AA0A6',
    600: '#80868B',
    700: '#5F6368',
    800: '#3C4043',
    900: '#202124',
    950: '#121212',
    1000: '#000000',
  },

  // Semantic colors
  success: {
    light: '#4ADE80',
    main: '#22C55E',
    dark: '#16A34A',
  },
  warning: {
    light: '#FBBF24',
    main: '#F59E0B',
    dark: '#D97706',
  },
  error: {
    light: '#F87171',
    main: '#EF4444',
    dark: '#DC2626',
  },
  info: {
    light: '#60A5FA',
    main: '#3B82F6',
    dark: '#2563EB',
  },

  // XMR specific
  xmr: {
    orange: '#FF6600',
    gray: '#4C4C4C',
  },
} as const;

export const lightTheme = {
  background: colors.neutral[0],
  backgroundSecondary: colors.neutral[50],
  backgroundTertiary: colors.neutral[100],
  surface: colors.neutral[0],
  surfaceElevated: colors.neutral[50],
  border: colors.neutral[200],
  borderLight: colors.neutral[100],

  text: colors.neutral[900],
  textSecondary: colors.neutral[700],
  textTertiary: colors.neutral[500],
  textInverse: colors.neutral[0],
  textDisabled: colors.neutral[400],

  primary: colors.primary[500],
  primaryLight: colors.primary[100],
  primaryDark: colors.primary[700],

  success: colors.success.main,
  warning: colors.warning.main,
  error: colors.error.main,
  info: colors.info.main,

  tabBar: colors.neutral[0],
  tabBarBorder: colors.neutral[200],
  tabBarInactive: colors.neutral[500],
  tabBarActive: colors.primary[500],

  card: colors.neutral[0],
  cardBorder: colors.neutral[200],

  shimmer: colors.neutral[200],
} as const;

export const darkTheme = {
  background: colors.neutral[950],
  backgroundSecondary: colors.neutral[900],
  backgroundTertiary: colors.neutral[800],
  surface: colors.neutral[900],
  surfaceElevated: colors.neutral[800],
  border: colors.neutral[700],
  borderLight: colors.neutral[800],

  text: colors.neutral[50],
  textSecondary: colors.neutral[300],
  textTertiary: colors.neutral[500],
  textInverse: colors.neutral[900],
  textDisabled: colors.neutral[600],

  primary: colors.primary[500],
  primaryLight: colors.primary[900],
  primaryDark: colors.primary[400],

  success: colors.success.light,
  warning: colors.warning.light,
  error: colors.error.light,
  info: colors.info.light,

  tabBar: colors.neutral[900],
  tabBarBorder: colors.neutral[800],
  tabBarInactive: colors.neutral[500],
  tabBarActive: colors.primary[500],

  card: colors.neutral[900],
  cardBorder: colors.neutral[700],

  shimmer: colors.neutral[800],
} as const;

export type Theme = typeof lightTheme;
export type ThemeColors = keyof Theme;
