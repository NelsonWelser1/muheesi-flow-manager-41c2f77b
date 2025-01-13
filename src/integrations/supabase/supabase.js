import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or API key');
  throw new Error('Missing required Supabase configuration');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});

// Test the connection with proper query format
supabase
  .from('cheese_production')
  .select('*', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error('Error connecting to Supabase:', error);
    } else {
      console.log('Successfully connected to Supabase. Table exists and is accessible.');
    }
  })
  .catch(error => {
    console.error('Error connecting to Supabase:', error);
  });