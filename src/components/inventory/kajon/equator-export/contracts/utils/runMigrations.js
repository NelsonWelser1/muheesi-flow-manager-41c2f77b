
import { runExportContractsMigration } from '@/integrations/supabase/migrations/export_contracts_migration';

/**
 * Function to run all migrations required for the contracts module
 * This can be called during app initialization
 */
export const runContractsMigrations = async () => {
  try {
    console.log('Running contract migrations...');
    
    // Run export contracts migration
    const exportContractsResult = await runExportContractsMigration();
    
    if (!exportContractsResult.success) {
      console.error('Export contracts migration failed:', exportContractsResult.error);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to run contract migrations:', error);
    return { success: false, error };
  }
};
