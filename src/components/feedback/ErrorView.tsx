import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Text } from '@components/ui/Text';
import { Button } from '@components/ui/Button';
import { useThemeColors } from '@hooks/useTheme';
import { spacing } from '@theme/spacing';
import { t } from '@i18n/index';

export interface ErrorViewProps extends ViewProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  fullScreen?: boolean;
}

export function ErrorView({
  title,
  message,
  onRetry,
  retryLabel,
  fullScreen = false,
  style,
  ...props
}: ErrorViewProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.container,
        fullScreen && [styles.fullScreen, { backgroundColor: colors.background }],
        style,
      ]}
      accessibilityRole="alert"
      {...props}
    >
      <View style={styles.iconContainer}>
        <Text style={[styles.icon, { color: colors.error }]}>!</Text>
      </View>

      {title && (
        <Text
          variant="titleMedium"
          style={styles.title}
        >
          {title}
        </Text>
      )}

      <Text
        variant="bodyMedium"
        color="secondary"
        align="center"
        style={styles.message}
      >
        {message}
      </Text>

      {onRetry && (
        <Button
          title={retryLabel || t('common.retry')}
          variant="outline"
          onPress={onRetry}
          style={styles.button}
        />
      )}
    </View>
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
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  icon: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  message: {
    maxWidth: 280,
  },
  button: {
    marginTop: spacing[6],
  },
});
