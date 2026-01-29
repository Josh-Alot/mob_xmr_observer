import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Heading } from '@components/ui/Text';
import { Button } from '@components/ui/Button';
import { useThemeColors } from '@hooks/useTheme';
import { spacing } from '@theme/spacing';

export default function NotFoundScreen() {
  const colors = useThemeColors();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <Heading level={1}>404</Heading>
          <Text variant="bodyLarge" color="secondary" style={styles.message}>
            This screen doesn't exist.
          </Text>
          <Link href="/" asChild>
            <Button title="Go to Home" variant="primary" />
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
  },
  message: {
    marginVertical: spacing[4],
    textAlign: 'center',
  },
});
