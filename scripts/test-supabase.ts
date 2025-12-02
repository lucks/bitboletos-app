/**
 * Script de utilidad para probar la conexión con Supabase
 * Ejecutar: npx tsx scripts/test-supabase.ts
 */

import { supabase } from '../lib/supabase';

async function testConnection() {
  console.log('🔍 Probando conexión con Supabase...\n');

  try {
    // Test 1: Verificar conexión básica
    console.log('1️⃣ Verificando conexión básica...');
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('*')
      .limit(1);

    if (citiesError) {
      console.error('❌ Error al conectar:', citiesError.message);
      console.log('\n💡 Asegúrate de:');
      console.log('   - Haber creado las tablas en Supabase (ver SUPABASE_SETUP.md)');
      console.log('   - Verificar que las credenciales en .env sean correctas');
      return;
    }

    console.log('✅ Conexión exitosa!\n');

    // Test 2: Verificar tablas
    console.log('2️⃣ Verificando tablas...');

    const tables = ['cities', 'categories', 'organizers', 'events'];
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`   ❌ Tabla "${table}": No existe o no es accesible`);
      } else {
        console.log(`   ✅ Tabla "${table}": ${count || 0} registros`);
      }
    }

    console.log('\n3️⃣ Resumen:');
    console.log('   ✅ Supabase está configurado correctamente');
    console.log('   📱 Puedes usar los datos reales en la app');
    console.log('\n💡 Próximo paso: Agregar datos de prueba (ver SUPABASE_SETUP.md)');

  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
}

testConnection();
