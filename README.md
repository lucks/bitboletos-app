# BitBoletos - Aplicación Móvil

Aplicación móvil para descubrir, explorar y comprar boletos para eventos en diferentes ciudades de México.

## 🚀 Tecnologías

- **Expo 54** - Framework de React Native
- **TypeScript** - Tipado estático
- **Expo Router** - Navegación basada en archivos
- **Supabase** - Backend y autenticación
- **React Native Reanimated** - Animaciones
- **Expo Image** - Optimización de imágenes

## 📋 Requisitos Previos

- Node.js 20.19.2 o superior
- npm o yarn
- Expo CLI
- iOS Simulator (para desarrollo en iOS) o Android Emulator (para desarrollo en Android)
- Cuenta de Expo (opcional, para desarrollo)

## 🛠️ Instalación

1. **Clonar el repositorio** (si aplica)
   ```bash
   cd bitboletos-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   Luego edita `.env` con tus credenciales de Supabase:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

## 🎯 Ejecutar la Aplicación

### Modo Desarrollo

```bash
# Iniciar el servidor de desarrollo
npm start

# O específicamente para cada plataforma:
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Navegador web
```

### Escanear QR con Expo Go

1. Instala Expo Go en tu dispositivo móvil:
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Ejecuta `npm start`
3. Escanea el código QR con la cámara (iOS) o con la app Expo Go (Android)

## 📁 Estructura del Proyecto

```
bitboletos-app/
├── app/                      # Pantallas de la aplicación (Expo Router)
│   ├── (tabs)/              # Navegación por pestañas
│   │   ├── index.tsx        # Pantalla de Inicio
│   │   ├── explore.tsx      # Pantalla de Explorar
│   │   ├── tickets.tsx      # Pantalla de Mis Boletos
│   │   └── profile.tsx      # Pantalla de Perfil
│   └── _layout.tsx          # Layout raíz
├── components/              # Componentes reutilizables
│   ├── ui/                  # Componentes UI base
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Badge.tsx
│   ├── events/              # Componentes de eventos
│   │   ├── EventCard.tsx
│   │   ├── EventCardHorizontal.tsx
│   │   └── CategoryChip.tsx
│   └── shared/              # Componentes compartidos
├── lib/                     # Utilidades y configuración
│   ├── constants.ts         # Sistema de diseño
│   ├── types.ts             # Tipos TypeScript
│   ├── supabase.ts          # Cliente de Supabase
│   └── mockData.ts          # Datos de prueba
├── hooks/                   # Custom hooks
├── contexts/                # Contextos de React
└── assets/                  # Imágenes, fuentes, etc.
```

## 🎨 Sistema de Diseño

La aplicación utiliza un sistema de diseño consistente definido en `lib/constants.ts`:

- **Colores**: Paleta de colores primarios, secundarios y semánticos
- **Tipografía**: Tamaños y pesos de fuente
- **Espaciado**: Sistema de 8px
- **Componentes**: Estilos predefinidos para botones, cards, inputs, etc.

## 🔧 Configuración de Supabase

### Opción 1: Usar Datos Mock (Desarrollo)

La aplicación viene con datos de prueba en `lib/mockData.ts` que puedes usar para desarrollo sin necesidad de configurar Supabase.

### Opción 2: Configurar Supabase (Producción)

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Crea las siguientes tablas en tu base de datos:

```sql
-- Tabla de ciudades
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de categorías
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT,
  order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de organizadores
CREATE TABLE organizers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  description TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de eventos
CREATE TABLE events (
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
CREATE TABLE ticket_types (
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
CREATE TABLE profiles (
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
CREATE TABLE tickets (
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
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  event_id UUID REFERENCES events(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);
```

4. Configura las políticas de seguridad (RLS) según tus necesidades
5. Copia tu URL y Anon Key al archivo `.env`

## 📱 Pantallas Implementadas

### ✅ Fase 1 - MVP

- [x] **Inicio**: Eventos destacados, categorías, próximos eventos
- [x] **Explorar**: Búsqueda y filtrado de eventos
- [x] **Mis Boletos**: Visualización de boletos (con estado vacío)
- [x] **Perfil**: Información del usuario y configuración

### 🚧 Pendiente

- [ ] Autenticación (Login/Registro)
- [ ] Detalle de evento
- [ ] Proceso de compra
- [ ] Generación de códigos QR
- [ ] Integración de pagos
- [ ] Notificaciones push
- [ ] Favoritos funcionales
- [ ] Filtros avanzados

## 🎯 Próximos Pasos

1. **Configurar Supabase** con tus credenciales
2. **Implementar autenticación** (Login/Registro)
3. **Crear pantalla de detalle de evento**
4. **Implementar proceso de compra**
5. **Integrar método de pago** (Stripe/PayPal/Conekta)
6. **Agregar notificaciones push**

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
# Limpia la caché y reinstala
rm -rf node_modules
npm install
```

### Error de TypeScript
```bash
# Verifica la configuración de TypeScript
npx tsc --noEmit
```

### La app no se actualiza
```bash
# Limpia la caché de Expo
npx expo start -c
```

## 📚 Recursos

- [Documentación de Expo](https://docs.expo.dev/)
- [Documentación de React Native](https://reactnative.dev/)
- [Documentación de Supabase](https://supabase.com/docs)
- [Expo Router](https://docs.expo.dev/router/introduction/)

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

Desarrollado para BitBoletos - Diciembre 2025
