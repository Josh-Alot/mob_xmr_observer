import { useColorScheme } from 'react-native';
import { useThemeMode } from '@store/store';
import { lightTheme, darkTheme, Theme } from '@theme/colors';

/**
 * Hook to get the current theme colors based on settings and system preference
 */
export function useThemeColors(): Theme {
  const themeMode = useThemeMode();
  const systemColorScheme = useColorScheme();

  if (themeMode === 'system') {
    return systemColorScheme === 'dark' ? darkTheme : lightTheme;
  }

  return themeMode === 'dark' ? darkTheme : lightTheme;
}

/**
 * Hook to check if dark mode is active
 */
export function useIsDarkMode(): boolean {
  const themeMode = useThemeMode();
  const systemColorScheme = useColorScheme();

  if (themeMode === 'system') {
    return systemColorScheme === 'dark';
  }

  return themeMode === 'dark';
}

/**
 * Hook to get theme-aware status bar style for expo-status-bar.
 * Dark theme → 'light' (light icons on dark background), light theme → 'dark'.
 */
export function useStatusBarStyle(): 'light' | 'dark' {
  const isDark = useIsDarkMode();
  return isDark ? 'light' : 'dark';
}
