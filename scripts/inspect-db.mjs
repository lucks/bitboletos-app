/**
 * Script simple para inspeccionar tablas de Supabase
 * Ejecutar: node scripts/inspect-db.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jywcgjsyjdylrcvvtfcr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5d2NnanN5amR5bHJjdnZ0ZmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTcwMzIsImV4cCI6MjA4MDI3MzAzMn0.xJ-m9e1eKdT53R7kE2c3iGXGO5coL8T8p51eXjJJTPc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspectDatabase() {
  console.log('🔍 Inspeccionando base de datos de Supabase...\n');

  const commonTables = [
    'events', 'categories', 'cities', 'organizers', 'venues',
    'tickets', 'ticket_types', 'users', 'profiles', 'favorites',
    'orders', 'payments', 'bookings', 'attendees', 'event_categories'
  ];

  const foundTables = [];

  console.log('📋 Buscando tablas existentes...\n');

  for (const tableName of commonTables) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        foundTables.push(tableName);
        console.log(`✅ Tabla: "${tableName}" (${count || 0} registros)`);
        
        // Obtener muestra para ver estructura
        const { data: sample } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (sample && sample.length > 0) {
          const columns = Object.keys(sample[0]);
          console.log(`   📊 Columnas (${columns.length}):`, columns.join(', '));
        }
        console.log('');
      }
    } catch (e) {
      // Tabla no existe
    }
  }

  if (foundTables.length === 0) {
    console.log('❌ No se encontraron tablas accesibles.');
    console.log('   Verifica que las credenciales sean correctas.');
    return;
  }

  console.log(`\n✅ Se encontraron ${foundTables.length} tablas: ${foundTables.join(', ')}\n`);

  // Analizar contenido de tablas clave
  console.log('📊 Analizando contenido...\n');

  // Eventos
  if (foundTables.includes('events')) {
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .limit(1);

    if (events && events.length > 0) {
      console.log('🎫 EVENTOS - Estructura de ejemplo:');
      console.log(JSON.stringify(events[0], null, 2));
      console.log('');
    }
  }

  // Categorías
  if (foundTables.includes('categories')) {
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .limit(10);

    if (categories && categories.length > 0) {
      console.log('📂 CATEGORÍAS:');
      categories.forEach(cat => {
        console.log(`   - ${cat.name || cat.title || cat.id}`);
      });
      console.log('');
    }
  }

  // Ciudades
  if (foundTables.includes('cities')) {
    const { data: cities } = await supabase
      .from('cities')
      .select('*')
      .limit(10);

    if (cities && cities.length > 0) {
      console.log('🏙️ CIUDADES:');
      cities.forEach(city => {
        console.log(`   - ${city.name}`);
      });
      console.log('');
    }
  }

  console.log('\n✅ Inspección completada!');
  console.log('\n📝 Guardando análisis en database-analysis.json...');

  // Guardar análisis
  const analysis = {
    timestamp: new Date().toISOString(),
    tables: foundTables,
    summary: `Se encontraron ${foundTables.length} tablas en Supabase`
  };

  const fs = await import('fs');
  fs.writeFileSync(
    'database-analysis.json',
    JSON.stringify(analysis, null, 2)
  );

  console.log('✅ Análisis guardado!');
}

inspectDatabase().catch(console.error);
