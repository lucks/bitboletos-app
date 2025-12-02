import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

// Supabase credentials from environment
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jywcgjsyjdylrcvvtfcr.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5d2NnanN5amR5bHJjdnZ0ZmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTcwMzIsImV4cCI6MjA4MDI3MzAzMn0.xJ-m9e1eKdT53R7kE2c3iGXGO5coL8T8p51eXjJJTPc';

// Custom storage implementation for Expo
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper functions for common queries

/**
 * Fetch all categories
 */
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * Fetch all cities
 */
export const getCities = async () => {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * Fetch featured events
 */
export const getFeaturedEvents = async (limit = 10) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      city:cities(*),
      category:categories(*),
      organizer:organizers(*),
      venue:venues(*)
    `)
    .eq('is_featured', true)
    .eq('is_live', true)
    .limit(limit);

  if (error) throw error;
  return data;
};

/**
 * Fetch upcoming events by city
 */
export const getUpcomingEvents = async (cityId: string, limit = 20) => {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      city:cities(*),
      category:categories(*),
      organizer:organizers(*),
      venue:venues(*)
    `)
    .eq('city_id', cityId)
    .eq('is_live', true)
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data;
};

/**
 * Fetch all events (for explore screen)
 */
export const getAllEvents = async (limit = 50) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      city:cities(*),
      category:categories(*),
      organizer:organizers(*),
      venue:venues(*)
    `)
    .eq('is_live', true)
    .order('date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data;
};

/**
 * Fetch event by ID
 */
export const getEventById = async (eventId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      city:cities(*),
      category:categories(*),
      organizer:organizers(*),
      venue:venues(*),
      ticket_types:ticket_types(*)
    `)
    .eq('id', eventId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Search events
 */
export const searchEvents = async (
  query: string,
  filters?: {
    cityId?: string;
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    endDate?: string;
  }
) => {
  let queryBuilder = supabase
    .from('events')
    .select(`
      *,
      city:cities(*),
      category:categories(*),
      organizer:organizers(*),
      venue:venues(*)
    `)
    .eq('is_live', true);

  // Text search
  if (query) {
    queryBuilder = queryBuilder.ilike('title', `%${query}%`);
  }

  // Apply filters
  if (filters?.cityId) {
    queryBuilder = queryBuilder.eq('city_id', filters.cityId);
  }

  if (filters?.categoryIds && filters.categoryIds.length > 0) {
    queryBuilder = queryBuilder.in('category_id', filters.categoryIds);
  }

  if (filters?.startDate) {
    queryBuilder = queryBuilder.gte('date', filters.startDate);
  }

  if (filters?.endDate) {
    queryBuilder = queryBuilder.lte('date', filters.endDate);
  }

  const { data, error } = await queryBuilder;

  if (error) throw error;
  return data;
};

/**
 * Get user's tickets
 */
export const getUserTickets = async (userId: string, upcoming = true) => {
  const today = new Date().toISOString().split('T')[0];

  let query = supabase
    .from('tickets')
    .select(`
      *,
      event:events(*),
      ticket_type:ticket_types(*)
    `)
    .eq('user_id', userId);

  if (upcoming) {
    query = query.gte('event.date', today);
  } else {
    query = query.lt('event.date', today);
  }

  const { data, error } = await query.order('event.date', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * Get user's favorites
 */
export const getUserFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      event:events(*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

/**
 * Toggle favorite
 */
export const toggleFavorite = async (userId: string, eventId: string) => {
  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .single();

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existing.id);

    if (error) throw error;
    return false;
  } else {
    // Add favorite
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, event_id: eventId });

    if (error) throw error;
    return true;
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
