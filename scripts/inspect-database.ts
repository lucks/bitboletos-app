/**
 * Script para inspeccionar las tablas existentes en Supabase
 * y analizar su compatibilidad con el proyecto BitBoletos
 */

import { supabase } from '../lib/supabase';

async function inspectDatabase() {
  console.log('🔍 Inspeccionando base de datos de Supabase...\n');

  try {
    // Obtener lista de tablas usando información del esquema público
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables_info');

    if (tablesError) {
      // Si no existe la función, intentar con queries directas a las tablas comunes
      console.log('📋 Intentando detectar tablas existentes...\n');

      const commonTables = [
        'events', 'categories', 'cities', 'organizers', 'venues',
        'tickets', 'ticket_types', 'users', 'profiles', 'favorites',
        'orders', 'payments', 'bookings', 'attendees'
      ];

      for (const tableName of commonTables) {
        try {
          const { data, error, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });

          if (!error) {
            console.log(`✅ Tabla encontrada: "${tableName}" (${count || 0} registros)`);

            // Obtener una muestra de datos para ver la estructura
            const { data: sample } = await supabase
              .from(tableName)
              .select('*')
              .limit(1);

            if (sample && sample.length > 0) {
              console.log(`   Columnas:`, Object.keys(sample[0]).join(', '));
            }
            console.log('');
          }
        } catch (e) {
          // Tabla no existe, continuar
        }
      }
    }

    // Intentar obtener datos de algunas tablas clave
    console.log('\n📊 Analizando contenido de tablas clave...\n');

    // Verificar eventos
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(3);

    if (!eventsError && events) {
      console.log('🎫 EVENTOS:');
      console.log(`   Total encontrados: ${events.length}`);
      if (events.length > 0) {
        console.log(`   Estructura de ejemplo:`, JSON.stringify(events[0], null, 2));
      }
      console.log('');
    }

    // Verificar categorías
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*');

    if (!catError && categories) {
      console.log('📂 CATEGORÍAS:');
      console.log(`   Total: ${categories.length}`);
      if (categories.length > 0) {
        console.log(`   Categorías:`, categories.map(c => c.name || c.title).join(', '));
      }
      console.log('');
    }

    // Verificar ciudades
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('*');

    if (!citiesError && cities) {
      console.log('🏙️ CIUDADES:');
      console.log(`   Total: ${cities.length}`);
      if (cities.length > 0) {
        console.log(`   Ciudades:`, cities.map(c => c.name).join(', '));
      }
      console.log('');
    }

    console.log('\n✅ Inspección completada!');
    console.log('\n💡 Revisa la salida para ver la estructura de tus tablas.');
    console.log('   Usaré esta información para adaptar el proyecto.');

  } catch (error: any) {
    console.error('❌ Error al inspeccionar:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   - Las credenciales en .env sean correctas');
    console.log('   - Tengas acceso a las tablas en Supabase');
  }
}

inspectDatabase();
