import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewProps } from 'react-native';
import { Text } from '@components/ui/Text';
import { useThemeColors } from '@hooks/useTheme';
import { spacing } from '@theme/spacing';

export interface LoadingSpinnerProps extends ViewProps {
  size?: 'small' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = 'large',
  message,
  fullScreen = false,
  style,
  ...props
}: LoadingSpinnerProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.container,
        fullScreen && [styles.fullScreen, { backgroundColor: colors.background }],
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel={message || 'Loading'}
      {...props}
    >
      <ActivityIndicator
        size={size}
        color={colors.primary}
      />
      {message && (
        <Text
          variant="bodyMedium"
          color="secondary"
          style={styles.message}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

// Skeleton loading placeholder
export function Skeleton({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewProps['style'];
}) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.shimmer,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    marginTop: spacing[4],
    textAlign: 'center',
  },
});
