import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text } from './Text';
import { useThemeColors } from '@hooks/useTheme';
import { spacing, borderRadius, minTouchSize } from '@theme/spacing';
import { typography } from '@theme/typography';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      style,
      editable = true,
      ...props
    },
    ref
  ) => {
    const colors = useThemeColors();
    const [isFocused, setIsFocused] = useState(false);

    const borderColor = error
      ? colors.error
      : isFocused
        ? colors.primary
        : colors.border;

    return (
      <View style={styles.container}>
        {label && (
          <Text
            variant="labelMedium"
            color="secondary"
            style={styles.label}
          >
            {label}
          </Text>
        )}

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor,
            },
            !editable && styles.disabled,
          ]}
        >
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: colors.text,
              },
              leftIcon && styles.inputWithLeftIcon,
              rightIcon && styles.inputWithRightIcon,
              style,
            ]}
            placeholderTextColor={colors.textTertiary}
            editable={editable}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {rightIcon && (
            <TouchableOpacity
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
              style={styles.rightIcon}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>

        {(error || hint) && (
          <Text
            variant="bodySmall"
            color={error ? 'error' : 'tertiary'}
            style={styles.helperText}
          >
            {error || hint}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing[1],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    minHeight: minTouchSize,
  },
  input: {
    flex: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    ...typography.bodyMedium,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing[2],
  },
  inputWithRightIcon: {
    paddingRight: spacing[2],
  },
  leftIcon: {
    paddingLeft: spacing[4],
  },
  rightIcon: {
    paddingRight: spacing[4],
  },
  helperText: {
    marginTop: spacing[1],
  },
  disabled: {
    opacity: 0.6,
  },
});
