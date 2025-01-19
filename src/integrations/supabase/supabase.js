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

// Test the connection with proper error handling
const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    // Simple health check by trying to get system time
    const { data, error } = await supabase
      .from('cheese_production')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error connecting to Supabase:', error);
      return false;
    }

    console.log('Successfully connected to Supabase');
    return true;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    console.error('Please check your Supabase configuration and network connection');
    return false;
  }
};

// Run the connection test immediately
testConnection();

export { testConnection };