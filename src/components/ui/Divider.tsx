import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useThemeColors } from '@hooks/useTheme';
import { spacing } from '@theme/spacing';

export interface DividerProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'small' | 'medium' | 'large';
}

export function Divider({
  orientation = 'horizontal',
  spacing: spacingProp = 'medium',
  style,
  ...props
}: DividerProps) {
  const colors = useThemeColors();

  const spacingValues = {
    none: 0,
    small: spacing[2],
    medium: spacing[4],
    large: spacing[6],
  };

  const isHorizontal = orientation === 'horizontal';
  const margin = spacingValues[spacingProp];

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: colors.border,
          ...(isHorizontal
            ? {
                height: StyleSheet.hairlineWidth,
                marginVertical: margin,
              }
            : {
                width: StyleSheet.hairlineWidth,
                marginHorizontal: margin,
              }),
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    alignSelf: 'stretch',
  },
});
