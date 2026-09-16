import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Clock } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii } from '@/constants/theme';

/** "HH:MM" <-> Date helpers for the household dinner time. */
export function timeToDate(hhmm: string): Date {
  const [h, m] = hhmm.slice(0, 5).split(':').map(Number);
  const d = new Date();
  d.setHours(h || 18, m || 0, 0, 0);
  return d;
}
export function dateToTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** iOS shows the spinner inline; Android opens the system dialog from a big time button. */
export function DinnerTimePicker({ value, onChange }: { value: string; onChange: (hhmm: string) => void }) {
  const [open, setOpen] = useState(false);
  const date = timeToDate(value);
  const handle = (e: DateTimePickerEvent, d?: Date) => {
    if (Platform.OS === 'android') setOpen(false);
    if (e.type === 'set' && d) onChange(dateToTime(d));
  };
  if (Platform.OS === 'ios') {
    return <DateTimePicker value={date} mode="time" display="spinner" minuteInterval={5} onChange={handle} style={styles.spinner} />;
  }
  return (
    <View>
      <Pressable style={styles.button} onPress={() => setOpen(true)} accessibilityRole="button">
        <Clock size={22} color={colors.ink2} />
        <Text style={styles.time}>{value.slice(0, 5)}</Text>
      </Pressable>
      {open ? <DateTimePicker value={date} mode="time" display="default" is24Hour minuteInterval={5} onChange={handle} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: { alignSelf: 'center' },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, height: 72, borderRadius: radii.lg, backgroundColor: colors.bgSoft },
  time: { fontFamily: fonts.extrabold, fontSize: 32, lineHeight: 38, color: colors.ink, letterSpacing: -0.5 },
});
