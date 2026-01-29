import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@hooks/useTheme';
import { useLanguage } from '@store/store';
import { t } from '@i18n/index';
import { spacing } from '@theme/spacing';

const TAB_ICON_SIZE = 24;

type TabName = 'home' | 'stats' | 'payouts' | 'settings';

const TAB_ICONS: Record<TabName, keyof typeof Ionicons.glyphMap> = {
  home: 'home',
  stats: 'bar-chart',
  payouts: 'wallet',
  settings: 'settings',
};

function TabIcon({ name, color }: { name: TabName; color: string }) {
  return (
    <Ionicons
      name={TAB_ICONS[name]}
      size={TAB_ICON_SIZE}
      color={color}
    />
  );
}

export default function TabLayout() {
  const colors = useThemeColors();
  useLanguage(); // Re-render when language changes so tab labels update

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingBottom: spacing[2],
          paddingTop: spacing[2],
          height: 60,
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.home'),
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: t('navigation.stats'),
          tabBarIcon: ({ color }) => <TabIcon name="stats" color={color} />,
        }}
      />
      <Tabs.Screen
        name="payouts"
        options={{
          title: t('navigation.payouts'),
          tabBarIcon: ({ color }) => <TabIcon name="payouts" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('navigation.settings'),
          tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}

