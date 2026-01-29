import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useQueryClient } from '@tanstack/react-query';
import { Text, Heading } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { PayoutItem } from '@components/mining/PayoutItem';
import { EmptyState } from '@components/feedback/EmptyState';
import { ErrorView } from '@components/feedback/ErrorView';
import { LoadingSpinner } from '@components/feedback/LoadingSpinner';
import { useThemeColors } from '@hooks/useTheme';
import { usePayouts } from '@hooks/index';
import { useAddress } from '@store/store';
import { formatXMRDisplay } from '@services/xmr-formatter';
import { calculateTotalEarnings } from '@api/types';
import { spacing } from '@theme/spacing';
import { t } from '@i18n/index';
import { Payout } from '@api/types';

export default function PayoutsScreen() {
  const colors = useThemeColors();
  const queryClient = useQueryClient();
  const address = useAddress();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: payouts, isLoading, error, refetch } = usePayouts(address);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  // Calculate total earnings
  const totalEarnings = useMemo(() => {
    if (!payouts || payouts.length === 0) return BigInt(0);
    return calculateTotalEarnings(payouts);
  }, [payouts]);

  const renderItem = useCallback(
    ({ item }: { item: Payout }) => (
      <PayoutItem payout={item} />
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: Payout) => `${item.main_height}-${item.coinbase_output_index}`,
    []
  );

  const ListHeader = useCallback(
    () => (
      <View style={styles.header}>
        {/* Total Earnings Card */}
        <Card variant="elevated" style={styles.earningsCard}>
          <Text variant="labelMedium" color="secondary">
            {t('payouts.totalEarnings')}
          </Text>
          <Heading level={2} style={{ color: colors.primary }}>
            {formatXMRDisplay(totalEarnings)}
          </Heading>
          <Text variant="labelSmall" color="tertiary">
            {payouts?.length ?? 0} {t('payouts.title').toLowerCase()}
          </Text>
        </Card>

        <Text variant="titleMedium" style={styles.listTitle}>
          {t('payouts.title')}
        </Text>
      </View>
    ),
    [colors.primary, totalEarnings, payouts?.length]
  );

  const ListEmpty = useCallback(
    () =>
      isLoading ? (
        <LoadingSpinner message={t('common.loading')} />
      ) : (
        <EmptyState
          title={t('payouts.noPayouts')}
          description={t('payouts.noPayoutsDesc')}
        />
      ),
    [isLoading]
  );

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

  if (error?.type === 'not_found') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <EmptyState
          title={t('payouts.noDataOnSidechain')}
          description={t('payouts.noDataOnSidechainDesc')}
        />
      </SafeAreaView>
    );
  }

  if (error && !payouts) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <ErrorView
          title={t('errors.loadFailed')}
          message={error.message}
          onRetry={handleRefresh}
          fullScreen
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <FlashList
        data={payouts ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={140}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  header: {
    marginBottom: spacing[4],
  },
  earningsCard: {
    marginBottom: spacing[4],
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  listTitle: {
    marginBottom: spacing[2],
  },
});
