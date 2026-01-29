import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, CardHeader, CardContent } from '@components/ui/Card';
import { Text, Label } from '@components/ui/Text';
import { Badge } from '@components/ui/Badge';
import { Skeleton } from '@components/feedback/LoadingSpinner';
import { useThemeColors } from '@hooks/useTheme';
import {
  formatHashrate,
  formatDifficulty,
  formatNumber,
  formatPercentage,
  formatBlockHeight,
} from '@utils/formatters';
import { formatXMRDisplay } from '@services/xmr-formatter';
import { spacing } from '@theme/spacing';
import { t } from '@i18n/index';
import { PoolInfo } from '@api/types';

export interface PoolStatusCardProps {
  poolInfo: PoolInfo | null;
  isLoading?: boolean;
  compact?: boolean;
}

export function PoolStatusCard({ poolInfo, isLoading, compact = false }: PoolStatusCardProps) {
  const colors = useThemeColors();

  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <Skeleton width={120} height={20} />
        </CardHeader>
        <CardContent>
          <View style={styles.grid}>
            <GridSkeleton />
            <GridSkeleton />
            <GridSkeleton />
            <GridSkeleton />
          </View>
        </CardContent>
      </Card>
    );
  }

  if (!poolInfo) {
    return null;
  }

  const { sidechain, mainchain } = poolInfo;

  if (compact) {
    return (
      <Card variant="outlined" padding="small">
        <View style={styles.compactRow}>
          <CompactStat
            label={t('pool.miners')}
            value={formatNumber(sidechain.miners)}
          />
          <View style={styles.compactDivider} />
          <CompactStat
            label={t('pool.effort')}
            value={formatPercentage(sidechain.effort.current)}
          />
          <View style={styles.compactDivider} />
          <CompactStat
            label={t('pool.blockReward')}
            value={formatXMRDisplay(mainchain.reward)}
          />
        </View>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <View style={styles.header}>
          <Text variant="titleMedium">{t('pool.status')}</Text>
          <Badge label={t('pool.online')} variant="success" size="small" />
        </View>
      </CardHeader>
      <CardContent>
        <View style={styles.grid}>
          <GridItem
            label={t('pool.networkHeight')}
            value={formatBlockHeight(mainchain.height)}
          />
          <GridItem
            label={t('pool.sidechainHeight')}
            value={formatBlockHeight(sidechain.height)}
          />
          <GridItem
            label={t('pool.networkDifficulty')}
            value={formatDifficulty(mainchain.difficulty)}
          />
          <GridItem
            label={t('pool.blockReward')}
            value={formatXMRDisplay(mainchain.reward)}
            highlight
          />
          <GridItem
            label={t('pool.miners')}
            value={formatNumber(sidechain.miners)}
          />
          <GridItem
            label={t('pool.effort')}
            value={formatPercentage(sidechain.effort.current)}
          />
        </View>

        <View style={[styles.windowInfo, { borderTopColor: colors.border }]}>
          <Text variant="labelSmall" color="secondary">
            {t('pool.windowSize')}
          </Text>
          <Text variant="bodySmall">
            {formatNumber(sidechain.window.blocks)} {t('pool.blocksInWindow')} • {formatNumber(sidechain.window.miners)} {t('pool.miners').toLowerCase()}
          </Text>
        </View>
      </CardContent>
    </Card>
  );
}

interface GridItemProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function GridItem({ label, value, highlight }: GridItemProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.gridItem}>
      <Label>{label}</Label>
      <Text
        variant="titleSmall"
        style={highlight ? { color: colors.primary } : undefined}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

function GridSkeleton() {
  return (
    <View style={styles.gridItem}>
      <Skeleton width={70} height={12} />
      <Skeleton width={50} height={18} style={{ marginTop: spacing[1] }} />
    </View>
  );
}

function CompactStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.compactStat}>
      <Text variant="labelSmall" color="tertiary">
        {label}
      </Text>
      <Text variant="bodySmall">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
    marginBottom: spacing[4],
  },
  windowInfo: {
    paddingTop: spacing[4],
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  compactStat: {
    alignItems: 'center',
    flex: 1,
  },
  compactDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
