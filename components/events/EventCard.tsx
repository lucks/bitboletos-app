import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/lib/constants';
import { Event } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Badge from '../ui/Badge';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

export default function EventCard({
  event,
  onPress,
  onFavoritePress,
  isFavorite = false,
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('es-MX', { month: 'short' });
    return `${day} ${month}`;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return `Desde $${price.toLocaleString('es-MX')}`;
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
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        
        {event.is_featured && (
          <View style={styles.badgeContainer}>
            <Badge label="DESTACADO" variant="warning" size="small" />
          </View>
        )}
        
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? Colors.error : '#FFFFFF'}
          />
        </TouchableOpacity>
        
        <View style={styles.infoOverlay}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          
          <View style={styles.detailsRow}>
            <Ionicons name="location-outline" size={14} color="#FFFFFF" />
            <Text style={styles.detailText} numberOfLines={1}>
              {event.venue || event.city?.name}
            </Text>
          </View>
          
          <View style={styles.detailsRow}>
            <Ionicons name="calendar-outline" size={14} color="#FFFFFF" />
            <Text style={styles.detailText}>
              {formatDate(event.date)} • {event.time}
            </Text>
          </View>
          
          <View style={styles.bottomRow}>
            <View style={styles.priceContainer}>
              <Ionicons name="pricetag-outline" size={14} color="#FFFFFF" />
              <Text style={styles.price}>{formatPrice(minPrice)}</Text>
            </View>
            
            {event.favorite_count && event.favorite_count > 0 && (
              <View style={styles.favoriteCount}>
                <Ionicons name="heart" size={12} color="#FFFFFF" />
                <Text style={styles.favoriteCountText}>
                  {event.favorite_count > 1000
                    ? `${(event.favorite_count / 1000).toFixed(1)}k`
                    : event.favorite_count}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: Spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  badgeContainer: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs / 2,
  },
  detailText: {
    fontSize: Typography.sizes.caption,
    color: '#FFFFFF',
    marginLeft: Spacing.xs,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    marginLeft: Spacing.xs,
  },
  favoriteCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
  },
  favoriteCountText: {
    fontSize: Typography.sizes.small,
    color: '#FFFFFF',
    marginLeft: Spacing.xs / 2,
  },
});
