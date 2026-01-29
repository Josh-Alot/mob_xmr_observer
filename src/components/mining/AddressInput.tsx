import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Text } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { useThemeColors } from '@hooks/useTheme';
import { useSettings } from '@store/store';
import { validateMoneroAddress, truncateAddress } from '@services/address-validator';
import { spacing } from '@theme/spacing';
import { t } from '@i18n/index';

export interface AddressInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onValidAddress?: (address: string) => void;
  onSave?: (address: string) => void;
  showSaveButton?: boolean;
  disabled?: boolean;
}

export function AddressInput({
  value,
  onChangeText,
  onValidAddress,
  onSave,
  showSaveButton = false,
  disabled = false,
}: AddressInputProps) {
  const colors = useThemeColors();
  const { hapticFeedbackEnabled } = useSettings();
  const [validationError, setValidationError] = useState<string | undefined>();

  const handleTextChange = useCallback(
    (text: string) => {
      // Remove whitespace
      const cleaned = text.replace(/\s/g, '');
      onChangeText(cleaned);

      // Validate if we have enough characters
      if (cleaned.length === 95 || cleaned.length === 106) {
        const result = validateMoneroAddress(cleaned);
        if (result.isValid) {
          setValidationError(undefined);
          onValidAddress?.(cleaned);
        } else {
          setValidationError(result.error ? t(`address.${result.error}`) : undefined);
        }
      } else if (cleaned.length > 0) {
        setValidationError(undefined);
      }
    },
    [onChangeText, onValidAddress]
  );

  const handlePaste = useCallback(async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        if (hapticFeedbackEnabled) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        handleTextChange(text);
      }
    } catch (error) {
      console.error('Failed to paste:', error);
    }
  }, [handleTextChange, hapticFeedbackEnabled]);

  const handleClear = useCallback(() => {
    onChangeText('');
    setValidationError(undefined);
  }, [onChangeText]);

  const handleSave = useCallback(() => {
    if (value && validateMoneroAddress(value).isValid) {
      onSave?.(value);
    }
  }, [value, onSave]);

  const isValid = value.length > 0 && validateMoneroAddress(value).isValid;

  const PasteIcon = () => (
    <Text variant="labelMedium" style={{ color: colors.primary }}>
      {t('address.paste')}
    </Text>
  );

  return (
    <View style={styles.container}>
      <Input
        label={t('address.title')}
        placeholder={t('address.placeholder')}
        value={value}
        onChangeText={handleTextChange}
        error={validationError}
        editable={!disabled}
        autoCapitalize="none"
        autoCorrect={false}
        multiline={false}
        maxLength={106}
        rightIcon={value.length === 0 ? <PasteIcon /> : undefined}
        onRightIconPress={value.length === 0 ? handlePaste : undefined}
      />

      {value.length > 0 && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text variant="labelMedium" color="secondary">
              {t('address.clear')}
            </Text>
          </TouchableOpacity>

          {isValid && (
            <View style={styles.validBadge}>
              <Text variant="labelSmall" style={{ color: colors.success }}>
                ✓ {t('address.valid')}
              </Text>
            </View>
          )}
        </View>
      )}

      {showSaveButton && isValid && (
        <Button
          title={t('address.save')}
          variant="primary"
          onPress={handleSave}
          fullWidth
          style={styles.saveButton}
        />
      )}
    </View>
  );
}

// Display-only address card
export function AddressCard({
  address,
  onPress,
  onCopy,
}: {
  address: string;
  onPress?: () => void;
  onCopy?: () => void;
}) {
  const colors = useThemeColors();
  const { hapticFeedbackEnabled } = useSettings();

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(address);
    if (hapticFeedbackEnabled) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onCopy?.();
  }, [address, hapticFeedbackEnabled, onCopy]);

  return (
    <Card variant="outlined" onPress={onPress}>
      <View style={styles.addressCard}>
        <View style={styles.addressInfo}>
          <Text variant="labelSmall" color="secondary">
            {t('address.title')}
          </Text>
          <Text variant="mono" numberOfLines={1} ellipsizeMode="middle">
            {truncateAddress(address, 12)}
          </Text>
        </View>
        <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
          <Text variant="labelMedium" style={{ color: colors.primary }}>
            {t('common.copy')}
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  clearButton: {
    padding: spacing[2],
  },
  validBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    marginTop: spacing[4],
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressInfo: {
    flex: 1,
    marginRight: spacing[3],
  },
  copyButton: {
    padding: spacing[2],
  },
});
