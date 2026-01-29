import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withRepeat,
} from 'react-native-reanimated';
import { Text } from '@components/ui/Text';
import { useThemeColors } from '@hooks/useTheme';
import { spacing } from '@theme/spacing';
import { t } from '@i18n/index';

export interface OfflineBannerProps {
  visible: boolean;
  lastSync?: number;
}

export function OfflineBanner({ visible, lastSync }: OfflineBannerProps) {
  const colors = useThemeColors();
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 200 });
  }, [visible, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: opacity.value === 0 ? -50 : 0 }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.warning },
        animatedStyle,
      ]}
    >
      <Text
        variant="labelMedium"
        style={{ color: '#000' }}
      >
        {t('common.offline')}
      </Text>
      {lastSync && (
        <Text
          variant="labelSmall"
          style={[styles.lastSync, { color: '#000' }]}
        >
          {t('common.lastSync')}: {new Date(lastSync).toLocaleTimeString()}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
  },
  lastSync: {
    marginLeft: spacing[2],
    opacity: 0.8,
  },
});
