import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, CardHeader, CardContent } from '@components/ui/Card';
import { Text, Label } from '@components/ui/Text';
import { Badge } from '@components/ui/Badge';
import { Skeleton } from '@components/feedback/LoadingSpinner';
import { useThemeColors } from '@hooks/useTheme';
import { formatRelativeTime, formatNumber, formatBlockHeight } from '@utils/formatters';
import { spacing } from '@theme/spacing';
import { t } from '@i18n/index';
import { useLanguage } from '@store/store';
import { MinerInfo } from '@api/types';

export interface SharesCardProps {
  minerInfo: MinerInfo | null;
  isLoading?: boolean;
}

export function SharesCard({ minerInfo, isLoading }: SharesCardProps) {
  const colors = useThemeColors();
  const locale = useLanguage();

  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <Skeleton width={100} height={20} />
        </CardHeader>
        <CardContent>
          <View style={styles.statsRow}>
            <StatSkeleton />
            <StatSkeleton />
          </View>
          <View style={styles.statsRow}>
            <StatSkeleton />
            <StatSkeleton />
          </View>
        </CardContent>
      </Card>
    );
  }

  if (!minerInfo) {
    return null;
  }

  // Calculate totals
  const totalShares = minerInfo.shares.reduce((acc, s) => acc + s.shares, 0);
  const totalUncles = minerInfo.shares.reduce((acc, s) => acc + s.uncles, 0);

  return (
    <Card variant="elevated">
      <CardHeader>
        <View style={styles.header}>
          <Text variant="titleMedium">{t('mining.shares')}</Text>
          <Badge label="PPLNS" variant="info" size="small" />
        </View>
      </CardHeader>
      <CardContent>
        <View style={styles.statsRow}>
          <StatItem
            label={t('mining.totalShares')}
            value={formatNumber(totalShares)}
            highlight
          />
          <StatItem
            label={t('mining.uncles')}
            value={formatNumber(totalUncles)}
          />
        </View>

        <View style={[styles.statsRow, styles.bottomRow]}>
          <StatItem
            label={t('mining.lastShare')}
            value={formatRelativeTime(minerInfo.last_share_timestamp, locale)}
          />
          <StatItem
            label={t('mining.lastShareHeight')}
            value={formatBlockHeight(minerInfo.last_share_height)}
          />
        </View>
      </CardContent>
    </Card>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function StatItem({ label, value, highlight }: StatItemProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.statItem}>
      <Label>{label}</Label>
      <Text
        variant={highlight ? 'headlineSmall' : 'titleMedium'}
        style={highlight ? { color: colors.primary } : undefined}
      >
        {value}
      </Text>
    </View>
  );
}

function StatSkeleton() {
  return (
    <View style={styles.statItem}>
      <Skeleton width={80} height={14} />
      <Skeleton width={60} height={24} style={{ marginTop: spacing[1] }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomRow: {
    marginTop: spacing[4],
  },
  statItem: {
    flex: 1,
  },
});
