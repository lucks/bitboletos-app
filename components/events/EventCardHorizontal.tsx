import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/lib/constants';
import { Event } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Badge from '../ui/Badge';

interface EventCardHorizontalProps {
  event: Event;
  onPress: () => void;
}

export default function EventCardHorizontal({ event, onPress }: EventCardHorizontalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('es-MX', { month: 'short' });
    return `${day} ${month}`;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return `$${price.toLocaleString('es-MX')}`;
  };

  const minPrice = event.ticket_types?.reduce((min, ticket) => {
    return ticket.price < min ? ticket.price : min;
  }, event.ticket_types[0]?.price || 0) || 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.image_url }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {minPrice === 0 && (
          <View style={styles.freeBadge}>
            <Badge label="GRATIS" variant="success" size="small" />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        
        <View style={styles.detailsRow}>
          <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.detailText} numberOfLines={1}>
            {event.venue || event.city?.name}
          </Text>
        </View>
        
        <View style={styles.bottomRow}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.dateText}>
              {formatDate(event.date)}
            </Text>
          </View>
          
          {minPrice > 0 && (
            <Text style={styles.price}>{formatPrice(minPrice)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  imageContainer: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  freeBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.sm,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs / 2,
  },
  detailText: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs / 2,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs / 2,
  },
  price: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
});
