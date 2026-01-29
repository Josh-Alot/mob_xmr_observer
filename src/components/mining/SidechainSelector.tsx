import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@components/ui/Text';
import { useThemeColors } from '@hooks/useTheme';
import { useSidechain, useStore } from '@store/store';
import { SIDECHAINS, Sidechain } from '@api/endpoints';
import { t } from '@i18n/index';
import { spacing, borderRadius } from '@theme/spacing';

const SIDECHAIN_LABEL_KEYS: Record<Sidechain, 'settings.sidechainMain' | 'settings.sidechainMini' | 'settings.sidechainNano'> = {
  main: 'settings.sidechainMain',
  mini: 'settings.sidechainMini',
  nano: 'settings.sidechainNano',
};

function getSidechainLabel(sidechain: Sidechain): string {
  return t(SIDECHAIN_LABEL_KEYS[sidechain]) || sidechain;
}

export interface SidechainSelectorProps {
  onChange?: (sidechain: Sidechain) => void;
}

export function SidechainSelector({ onChange }: SidechainSelectorProps) {
  const colors = useThemeColors();
  const currentSidechain = useSidechain();
  const setSidechain = useStore((state) => state.setSidechain);
  const hapticFeedbackEnabled = useStore(
    (state) => state.settings.hapticFeedbackEnabled
  );

  const handleSelect = async (sidechain: Sidechain) => {
    if (hapticFeedbackEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSidechain(sidechain);
    onChange?.(sidechain);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
    >
      {SIDECHAINS.map((sidechain) => {
        const isSelected = sidechain === currentSidechain;
        return (
          <Pressable
            key={sidechain}
            onPress={() => handleSelect(sidechain)}
            style={[
              styles.option,
              isSelected && [
                styles.selectedOption,
                { backgroundColor: colors.primary },
              ],
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              variant="labelMedium"
              style={{
                color: isSelected ? colors.textInverse : colors.text,
              }}
            >
              {getSidechainLabel(sidechain)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Radio button list variant for settings
export function SidechainPicker({ value, onValueChange }: {
  value: Sidechain;
  onValueChange: (value: Sidechain) => void;
}) {
  const colors = useThemeColors();
  const hapticFeedbackEnabled = useStore(
    (state) => state.settings.hapticFeedbackEnabled
  );

  const handleSelect = async (sidechain: Sidechain) => {
    if (hapticFeedbackEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onValueChange(sidechain);
  };

  return (
    <View style={styles.radioContainer}>
      {SIDECHAINS.map((sidechain) => {
        const isSelected = sidechain === value;
        return (
          <Pressable
            key={sidechain}
            onPress={() => handleSelect(sidechain)}
            style={({ pressed }) => [
              styles.radioRow,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={getSidechainLabel(sidechain)}
          >
            <View
              style={[
                styles.radioOuter,
                {
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              {isSelected && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
            </View>
            <Text
              variant="bodyMedium"
              style={{ color: colors.text, marginLeft: spacing[3] }}
            >
              {getSidechainLabel(sidechain)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    padding: spacing[1],
  },
  option: {
    flex: 1,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  selectedOption: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  radioContainer: {
    width: '100%',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
