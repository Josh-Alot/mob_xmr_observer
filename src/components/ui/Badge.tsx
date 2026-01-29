import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useThemeColors } from '@hooks/useTheme';
import { spacing, borderRadius } from '@theme/spacing';

export interface BadgeProps extends ViewProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium';
}

export function Badge({
  label,
  variant = 'default',
  size = 'medium',
  style,
  ...props
}: BadgeProps) {
  const colors = useThemeColors();

  const variantColors = {
    default: {
      background: colors.backgroundTertiary,
      text: colors.text,
    },
    success: {
      background: `${colors.success}20`,
      text: colors.success,
    },
    warning: {
      background: `${colors.warning}20`,
      text: colors.warning,
    },
    error: {
      background: `${colors.error}20`,
      text: colors.error,
    },
    info: {
      background: `${colors.info}20`,
      text: colors.info,
    },
  };

  const sizeStyles = {
    small: {
      paddingVertical: spacing[0.5],
      paddingHorizontal: spacing[2],
    },
    medium: {
      paddingVertical: spacing[1],
      paddingHorizontal: spacing[3],
    },
  };

  const { background, text } = variantColors[variant];

  return (
    <View
      style={[
        styles.badge,
        sizeStyles[size],
        { backgroundColor: background },
        style,
      ]}
      {...props}
    >
      <Text
        variant={size === 'small' ? 'labelSmall' : 'labelMedium'}
        style={{ color: text }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
});
