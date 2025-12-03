const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jywcgjsyjdylrcvvtfcr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5d2NnanN5amR5bHJjdnZ0ZmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTcwMzIsImV4cCI6MjA4MDI3MzAzMn0.xJ-m9e1eKdT53R7kE2c3iGXGO5coL8T8p51eXjJJTPc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSchema() {
  console.log('Checking profiles table...');
  
  // Try to select one row to see the structure
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Columns found in profiles table:', Object.keys(data[0]));
  } else {
    console.log('Profiles table is empty, cannot infer columns from data.');
    // Try to insert a dummy row to see if it fails on specific columns? No, that's risky.
    // We can try to select specific columns to see if they error.
    
    const columnsToCheck = ['full_name', 'name', 'first_name', 'phone', 'avatar_url'];
    
    for (const col of columnsToCheck) {
      const { error: colError } = await supabase
        .from('profiles')
        .select(col)
        .limit(1);
        
      if (colError) {
        console.log(`Column '${col}' check failed:`, colError.message);
      } else {
        console.log(`Column '${col}' appears to exist.`);
      }
    }
  }
}

checkSchema();
