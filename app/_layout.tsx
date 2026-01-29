import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider, useIsFetching } from '@tanstack/react-query';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useStatusBarStyle, useThemeColors } from '@hooks/useTheme';
import { useLanguage } from '@store/store';
import { setLocale } from '@i18n/index';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function GlobalLoadingBar() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const isFetching = useIsFetching();

  if (isFetching === 0) return null;

  return (
    <View
      style={[
        styles.loadingBar,
        {
          backgroundColor: colors.primary,
          top: insets.top,
        },
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    />
  );
}

function RootLayoutContent() {
  const statusBarStyle = useStatusBarStyle();
  const colors = useThemeColors();
  const language = useLanguage();

  // Keep i18n locale in sync with settings
  useEffect(() => {
    setLocale(language);
  }, [language]);

  useEffect(() => {
    // Hide splash screen after a short delay
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    
    const timer = setTimeout(hideSplash, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <GlobalLoadingBar />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <RootLayoutContent />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    zIndex: 9999,
    elevation: 9999,
  },
});
