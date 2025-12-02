/**
 * Design System Constants for BitBoletos
 * Based on mobile_app_spec.md
 */

// Color Palette
export const Colors = {
  // Primary Colors
  primary: '#6366F1',      // Indigo
  secondary: '#EC4899',    // Pink
  accent: '#F59E0B',       // Amber

  // Neutrals
  text: '#1F2937',         // Gray 800
  textSecondary: '#6B7280', // Gray 500
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB', // Gray 50
  border: '#E5E7EB',       // Gray 200

  // Semantic Colors
  success: '#10B981',      // Green
  error: '#EF4444',        // Red
  warning: '#F59E0B',      // Amber
  info: '#3B82F6',         // Blue

  // Gradients
  gradientStart: '#6366F1',
  gradientEnd: '#EC4899',
};

// Typography
export const Typography = {
  fontFamily: 'Inter',
  
  sizes: {
    h1: 28,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 14,
    small: 12,
  },
  
  weights: {
    regular: '400' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// Spacing System (8px base)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Component Sizes
export const ComponentSizes = {
  button: {
    height: 48,
    borderRadius: BorderRadius.md,
  },
  input: {
    height: 48,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  icon: {
    default: 20,
    large: 24,
    xlarge: 32,
  },
};

// Animation Durations
export const AnimationDurations = {
  fast: 150,
  normal: 250,
  slow: 350,
};

// Layout
export const Layout = {
  screenPadding: Spacing.md,
  maxContentWidth: 1200,
};
