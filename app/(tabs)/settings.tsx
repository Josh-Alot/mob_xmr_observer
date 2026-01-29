import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Text, Heading, Label } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { Divider } from '@components/ui/Divider';
import { SidechainPicker } from '@components/mining/SidechainSelector';
import { useThemeColors } from '@hooks/useTheme';
import {
  useSettings,
  useSettingsActions,
  useAddressActions,
  useCacheActions,
} from '@store/store';
import { cacheStorage } from '@store/storage';
import { spacing, borderRadius } from '@theme/spacing';
import { t, setLocale } from '@i18n/index';
import { APP_VERSION, PAYOUT_LIMIT_OPTIONS, REFRESH_INTERVALS } from '@utils/constants';
import { ThemeMode, Language } from '@store/slices/settingsSlice';

export default function SettingsScreen() {
  const colors = useThemeColors();
  const settings = useSettings();
  const {
    setSidechain,
    setTheme,
    setLanguage,
    setRefreshInterval,
    setNotificationsEnabled,
    setHapticFeedbackEnabled,
    setPayoutLimit,
    resetSettings,
  } = useSettingsActions();
  const { clearAddress } = useAddressActions();
  const { clearCache } = useCacheActions();

  const handleThemeChange = useCallback(
    async (theme: ThemeMode) => {
      if (settings.hapticFeedbackEnabled) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setTheme(theme);
    },
    [settings.hapticFeedbackEnabled, setTheme]
  );

  const handleLanguageChange = useCallback(
    async (language: Language) => {
      if (settings.hapticFeedbackEnabled) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setLanguage(language);
      setLocale(language);
    },
    [settings.hapticFeedbackEnabled, setLanguage]
  );

  const handleClearCache = useCallback(() => {
    Alert.alert(
      t('settings.clearCache'),
      t('settings.clearCacheDesc'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: () => {
            clearCache();
            cacheStorage.clear();
          },
        },
      ]
    );
  }, [clearCache]);

  const handleResetSettings = useCallback(() => {
    Alert.alert(
      t('settings.resetSettings'),
      t('settings.resetSettingsDesc'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: () => {
            resetSettings();
            clearAddress();
            clearCache();
            cacheStorage.clear();
          },
        },
      ]
    );
  }, [resetSettings, clearAddress, clearCache]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance Section */}
        <View style={styles.section}>
          <SectionHeader title={t('settings.appearance')} />
          <Card variant="outlined" padding="none">
            {/* Theme */}
            <SettingItem label={t('settings.theme')}>
              <View style={styles.optionRow}>
                {(['light', 'dark', 'system'] as ThemeMode[]).map((theme) => (
                  <OptionButton
                    key={theme}
                    label={t(`settings.theme${theme.charAt(0).toUpperCase() + theme.slice(1)}` as any)}
                    selected={settings.theme === theme}
                    onPress={() => handleThemeChange(theme)}
                  />
                ))}
              </View>
            </SettingItem>

            <Divider spacing="none" />

            {/* Language */}
            <SettingItem label={t('settings.language')}>
              <View style={styles.optionRow}>
                {(['en', 'pt'] as Language[]).map((lang) => (
                  <OptionButton
                    key={lang}
                    label={t(`settings.language${lang.charAt(0).toUpperCase() + lang.slice(1)}` as any)}
                    selected={settings.language === lang}
                    onPress={() => handleLanguageChange(lang)}
                  />
                ))}
              </View>
            </SettingItem>
          </Card>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <SectionHeader title={t('settings.data')} />
          <Card variant="outlined" padding="none">
            {/* Sidechain */}
            <SettingItem label={t('settings.sidechain')}>
              <SidechainPicker
                value={settings.sidechain}
                onValueChange={setSidechain}
              />
            </SettingItem>

            <Divider spacing="none" />

            {/* Refresh Interval */}
            <SettingItem
              label={t('settings.refreshInterval')}
              description={t('settings.refreshIntervalDesc')}
            >
              <View style={styles.optionRow}>
                {[1, 5, 10, 15, 30].map((mins) => (
                  <OptionButton
                    key={mins}
                    label={`${mins}`}
                    selected={settings.refreshInterval === mins}
                    onPress={() => setRefreshInterval(mins)}
                    compact
                  />
                ))}
              </View>
            </SettingItem>

            <Divider spacing="none" />

            {/* Payout Limit */}
            <SettingItem label={t('settings.payoutLimit')}>
              <View style={styles.optionRow}>
                {PAYOUT_LIMIT_OPTIONS.map((limit) => (
                  <OptionButton
                    key={limit}
                    label={`${limit}`}
                    selected={settings.payoutLimit === limit}
                    onPress={() => setPayoutLimit(limit)}
                    compact
                  />
                ))}
              </View>
            </SettingItem>
          </Card>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <SectionHeader title={t('settings.notifications')} />
          <Card variant="outlined" padding="none">
            <SettingToggle
              label={t('settings.notificationsEnabled')}
              description={t('settings.notificationsDesc')}
              value={settings.notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />

            <Divider spacing="none" />

            <SettingToggle
              label={t('settings.hapticFeedback')}
              description={t('settings.hapticFeedbackDesc')}
              value={settings.hapticFeedbackEnabled}
              onValueChange={setHapticFeedbackEnabled}
            />
          </Card>
        </View>

        {/* Advanced Section */}
        <View style={styles.section}>
          <SectionHeader title={t('settings.advanced')} />
          <Card variant="outlined" padding="none">
            <SettingButton
              label={t('settings.clearCache')}
              description={t('settings.clearCacheDesc')}
              onPress={handleClearCache}
              destructive
            />

            <Divider spacing="none" />

            <SettingButton
              label={t('settings.resetSettings')}
              description={t('settings.resetSettingsDesc')}
              onPress={handleResetSettings}
              destructive
            />
          </Card>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <SectionHeader title={t('settings.about')} />
          <Card variant="outlined" padding="none">
            <SettingItem label={t('settings.version')}>
              <Text variant="bodyMedium" color="secondary">
                {APP_VERSION}
              </Text>
            </SettingItem>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-components
function SectionHeader({ title }: { title: string }) {
  return (
    <Text variant="labelMedium" color="secondary" style={styles.sectionHeader}>
      {title.toUpperCase()}
    </Text>
  );
}

function SettingItem({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingLabel}>
        <Text variant="bodyMedium">{label}</Text>
        {description && (
          <Text variant="bodySmall" color="tertiary" style={styles.description}>
            {description}
          </Text>
        )}
      </View>
      {children && <View style={styles.settingValue}>{children}</View>}
    </View>
  );
}

function SettingToggle({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const colors = useThemeColors();

  return (
    <View style={[styles.settingItem, styles.settingItemRow]}>
      <View style={[styles.settingLabel, styles.settingLabelInline]}>
        <Text variant="bodyMedium">{label}</Text>
        {description && (
          <Text variant="bodySmall" color="tertiary" style={styles.description}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.background}
      />
    </View>
  );
}

function SettingButton({
  label,
  description,
  onPress,
  destructive,
}: {
  label: string;
  description?: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingItem,
        styles.settingItemRow,
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={[styles.settingLabel, styles.settingLabelInline]}>
        <Text
          variant="bodyMedium"
          style={destructive ? { color: colors.error } : undefined}
        >
          {label}
        </Text>
        {description && (
          <Text variant="bodySmall" color="tertiary" style={styles.description}>
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

function OptionButton({
  label,
  selected,
  onPress,
  compact,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  compact?: boolean;
}) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.optionButton,
        compact && styles.optionButtonCompact,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? `${colors.primary}15` : 'transparent',
        },
      ]}
    >
      <Text
        variant="labelMedium"
        numberOfLines={1}
        style={{ color: selected ? colors.primary : colors.text }}
      >
        {label}
      </Text>
    </Pressable>
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
    marginBottom: spacing[6],
  },
  sectionHeader: {
    marginBottom: spacing[2],
    marginLeft: spacing[2],
  },
  settingItem: {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: spacing[4],
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabel: {
    marginBottom: spacing[2],
  },
  settingLabelInline: {
    flex: 1,
    marginBottom: 0,
    marginRight: spacing[4],
  },
  settingValue: {
    width: '100%',
  },
  description: {
    marginTop: spacing[1],
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    width: '100%',
    maxWidth: '100%',
  },
  optionButton: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  optionButtonCompact: {
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
