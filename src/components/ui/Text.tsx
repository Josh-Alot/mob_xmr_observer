import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { typography, TypographyVariant } from '@theme/typography';
import { useThemeColors } from '@hooks/useTheme';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'error' | 'success' | 'warning';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}

export function Text({
  variant = 'bodyMedium',
  color = 'primary',
  align = 'auto',
  style,
  children,
  ...props
}: TextProps) {
  const colors = useThemeColors();

  const colorMap: Record<NonNullable<TextProps['color']>, string> = {
    primary: colors.text,
    secondary: colors.textSecondary,
    tertiary: colors.textTertiary,
    inverse: colors.textInverse,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
  };

  const textStyle: TextStyle = {
    ...typography[variant],
    color: colorMap[color],
    textAlign: align,
  };

  return (
    <RNText style={[textStyle, style]} {...props}>
      {children}
    </RNText>
  );
}

// Convenience components
export function Heading({
  level = 1,
  ...props
}: TextProps & { level?: 1 | 2 | 3 }) {
  const variants: Record<number, TypographyVariant> = {
    1: 'headlineLarge',
    2: 'headlineMedium',
    3: 'headlineSmall',
  };
  return <Text variant={variants[level]} accessibilityRole="header" {...props} />;
}

export function Label(props: TextProps) {
  return <Text variant="labelMedium" color="secondary" {...props} />;
}

export function MonoText(props: TextProps) {
  return <Text variant="mono" {...props} />;
}
