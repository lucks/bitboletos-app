import CategoryChip from '@/components/events/CategoryChip';
import EventCard from '@/components/events/EventCard';
import EventCardHorizontal from '@/components/events/EventCardHorizontal';
import { Colors, Layout, Spacing, Typography } from '@/lib/constants';
import { getFeaturedMockEvents, getUpcomingMockEvents, mockCategories, mockCities, mockEvents } from '@/lib/mockData';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [selectedCity, setSelectedCity] = useState(mockCities[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const featuredEvents = getFeaturedMockEvents();
  const upcomingEvents = getUpcomingMockEvents(selectedCity.id);

  const handleEventPress = (eventId: string) => {
    // TODO: Navigate to event detail screen
    console.log('Event pressed:', eventId);
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    // TODO: Filter events by category
  };

  const handleSearchPress = () => {
    // TODO: Navigate to explore/search screen
    console.log('Search pressed');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.citySelector}>
              <Ionicons name="location" size={16} color={Colors.primary} />
              <Text style={styles.cityText}>{selectedCity.name}</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color={Colors.text} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.greeting}>Hola, Usuario 👋</Text>
          <Text style={styles.subtitle}>¿Qué evento te gustaría vivir hoy?</Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
          <Ionicons name="search-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>Buscar eventos, artistas...</Text>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <FlatList
            horizontal
            data={mockCategories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryChip
                category={item}
                onPress={() => handleCategoryPress(item.id)}
                isSelected={selectedCategory === item.id}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Eventos Destacados</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todos →</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            data={featuredEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                onPress={() => handleEventPress(item.id)}
                onFavoritePress={() => console.log('Favorite:', item.id)}
                isFavorite={false}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsList}
          />
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximos en tu ciudad</Text>
          
          <View style={styles.upcomingEvents}>
            {upcomingEvents.slice(0, 5).map((event) => (
              <EventCardHorizontal
                key={event.id}
                event={event}
                onPress={() => handleEventPress(event.id)}
              />
            ))}
          </View>
        </View>

        {/* Recommended Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendados para ti</Text>
          
          <View style={styles.recommendedGrid}>
            {mockEvents.slice(0, 4).map((event) => (
              <View key={event.id} style={styles.gridItem}>
                <EventCardHorizontal
                  event={event}
                  onPress={() => handleEventPress(event.id)}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  cityText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginLeft: Spacing.xs,
    marginRight: Spacing.xs / 2,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  greeting: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  subtitle: {
    fontSize: Typography.sizes.body,
    color: Colors.textSecondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    marginHorizontal: Layout.screenPadding,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  searchPlaceholder: {
    fontSize: Typography.sizes.body,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: Typography.sizes.caption,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  categoriesList: {
    paddingHorizontal: Layout.screenPadding,
  },
  eventsList: {
    paddingHorizontal: Layout.screenPadding,
  },
  upcomingEvents: {
    paddingHorizontal: Layout.screenPadding,
  },
  recommendedGrid: {
    paddingHorizontal: Layout.screenPadding,
  },
  gridItem: {
    marginBottom: Spacing.sm,
  },
});
