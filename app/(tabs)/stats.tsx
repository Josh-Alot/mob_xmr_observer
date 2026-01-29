import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { Text, Heading, Label } from '@components/ui/Text';
import { Card, CardHeader, CardContent } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { EmptyState } from '@components/feedback/EmptyState';
import { ErrorView } from '@components/feedback/ErrorView';
import { LoadingSpinner, Skeleton } from '@components/feedback/LoadingSpinner';
import { useThemeColors } from '@hooks/useTheme';
import { useMinerInfo, useSharesInWindow, usePoolInfo } from '@hooks/index';
import { useAddress, useLanguage } from '@store/store';
import {
  formatNumber,
  formatRelativeTime,
  formatBlockHeight,
  formatHashrate,
  formatPercentage,
} from '@utils/formatters';
import { spacing } from '@theme/spacing';
import { t } from '@i18n/index';

export default function StatsScreen() {
  const colors = useThemeColors();
  const queryClient = useQueryClient();
  const address = useAddress();
  const locale = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const minerInfo = useMinerInfo(address);
  const sharesInWindow = useSharesInWindow(address);
  const poolInfo = usePoolInfo();

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['minerInfo'] }),
      queryClient.invalidateQueries({ queryKey: ['sharesInWindow'] }),
      queryClient.invalidateQueries({ queryKey: ['poolInfo'] }),
    ]);
    setIsRefreshing(false);
  }, [queryClient]);

  if (!address) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <EmptyState
          title={t('home.noAddress')}
          description={t('home.addAddress')}
        />
      </SafeAreaView>
    );
  }

  const hasError = minerInfo.error || sharesInWindow.error;
  const is404Only =
    hasError &&
    (!minerInfo.error || minerInfo.error?.type === 'not_found') &&
    (!sharesInWindow.error || sharesInWindow.error?.type === 'not_found');
  const hasRealError = hasError && !is404Only;
  const isLoading = minerInfo.isLoading && !minerInfo.data;

  if (hasRealError && !minerInfo.data) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ErrorView
          title={t('errors.loadFailed')}
          message={minerInfo.error?.message ?? sharesInWindow.error?.message ?? t('errors.unknown')}
          onRetry={handleRefresh}
          fullScreen
        />
      </SafeAreaView>
    );
  }

  if (is404Only) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <EmptyState
          title={t('mining.noDataOnSidechain')}
          description={t('mining.noDataOnSidechainDesc')}
        />
      </SafeAreaView>
    );
  }

  // Calculate stats
  const totalShares = minerInfo.data?.shares.reduce((acc, s) => acc + s.shares, 0) ?? 0;
  const totalUncles = minerInfo.data?.shares.reduce((acc, s) => acc + s.uncles, 0) ?? 0;
  const windowShares = sharesInWindow.data?.length ?? 0;

  // Estimate hashrate (rough calculation)
  const poolDifficulty = poolInfo.data?.sidechain.difficulty ?? 0;
  const estimatedHashrate = windowShares > 0 && poolDifficulty > 0
    ? (windowShares * poolDifficulty) / (2016 * 10) // Rough estimate
    : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <LoadingSpinner message={t('common.loading')} />
        ) : (
          <>
            {/* Overview Card */}
            <View style={styles.section}>
              <Card variant="elevated">
                <CardHeader>
                  <View style={styles.cardHeader}>
                    <Heading level={3}>{t('mining.shares')}</Heading>
                    <Badge
                      label={formatNumber(totalShares + totalUncles)}
                      variant="info"
                    />
                  </View>
                </CardHeader>
                <CardContent>
                  <View style={styles.statsGrid}>
                    <StatBox
                      label={t('mining.shares')}
                      value={formatNumber(totalShares)}
                      highlight
                    />
                    <StatBox
                      label={t('mining.uncles')}
                      value={formatNumber(totalUncles)}
                    />
                    <StatBox
                      label={t('mining.sharesInWindow')}
                      value={formatNumber(windowShares)}
                    />
                    <StatBox
                      label={t('mining.estimatedHashrate')}
                      value={estimatedHashrate > 0 ? formatHashrate(estimatedHashrate) : 'N/A'}
                    />
                  </View>
                </CardContent>
              </Card>
            </View>

            {/* Last Share Info */}
            <View style={styles.section}>
              <Card variant="outlined">
                <CardHeader>
                  <Text variant="titleMedium">{t('mining.lastShare')}</Text>
                </CardHeader>
                <CardContent>
                  {minerInfo.data ? (
                    <View style={styles.infoList}>
                      <InfoRow
                        label={t('mining.lastShare')}
                        value={formatRelativeTime(minerInfo.data.last_share_timestamp, locale)}
                      />
                      <InfoRow
                        label={t('mining.lastShareHeight')}
                        value={formatBlockHeight(minerInfo.data.last_share_height)}
                      />
                    </View>
                  ) : (
                    <EmptyState
                      title={t('mining.noShares')}
                      description={t('mining.noSharesDesc')}
                    />
                  )}
                </CardContent>
              </Card>
            </View>

            {/* Shares Breakdown */}
            {minerInfo.data && minerInfo.data.shares.length > 0 && (
              <View style={styles.section}>
                <Card variant="outlined">
                  <CardHeader>
                    <Text variant="titleMedium">{t('mining.sharesBreakdown')}</Text>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.breakdownList}>
                      {minerInfo.data.shares.map((entry, index) => (
                        <View key={index} style={styles.breakdownItem}>
                          <View style={styles.breakdownLeft}>
                            <Text variant="bodyMedium">
                              {formatNumber(entry.shares)} {t('mining.shares').toLowerCase()}
                            </Text>
                            <Text variant="labelSmall" color="tertiary">
                              {formatNumber(entry.uncles)} {t('mining.uncles').toLowerCase()}
                            </Text>
                          </View>
                          <Text variant="bodySmall" color="secondary">
                            {t('mining.height')}: {formatBlockHeight(entry.last_height)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              </View>
            )}

            {/* Window Shares */}
            {sharesInWindow.data && sharesInWindow.data.length > 0 && (
              <View style={styles.section}>
                <Card variant="outlined">
                  <CardHeader>
                    <View style={styles.cardHeader}>
                      <Text variant="titleMedium">{t('mining.sharesInWindow')}</Text>
                      <Badge label={`${windowShares}`} variant="default" size="small" />
                    </View>
                  </CardHeader>
                  <CardContent>
                    <Text variant="bodySmall" color="secondary">
                      {t('mining.windowSharesDesc')}
                    </Text>
                  </CardContent>
                </Card>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  const colors = useThemeColors();

  return (
    <View style={styles.statBox}>
      <Label>{label}</Label>
      <Text
        variant="headlineSmall"
        style={highlight ? { color: colors.primary } : undefined}
      >
        {value}
      </Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text variant="bodyMedium" color="secondary">
        {label}
      </Text>
      <Text variant="bodyMedium">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  section: {
    marginBottom: spacing[4],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statBox: {
    width: '50%',
    marginBottom: spacing[4],
  },
  infoList: {
    gap: spacing[3],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownList: {
    gap: spacing[3],
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLeft: {
    flex: 1,
  },
});
