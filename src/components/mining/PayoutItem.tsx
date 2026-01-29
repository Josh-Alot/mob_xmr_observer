import React from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import { Text, MonoText } from '@components/ui/Text';
import { useThemeColors } from '@hooks/useTheme';
import { formatXMRDisplay } from '@services/xmr-formatter';
import { formatSmartDate, formatBlockHeight } from '@utils/formatters';
import { truncateAddress } from '@services/address-validator';
import { EXPLORER_URLS } from '@api/endpoints';
import { spacing, borderRadius } from '@theme/spacing';
import { t } from '@i18n/index';
import { useLanguage } from '@store/store';
import { Payout } from '@api/types';

export interface PayoutItemProps {
  payout: Payout;
  onPress?: () => void;
}

export function PayoutItem({ payout, onPress }: PayoutItemProps) {
  const colors = useThemeColors();
  const locale = useLanguage();
  const dateLabels = {
    todayAt: t('time.todayAt'),
    yesterdayAt: t('time.yesterdayAt'),
  };

  const handleViewTransaction = async () => {
    const url = EXPLORER_URLS.transaction(payout.coinbase_id);
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open explorer:', error);
    }
  };

  return (
    <Pressable
      onPress={onPress ?? handleViewTransaction}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Payout of ${formatXMRDisplay(payout.coinbase_reward)}`}
    >
      <View style={styles.header}>
        <Text variant="titleMedium" style={{ color: colors.primary }}>
          {formatXMRDisplay(payout.coinbase_reward)}
        </Text>
        <Text variant="bodySmall" color="secondary">
          {formatSmartDate(payout.timestamp, locale, dateLabels)}
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text variant="labelSmall" color="tertiary">
            {t('payouts.blockHeight')}
          </Text>
          <Text variant="bodySmall">
            {formatBlockHeight(payout.main_height)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text variant="labelSmall" color="tertiary">
            {t('payouts.transactionId')}
          </Text>
          <MonoText variant="monoSmall" numberOfLines={1}>
            {truncateAddress(payout.coinbase_id, 8)}
          </MonoText>
        </View>
      </View>

      <View style={styles.footer}>
        <Text variant="labelSmall" style={{ color: colors.primary }}>
          {t('payouts.viewOnExplorer')} →
        </Text>
      </View>
    </Pressable>
  );
}

// Compact version for list display
export function PayoutItemCompact({ payout, onPress }: PayoutItemProps) {
  const colors = useThemeColors();
  const locale = useLanguage();
  const dateLabels = {
    todayAt: t('time.todayAt'),
    yesterdayAt: t('time.yesterdayAt'),
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.compactContainer,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.compactLeft}>
        <Text variant="bodyMedium" style={{ color: colors.primary }}>
          {formatXMRDisplay(payout.coinbase_reward)}
        </Text>
        <Text variant="labelSmall" color="tertiary">
          {t('payouts.blockShort')}{formatBlockHeight(payout.main_height)}
        </Text>
      </View>
      <Text variant="bodySmall" color="secondary">
        {formatSmartDate(payout.timestamp, locale, dateLabels)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  details: {
    gap: spacing[2],
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    marginTop: spacing[3],
    paddingTop: spacing[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
    alignItems: 'flex-end',
  },
  compactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  compactLeft: {
    flex: 1,
  },
});
