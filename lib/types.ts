/**
 * TypeScript Type Definitions for BitBoletos
 * Updated to match existing Supabase schema
 */

// Database Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image_url: string;
  is_featured: boolean;
  is_live: boolean;
  rating?: number;
  review_count?: number;
  favorite_count?: number;

  // Relations
  city_id: string;
  category_id?: string; // Opcional porque puede usar event_categories
  organizer_id: string;


  // Populated relations
  city?: City;
  category?: Category;
  organizer?: Organizer;
  venue?: string;
  ticket_types?: TicketType[];
  categories?: Category[]; // Para relación muchos a muchos
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string; // Nuevo: para URLs amigables
  icon: string;
  color?: string;
  order?: number;
  created_at?: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  slug: string; // Nuevo: para URLs amigables
  image_url?: string; // Nuevo: imagen de la ciudad
  state?: string;
  created_at?: string;
}

export interface Organizer {
  id: string;
  name: string;
  logo_url?: string;
  is_verified: boolean;
  description?: string;
  website?: string;
  created_at?: string;
}

export interface Venue {
  id: string;
  name: string;
  address?: string;
  city_id?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  image_url?: string;
  created_at?: string;

  // Populated relations
  city?: City;
}

export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  available_quantity: number;
  total_quantity: number;
  is_available: boolean;
  created_at?: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  event_id: string;
  ticket_type_id: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'used';
  qr_code?: string;
  ticket_number?: string;
  purchase_date?: string;
  created_at?: string;

  // Populated relations
  event?: Event;
  ticket_type?: TicketType;
}

export interface Order {
  id: string;
  user_id: string;
  event_id: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  created_at?: string;
  updated_at?: string;

  // Populated relations
  event?: Event;
  tickets?: Ticket[];
  payment?: Payment;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  created_at?: string;

  // Populated relations
  order?: Order;
}

export interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  ticket_type_id: string;
  quantity: number;
  status: 'reserved' | 'confirmed' | 'cancelled' | 'expired';
  expires_at?: string;
  created_at?: string;

  // Populated relations
  event?: Event;
  ticket_type?: TicketType;
}

export interface Attendee {
  id: string;
  ticket_id: string;
  name: string;
  email?: string;
  phone?: string;
  checked_in: boolean;
  checked_in_at?: string;
  created_at?: string;

  // Populated relations
  ticket?: Ticket;
}

export interface Favorite {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;

  // Populated relations
  event?: Event;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string; // Cambiado de full_name
  avatar_url?: string;
  city?: string; // Cambiado de preferred_city_id (es texto, no UUID)
  email?: string;
  phone?: string;
  notification_preferences?: NotificationPreferences;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  event_reminders: boolean;
  new_events: boolean;
  purchase_confirmations: boolean;
  event_updates: boolean;
}

export interface EventCategory {
  id: string;
  event_id: string;
  category_id: string;
  created_at?: string;

  // Populated relations
  event?: Event;
  category?: Category;
}

// UI Types
export interface CartItem {
  event: Event;
  ticketType: TicketType;
  quantity: number;
}

export interface SearchFilters {
  cityId?: string;
  categoryIds?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start?: string;
    end?: string;
  };
  isFree?: boolean;
  venueId?: string;
}

export type SortOption = 'date' | 'price_asc' | 'price_desc' | 'popularity';

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  profile?: UserProfile;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
