
import { supabase } from '../supabase';
import { runLocalPurchaseAgreementMigration } from '../migrations/runLocalPurchaseAgreementMigration';

/**
 * Initialize database tables and run migrations if needed
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export const initializeDatabase = async () => {
  try {
    // Run the local purchase agreement migration
    const result = await runLocalPurchaseAgreementMigration();
    return result;
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error };
  }
};
