import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors, fontSize, radius, spacing } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
};

export default function PrimaryButton({ title, onPress, loading = false }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, loading ? styles.buttonDisabled : null]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={colors.surface} />
      ) : (
        <Text style={styles.label}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    backgroundColor: colors.primaryDisabled,
  },
  label: {
    color: colors.surface,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
});
