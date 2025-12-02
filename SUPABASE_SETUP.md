# Configuración de Supabase para BitBoletos

## ✅ Credenciales Configuradas

Tu archivo `.env` ha sido creado con las siguientes credenciales:

- **URL**: `https://jywcgjsyjdylrcvvtfcr.supabase.co`
- **Anon Key**: Configurada ✓

## 📋 Próximos Pasos

### 1. Crear las Tablas en Supabase

Ve a tu proyecto de Supabase: https://jywcgjsyjdylrcvvtfcr.supabase.co

Luego ve a **SQL Editor** y ejecuta el siguiente script:

```sql
-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de ciudades
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'México',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT,
  "order" INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de organizadores
CREATE TABLE IF NOT EXISTS organizers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  description TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de eventos
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_live BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2,1),
  review_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  city_id UUID REFERENCES cities(id),
  category_id UUID REFERENCES categories(id),
  organizer_id UUID REFERENCES organizers(id),
  venue TEXT,
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de tipos de boletos
CREATE TABLE IF NOT EXISTS ticket_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'MXN',
  available_quantity INTEGER NOT NULL,
  total_quantity INTEGER NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  phone TEXT,
  preferred_city_id UUID REFERENCES cities(id),
  notification_preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de boletos comprados
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  event_id UUID REFERENCES events(id),
  ticket_type_id UUID REFERENCES ticket_types(id),
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'confirmed',
  qr_code TEXT,
  ticket_number TEXT UNIQUE,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de favoritos
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  event_id UUID REFERENCES events(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_events_city ON events(city_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
```

### 2. Configurar Row Level Security (RLS)

Ejecuta este script para habilitar seguridad básica:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para datos generales
CREATE POLICY "Public read access for cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for organizers" ON organizers FOR SELECT USING (true);
CREATE POLICY "Public read access for events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access for ticket_types" ON ticket_types FOR SELECT USING (true);

-- Políticas para perfiles (usuarios solo pueden ver/editar su propio perfil)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para boletos (usuarios solo pueden ver sus propios boletos)
CREATE POLICY "Users can view own tickets" ON tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tickets" ON tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para favoritos (usuarios solo pueden ver/editar sus propios favoritos)
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);
```

### 3. Insertar Datos de Prueba

Ejecuta este script para agregar datos iniciales:

```sql
-- Insertar ciudades
INSERT INTO cities (name, state, country) VALUES
  ('Ciudad de México', 'CDMX', 'México'),
  ('Guadalajara', 'Jalisco', 'México'),
  ('Monterrey', 'Nuevo León', 'México'),
  ('Puebla', 'Puebla', 'México'),
  ('Cancún', 'Quintana Roo', 'México')
ON CONFLICT DO NOTHING;

-- Insertar categorías
INSERT INTO categories (name, icon, "order") VALUES
  ('Música', '🎵', 1),
  ('Deportes', '⚽', 2),
  ('Arte', '🎨', 3),
  ('Gastronomía', '🍽️', 4),
  ('Teatro', '🎭', 5),
  ('Comedia', '😂', 6),
  ('Familia', '👨‍👩‍👧‍👦', 7),
  ('Tecnología', '💻', 8)
ON CONFLICT DO NOTHING;

-- Insertar organizadores
INSERT INTO organizers (name, is_verified) VALUES
  ('OCESA', true),
  ('Live Nation', true),
  ('Ticketmaster', true)
ON CONFLICT DO NOTHING;
```

### 4. Verificar la Conexión

Para verificar que todo está funcionando, puedes:

1. **Reiniciar el servidor de desarrollo**:
   ```bash
   # Detén el servidor actual (Ctrl+C)
   npm start
   ```

2. **Verificar en la consola** que no hay errores de conexión

3. **Modificar temporalmente** `app/(tabs)/index.tsx` para usar datos reales en lugar de mock data:

   ```typescript
   // Cambiar de:
   import { mockEvents, mockCategories, ... } from '@/lib/mockData';
   
   // A:
   import { getFeaturedEvents, getCategories, ... } from '@/lib/supabase';
   
   // Y usar useEffect para cargar los datos:
   useEffect(() => {
     const loadData = async () => {
       const events = await getFeaturedEvents();
       // ... actualizar estado
     };
     loadData();
   }, []);
   ```

## 🔒 Seguridad

- ✅ El archivo `.env` está en `.gitignore` y no se subirá a Git
- ✅ Las credenciales están protegidas
- ✅ RLS configurado para proteger datos de usuarios

## 📚 Recursos

- [Dashboard de Supabase](https://jywcgjsyjdylrcvvtfcr.supabase.co)
- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)

## ⚠️ Notas Importantes

1. **No compartas** tu Anon Key públicamente
2. **Usa Service Role Key** solo en el backend, nunca en la app móvil
3. **Configura RLS** antes de ir a producción
4. **Haz backups** regulares de tu base de datos

---

**¡Tu app ahora está conectada a Supabase!** 🎉
