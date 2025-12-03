import CategoryChip from '@/components/events/CategoryChip';
import EventCard from '@/components/events/EventCard';
import EventCardHorizontal from '@/components/events/EventCardHorizontal';
import { useAuth } from '@/contexts/AuthContext';
import { Colors, Layout, Spacing, Typography } from '@/lib/constants';
import {
    getAllEvents,
    getCategories,
    getCities,
    getFeaturedEvents,
    getUpcomingEvents,
    supabase
} from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('Usuario');
  
  // Data states
  const [cities, setCities] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<any[]>([]);
  
  // Selection states
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      loadUpcomingEvents(selectedCity.id);
    }
  }, [selectedCity]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [citiesData, categoriesData, featuredData, allEventsData] = await Promise.all([
        getCities(),
        getCategories(),
        getFeaturedEvents(),
        getAllEvents(4) // Get 4 events for recommendations
      ]);

      setCities(citiesData || []);
      setCategories(categoriesData || []);
      setFeaturedEvents(featuredData || []);
      setRecommendedEvents(allEventsData || []);

      // Set default city if available
      if (citiesData && citiesData.length > 0) {
        setSelectedCity(citiesData[0]);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUpcomingEvents = async (cityId: string) => {
    try {
      const data = await getUpcomingEvents(cityId);
      setUpcomingEvents(data || []);
    } catch (error) {
      console.error('Error loading upcoming events:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchProfile();
      }
    }, [user])
  );

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name')
        .eq('user_id', user?.id)
        .single();

      if (data && data.name) {
        setUserName(data.name);
      }
    } catch (error) {
      // Silent error for profile fetch
    }
  };

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

  if (loading && !selectedCity) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.citySelector}>
              <Ionicons name="location" size={16} color={Colors.primary} />
              <Text style={styles.cityText}>{selectedCity?.name || 'Seleccionar Ciudad'}</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color={Colors.text} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.greeting}>Hola, {userName} 👋</Text>
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
            data={categories}
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
            {recommendedEvents.map((event) => (
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
