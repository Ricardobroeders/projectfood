import { useEffect, useState, type PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { motion } from '@/constants/motion';
import { colors, radii } from '@/constants/theme';

const HIDDEN_Y = 640;

type Props = PropsWithChildren<{ visible: boolean; onRequestClose: () => void }>;

/**
 * Bottom sheet in the sheet motion class: eases in, eases out, never bounces. Stays mounted
 * until the slide-out has finished so closing is animated too.
 */
export function Sheet({ visible, onRequestClose, children }: Props) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const backdrop = useSharedValue(0);
  const slide = useSharedValue(HIDDEN_Y);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      backdrop.value = withTiming(1, motion.backdrop);
      slide.value = withTiming(0, motion.sheetIn);
    } else if (mounted) {
      backdrop.value = withTiming(0, motion.backdrop);
      slide.value = withTiming(HIDDEN_Y, motion.sheetOut, (finished) => {
        if (finished) scheduleOnRN(setMounted, false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: slide.value }] }));

  return (
    <Modal visible={mounted} transparent statusBarTranslucent animationType="none" onRequestClose={onRequestClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onRequestClose} />
        </Animated.View>
        <Animated.View style={[styles.sheet, { paddingBottom: 20 + insets.bottom }, sheetStyle]}>
          <View style={styles.handle} />
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(31,27,22,0.32)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 8,
  },
  handle: { width: 40, height: 4, borderRadius: radii.full, backgroundColor: colors.hairline, alignSelf: 'center', marginBottom: 6 },
});
