import { Check } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fonts, radii } from '@/constants/theme';
import type { SurveyAnswer, SurveyQuestion } from '@/features/survey/queries';

type Props = { q: SurveyQuestion; value: SurveyAnswer | undefined; onChange: (v: SurveyAnswer) => void };

/** One survey question in RN: radio rows, checkbox rows, a 1–5 scale as chips, € number, multiline text. */
export function QuestionField({ q, value, onChange }: Props) {
  const { t } = useTranslation();
  switch (q.type) {
    case 'radio': {
      const selected = typeof value === 'string' ? value : value && typeof value === 'object' && !Array.isArray(value) && 'value' in value ? String(value.value) : null;
      const otherText = value && typeof value === 'object' && !Array.isArray(value) && 'text' in value ? String(value.text ?? '') : '';
      return (
        <View style={styles.options}>
          {(q.options ?? []).map((o) => {
            const on = selected === o.value;
            return (
              <Pressable key={o.value} style={[styles.option, on && styles.optionOn]} onPress={() => onChange(o.value === 'other' ? { value: 'other', text: otherText } : o.value)} accessibilityRole="radio" accessibilityState={{ selected: on }}>
                <View style={[styles.radio, on && styles.radioOn]}>{on ? <View style={styles.radioDot} /> : null}</View>
                <Text style={styles.optionText}>{o.label}</Text>
              </Pressable>
            );
          })}
          {selected === 'other' ? (
            <DebouncedInput value={otherText} onCommit={(text) => onChange({ value: 'other', text })} placeholder={t('survey.other')} multiline />
          ) : null}
        </View>
      );
    }
    case 'checkbox': {
      const arr = Array.isArray(value) ? value.map(String) : [];
      return (
        <View style={styles.options}>
          {(q.options ?? []).map((o) => {
            const on = arr.includes(o.value);
            return (
              <Pressable key={o.value} style={[styles.option, on && styles.optionOn]} onPress={() => onChange(on ? arr.filter((v) => v !== o.value) : [...arr, o.value])} accessibilityRole="checkbox" accessibilityState={{ checked: on }}>
                <View style={[styles.check, on && styles.checkOn]}>{on ? <Check size={14} color={colors.onAccent} strokeWidth={3} /> : null}</View>
                <Text style={styles.optionText}>{o.label}</Text>
              </Pressable>
            );
          })}
        </View>
      );
    }
    case 'scale': {
      const [low, high] = (q.help_text ?? '').split('·').map((s) => s.trim());
      const n = typeof value === 'number' ? value : null;
      return (
        <View>
          <View style={styles.scale}>
            {[1, 2, 3, 4, 5].map((v) => {
              const on = n === v;
              return (
                <Pressable key={v} style={[styles.scaleChip, on && { backgroundColor: colors.ink }]} onPress={() => onChange(v)} accessibilityRole="radio" accessibilityState={{ selected: on }}>
                  <Text style={[styles.scaleText, on && { color: '#FFFFFF' }]}>{v}</Text>
                </Pressable>
              );
            })}
          </View>
          {low || high ? (
            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabel}>{low}</Text>
              <Text style={styles.scaleLabel}>{high}</Text>
            </View>
          ) : null}
        </View>
      );
    }
    case 'number':
      return (
        <View style={styles.numberWrap}>
          <Text style={styles.euro}>€</Text>
          <DebouncedInput
            value={typeof value === 'number' ? String(value) : ''}
            onCommit={(text) => {
              const num = Number(text.replace(',', '.'));
              onChange(text.trim() === '' || Number.isNaN(num) ? null : num);
            }}
            keyboardType="decimal-pad"
            style={{ flex: 1 }}
          />
        </View>
      );
    case 'text':
    default:
      return <DebouncedInput value={typeof value === 'string' ? value : ''} onCommit={(text) => onChange(text)} multiline />;
  }
}

/** Local text state, committed 800 ms after the last keystroke and on blur (the PWA's autosave rhythm). */
function DebouncedInput({ value, onCommit, multiline, keyboardType, placeholder, style }: { value: string; onCommit: (v: string) => void; multiline?: boolean; keyboardType?: 'decimal-pad'; placeholder?: string; style?: object }) {
  const [text, setText] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => setText(value), [value]);
  const schedule = (v: string) => {
    setText(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onCommit(v), 800);
  };
  const flush = () => {
    if (timer.current) clearTimeout(timer.current);
    if (text !== value) onCommit(text);
  };
  return (
    <TextInput
      style={[styles.input, multiline && styles.multiline, style]}
      value={text}
      onChangeText={schedule}
      onBlur={flush}
      multiline={multiline}
      keyboardType={keyboardType}
      placeholder={placeholder}
      placeholderTextColor={colors.ink3}
    />
  );
}

const styles = StyleSheet.create({
  options: { gap: 8 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingHorizontal: 14, paddingVertical: 10, borderRadius: radii.md, backgroundColor: colors.bgSoft },
  optionOn: { backgroundColor: colors.accentSoft },
  optionText: { flex: 1, fontFamily: fonts.medium, fontSize: 15, lineHeight: 20, color: colors.ink },
  radio: { width: 22, height: 22, borderRadius: radii.full, borderWidth: 2, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.accent },
  radioDot: { width: 10, height: 10, borderRadius: radii.full, backgroundColor: colors.accent },
  check: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  scale: { flexDirection: 'row', gap: 8 },
  scaleChip: { flex: 1, height: 44, borderRadius: radii.md, backgroundColor: colors.bgSoft, alignItems: 'center', justifyContent: 'center' },
  scaleText: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  scaleLabel: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.ink3, maxWidth: '48%' },
  numberWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 54, borderRadius: radii.md, backgroundColor: colors.bgSoft, paddingHorizontal: 16 },
  euro: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink2 },
  input: { minHeight: 54, borderRadius: radii.md, backgroundColor: colors.bgSoft, paddingHorizontal: 16, paddingVertical: 14, fontFamily: fonts.medium, fontSize: 15, lineHeight: 20, color: colors.ink },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
});
