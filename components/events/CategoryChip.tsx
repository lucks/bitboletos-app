import { BorderRadius, Colors, Spacing, Typography } from '@/lib/constants';
import { Category } from '@/lib/types';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CategoryChipProps {
  category: Category;
  onPress: () => void;
  isSelected?: boolean;
}

export default function CategoryChip({ category, onPress, isSelected = false }: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isSelected ? (
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.icon}>{category.icon}</Text>
            <Text style={[styles.name, styles.nameSelected]}>{category.name}</Text>
          </View>
        </LinearGradient>
      ) : (
        <View style={[styles.content, styles.contentUnselected]}>
          <Text style={styles.icon}>{category.icon}</Text>
          <Text style={styles.name}>{category.name}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: Spacing.sm,
  },
  gradient: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minWidth: 80,
  },
  contentUnselected: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    fontSize: 28,
    marginBottom: Spacing.xs / 2,
  },
  name: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  nameSelected: {
    color: '#FFFFFF',
  },
});
