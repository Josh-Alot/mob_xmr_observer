import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { Text, Heading } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { AddressInput, AddressCard } from '@components/mining/AddressInput';
import { SharesCard } from '@components/mining/SharesCard';
import { PoolStatusCard } from '@components/mining/PoolStatusCard';
import { PayoutItemCompact } from '@components/mining/PayoutItem';
import { SidechainSelector } from '@components/mining/SidechainSelector';
import { EmptyState } from '@components/feedback/EmptyState';
import { ErrorView } from '@components/feedback/ErrorView';
import { LoadingSpinner } from '@components/feedback/LoadingSpinner';
import { useThemeColors } from '@hooks/useTheme';
import { useMinerInfo, usePoolInfo, usePayouts } from '@hooks/index';
import { useAddress, useAddressActions, useLastSync } from '@store/store';
import { spacing } from '@theme/spacing';
import { t } from '@i18n/index';

export default function HomeScreen() {
  const colors = useThemeColors();
  const queryClient = useQueryClient();
  const address = useAddress();
  const { setAddress, setAddressValid } = useAddressActions();
  const lastSync = useLastSync();

  const [inputAddress, setInputAddress] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Queries
  const poolInfo = usePoolInfo();
  const minerInfo = useMinerInfo(address);
  const payouts = usePayouts(address);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['poolInfo'] }),
      queryClient.invalidateQueries({ queryKey: ['minerInfo'] }),
      queryClient.invalidateQueries({ queryKey: ['payouts'] }),
    ]);
    setIsRefreshing(false);
  }, [queryClient]);

  const handleSaveAddress = useCallback(
    (newAddress: string) => {
      setAddress(newAddress);
      setAddressValid(true);
      setInputAddress('');
    },
    [setAddress, setAddressValid]
  );

  const handleChangeAddress = useCallback(() => {
    if (address) {
      setInputAddress(address);
    }
    setAddress(null);
    setAddressValid(false);
  }, [address, setAddress, setAddressValid]);

  const hasError = minerInfo.error || payouts.error;
  const is404Only =
    hasError &&
    (!minerInfo.error || minerInfo.error?.type === 'not_found') &&
    (!payouts.error || payouts.error?.type === 'not_found');
  const hasRealError = hasError && !is404Only;
  const isLoading = minerInfo.isLoading || payouts.isLoading;

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
        {/* Sidechain Selector */}
        <View style={styles.section}>
          <SidechainSelector />
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          {!address ? (
            <Card variant="elevated">
              <Heading level={3} style={styles.sectionTitle}>
                {t('home.welcome')}
              </Heading>
              <Text variant="bodyMedium" color="secondary" style={styles.description}>
                {t('home.enterAddress')}
              </Text>
              <AddressInput
                value={inputAddress}
                onChangeText={setInputAddress}
                onSave={handleSaveAddress}
                showSaveButton
              />
            </Card>
          ) : (
            <AddressCard
              address={address}
              onPress={handleChangeAddress}
            />
          )}
        </View>

        {/* Pool Status */}
        <View style={styles.section}>
          <PoolStatusCard
            poolInfo={poolInfo.data ?? null}
            isLoading={poolInfo.isLoading}
          />
        </View>

        {/* Mining Stats (only if address is set) */}
        {address && (
          <>
            {hasRealError ? (
              <View style={styles.section}>
                <ErrorView
                  title={t('errors.loadFailed')}
                  message={minerInfo.error?.message ?? payouts.error?.message ?? t('errors.unknown')}
                  onRetry={handleRefresh}
                />
              </View>
            ) : is404Only ? (
              <View style={styles.section}>
                <EmptyState
                  title={t('mining.noDataOnSidechain')}
                  description={t('mining.noDataOnSidechainDesc')}
                />
              </View>
            ) : isLoading && !minerInfo.data ? (
              <View style={styles.section}>
                <LoadingSpinner
                  message={t('common.loading')}
                  fullScreen={false}
                />
              </View>
            ) : (
              <>
                <View style={styles.section}>
                  <SharesCard
                    minerInfo={minerInfo.data ?? null}
                    isLoading={isLoading}
                  />
                </View>

                {/* Recent Payouts */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text variant="titleMedium">{t('home.recentPayouts')}</Text>
                  </View>
                  {payouts.data && payouts.data.length > 0 ? (
                    <Card variant="outlined" padding="none">
                      {payouts.data.slice(0, 3).map((payout) => (
                        <PayoutItemCompact
                          key={`${payout.main_height}-${payout.coinbase_output_index}`}
                          payout={payout}
                        />
                      ))}
                    </Card>
                  ) : !isLoading ? (
                    <EmptyState
                      title={t('payouts.noPayouts')}
                      description={t('payouts.noPayoutsDesc')}
                    />
                  ) : null}
                </View>
              </>
            )}
          </>
        )}

        {/* No Address Message */}
        {!address && (
          <View style={styles.section}>
            <EmptyState
              title={t('home.noAddress')}
              description={t('home.addAddress')}
            />
          </View>
        )}

        {/* Last Sync */}
        {lastSync > 0 && (
          <View style={styles.footer}>
            <Text variant="labelSmall" color="tertiary">
              {t('common.lastSync')}: {new Date(lastSync).toLocaleTimeString()}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  sectionTitle: {
    marginBottom: spacing[2],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  description: {
    marginBottom: spacing[4],
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing[4],
  },
});
