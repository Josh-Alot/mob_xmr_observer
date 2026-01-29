import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Text } from '@components/ui/Text';
import { Button } from '@components/ui/Button';
import { useThemeColors } from '@hooks/useTheme';
import { spacing } from '@theme/spacing';

export interface EmptyStateProps extends ViewProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  style,
  ...props
}: EmptyStateProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[styles.container, style]}
      {...props}
    >
      {icon && (
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.backgroundTertiary },
          ]}
        >
          {icon}
        </View>
      )}

      <Text
        variant="titleMedium"
        align="center"
        style={styles.title}
      >
        {title}
      </Text>

      {description && (
        <Text
          variant="bodyMedium"
          color="secondary"
          align="center"
          style={styles.description}
        >
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          variant="primary"
          onPress={onAction}
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
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  title: {
    marginBottom: spacing[2],
  },
  description: {
    maxWidth: 280,
  },
  button: {
    marginTop: spacing[6],
  },
});
