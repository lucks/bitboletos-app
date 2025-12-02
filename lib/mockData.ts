/**
 * Mock data for development and testing
 * Updated to match real Supabase data structure
 */

import { Category, City, Event, Organizer, TicketType } from './types';

// Real categories from Supabase
export const mockCategories: Category[] = [
  { id: '1', name: 'Música', slug: 'musica', icon: '🎵', order: 1 },
  { id: '2', name: 'Teatro', slug: 'teatro', icon: '🎭', order: 2 },
  { id: '3', name: 'Arte', slug: 'arte', icon: '🎨', order: 3 },
  { id: '4', name: 'Deportes', slug: 'deportes', icon: '⚽', order: 4 },
  { id: '5', name: 'Gastronomía', slug: 'gastronomia', icon: '🍽️', order: 5 },
  { id: '6', name: 'Tecnología', slug: 'tecnologia', icon: '💻', order: 6 },
  { id: '7', name: 'Negocios', slug: 'negocios', icon: '💼', order: 7 },
  { id: '8', name: 'Bienestar', slug: 'bienestar', icon: '🧘', order: 8 },
  { id: '9', name: 'Vida Nocturna', slug: 'vida-nocturna', icon: '🌙', order: 9 },
  { id: '10', name: 'Familiar', slug: 'familiar', icon: '👨‍👩‍👧‍👦', order: 10 },
];

// Real cities from Supabase
export const mockCities: City[] = [
  { id: '1', name: 'Ciudad de México', slug: 'cdmx', country: 'México' },
  { id: '2', name: 'Buenos Aires', slug: 'buenos-aires', country: 'Argentina' },
  { id: '3', name: 'Bogotá', slug: 'bogota', country: 'Colombia' },
  { id: '4', name: 'Lima', slug: 'lima', country: 'Perú' },
  { id: '5', name: 'Santiago', slug: 'santiago', country: 'Chile' },
  { id: '6', name: 'Madrid', slug: 'madrid', country: 'España' },
];

export const mockOrganizers: Organizer[] = [
  {
    id: '1',
    name: 'OCESA',
    is_verified: true,
    logo_url: 'https://via.placeholder.com/100',
  },
  {
    id: '2',
    name: 'Live Nation',
    is_verified: true,
    logo_url: 'https://via.placeholder.com/100',
  },
  {
    id: '3',
    name: 'Ticketmaster',
    is_verified: true,
    logo_url: 'https://via.placeholder.com/100',
  },
];

export const mockTicketTypes: TicketType[] = [
  {
    id: '1',
    event_id: '1',
    name: 'General',
    price: 850,
    currency: 'MXN',
    available_quantity: 234,
    total_quantity: 500,
    is_available: true,
  },
  {
    id: '2',
    event_id: '1',
    name: 'VIP',
    price: 1500,
    currency: 'MXN',
    available_quantity: 45,
    total_quantity: 100,
    is_available: true,
  },
  {
    id: '3',
    event_id: '1',
    name: 'Platinum',
    price: 2500,
    currency: 'MXN',
    available_quantity: 0,
    total_quantity: 50,
    is_available: false,
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Festival Corona Capital 2025',
    description: 'El festival de música más grande de México regresa con un lineup increíble que incluye a los mejores artistas internacionales y nacionales. Tres días de música, arte y cultura en el corazón de la Ciudad de México.',
    date: '2025-12-15',
    time: '20:00',
    image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    is_featured: true,
    is_live: true,
    rating: 4.8,
    review_count: 2300,
    favorite_count: 2300,
    city_id: '1',
    category_id: '1',
    organizer_id: '1',
    city: mockCities[0],
    category: mockCategories[0],
    organizer: mockOrganizers[0],
    ticket_types: mockTicketTypes,
  },
  {
    id: '2',
    title: 'Concierto Indie Rock',
    description: 'Una noche única con las mejores bandas indie del momento. Disfruta de música en vivo en uno de los mejores recintos de la ciudad.',
    date: '2025-12-20',
    time: '19:00',
    image_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    is_featured: false,
    is_live: true,
    rating: 4.5,
    review_count: 450,
    favorite_count: 890,
    city_id: '1',
    category_id: '1',
    organizer_id: '2',
    city: mockCities[0],
    category: mockCategories[0],
    organizer: mockOrganizers[1],
  },
  {
    id: '3',
    title: 'Stand Up Comedy Night',
    description: 'Los mejores comediantes de México en una noche llena de risas. No te pierdas este show especial con invitados sorpresa.',
    date: '2025-12-22',
    time: '21:00',
    image_url: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
    is_featured: false,
    is_live: true,
    rating: 4.7,
    review_count: 320,
    favorite_count: 560,
    city_id: '1',
    category_id: '2',
    organizer_id: '3',
    city: mockCities[0],
    category: mockCategories[1],
    organizer: mockOrganizers[2],
  },
  {
    id: '4',
    title: 'Partido América vs Chivas',
    description: 'El clásico del fútbol mexicano. No te pierdas este emocionante encuentro entre los dos equipos más grandes del país.',
    date: '2025-12-18',
    time: '19:00',
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    is_featured: true,
    is_live: true,
    rating: 4.9,
    review_count: 1800,
    favorite_count: 3200,
    city_id: '1',
    category_id: '4',
    organizer_id: '1',
    city: mockCities[0],
    category: mockCategories[3],
    organizer: mockOrganizers[0],
  },
  {
    id: '5',
    title: 'Exposición de Arte Contemporáneo',
    description: 'Descubre las obras de los artistas contemporáneos más destacados en esta exposición única. Entrada gratuita.',
    date: '2025-12-10',
    time: '10:00',
    image_url: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800',
    is_featured: false,
    is_live: true,
    rating: 4.6,
    review_count: 180,
    favorite_count: 420,
    city_id: '1',
    category_id: '3',
    organizer_id: '2',
    city: mockCities[0],
    category: mockCategories[2],
    organizer: mockOrganizers[1],
  },
  {
    id: '6',
    title: 'Festival Gastronómico',
    description: 'Prueba los mejores platillos de los chefs más reconocidos de México. Un evento imperdible para los amantes de la gastronomía.',
    date: '2025-12-25',
    time: '12:00',
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    is_featured: true,
    is_live: true,
    rating: 4.8,
    review_count: 950,
    favorite_count: 1500,
    city_id: '1',
    category_id: '5',
    organizer_id: '3',
    city: mockCities[0],
    category: mockCategories[4],
    organizer: mockOrganizers[2],
  },
];

// Helper function to get featured events
export const getFeaturedMockEvents = () => {
  return mockEvents.filter(event => event.is_featured);
};

// Helper function to get upcoming events
export const getUpcomingMockEvents = (cityId?: string) => {
  let events = mockEvents;
  if (cityId) {
    events = events.filter(event => event.city_id === cityId);
  }
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Helper function to search events
export const searchMockEvents = (query: string) => {
  return mockEvents.filter(event =>
    event.title.toLowerCase().includes(query.toLowerCase()) ||
    event.description.toLowerCase().includes(query.toLowerCase())
  );
};
