import { Colors, ComponentSizes, Shadows } from '@/lib/constants';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: 'sm' | 'md' | 'lg';
}

export default function Card({ children, style, onPress, elevation = 'md' }: CardProps) {
  const cardStyles: ViewStyle[] = [
    styles.card,
    elevation === 'sm' && Shadows.sm,
    elevation === 'md' && Shadows.md,
    elevation === 'lg' && Shadows.lg,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: ComponentSizes.card.borderRadius,
    padding: ComponentSizes.card.padding,
  },
});
