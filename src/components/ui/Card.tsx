import React from 'react';
import { View, ViewProps, StyleSheet, Pressable } from 'react-native';
import { useThemeColors } from '@hooks/useTheme';
import { spacing, borderRadius } from '@theme/spacing';

export interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  padding = 'medium',
  onPress,
  style,
  children,
  ...props
}: CardProps) {
  const colors = useThemeColors();

  const variantStyles = {
    default: {
      backgroundColor: colors.card,
      borderWidth: 0,
    },
    elevated: {
      backgroundColor: colors.surfaceElevated,
      borderWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    outlined: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
  };

  const paddingStyles = {
    none: 0,
    small: spacing[3],
    medium: spacing[4],
    large: spacing[6],
  };

  const cardStyle = [
    styles.card,
    variantStyles[variant],
    { padding: paddingStyles[padding] },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

// Convenience components
export function CardHeader({ children, style, ...props }: ViewProps) {
  return (
    <View style={[styles.header, style]} {...props}>
      {children}
    </View>
  );
}

export function CardContent({ children, style, ...props }: ViewProps) {
  return (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({ children, style, ...props }: ViewProps) {
  return (
    <View style={[styles.footer, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  header: {
    marginBottom: spacing[3],
  },
  content: {
    // Content has default spacing from parent padding
  },
  footer: {
    marginTop: spacing[3],
    paddingTop: spacing[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
});
