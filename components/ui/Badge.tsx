import { BorderRadius, Colors, Spacing, Typography } from '@/lib/constants';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export default function Badge({ label, variant = 'primary', size = 'medium', style }: BadgeProps) {
  const containerStyles: ViewStyle[] = [
    styles.container,
    size === 'small' && styles.containerSmall,
    variant === 'primary' && styles.containerPrimary,
    variant === 'secondary' && styles.containerSecondary,
    variant === 'success' && styles.containerSuccess,
    variant === 'warning' && styles.containerWarning,
    variant === 'error' && styles.containerError,
    variant === 'info' && styles.containerInfo,
    style,
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    size === 'small' && styles.textSmall,
  ];

  return (
    <View style={containerStyles}>
      <Text style={textStyles}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  containerSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  containerPrimary: {
    backgroundColor: Colors.primary,
  },
  containerSecondary: {
    backgroundColor: Colors.secondary,
  },
  containerSuccess: {
    backgroundColor: Colors.success,
  },
  containerWarning: {
    backgroundColor: Colors.warning,
  },
  containerError: {
    backgroundColor: Colors.error,
  },
  containerInfo: {
    backgroundColor: Colors.info,
  },
  text: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
  },
  textSmall: {
    fontSize: 10,
  },
});
