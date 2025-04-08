
import { supabase } from '../supabase';

/**
 * Initializes the database for the application
 * This is a simple function that can be used to check if database is ready
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // Simple check to verify database connection
    const { data, error } = await supabase
      .from('cold_room_inventory')
      .select('count', { count: 'exact', head: true });
      
    if (error) {
      console.error('Error connecting to database:', error);
      return { success: false, error };
    }
    
    console.log('Database connection successful');
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error };
  }
};
