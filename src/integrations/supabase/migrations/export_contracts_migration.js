
import { supabase } from '../supabase';

/**
 * Creates or updates the export_contracts table in Supabase
 * This migration ensures the table has the correct structure
 */
export const setupExportContractsTable = async () => {
  try {
    console.log('Setting up export_contracts table...');
    
    // Check if the table exists
    const { data: existingTables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .eq('tablename', 'export_contracts');
    
    if (tablesError) {
      console.error('Error checking for export_contracts table:', tablesError);
      throw tablesError;
    }
    
    // If table doesn't exist, create it
    if (!existingTables || existingTables.length === 0) {
      console.log('Creating export_contracts table...');
      
      // SQL for creating the table with proper structure
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS export_contracts (
          id UUID PRIMARY KEY,
          contract_name TEXT NOT NULL,
          contract_type TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          contract_number TEXT,
          contract_date TEXT,
          seller_details JSONB DEFAULT '{}'::jsonb,
          buyer_details JSONB DEFAULT '{}'::jsonb,
          products JSONB DEFAULT '[]'::jsonb,
          payment_terms JSONB DEFAULT '[]'::jsonb,
          shipping_terms JSONB DEFAULT '{}'::jsonb,
          signatures JSONB DEFAULT '{}'::jsonb,
          contract_data JSONB DEFAULT '{}'::jsonb,
          status TEXT DEFAULT 'active'
        );
        
        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_export_contracts_type ON export_contracts (contract_type);
        CREATE INDEX IF NOT EXISTS idx_export_contracts_status ON export_contracts (status);
        CREATE INDEX IF NOT EXISTS idx_export_contracts_created_at ON export_contracts (created_at);
        
        -- Add updated_at trigger for automatic timestamp updates
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = now();
          RETURN NEW;
        END;
        $$ language 'plpgsql';
        
        DROP TRIGGER IF EXISTS update_export_contracts_updated_at ON export_contracts;
        
        CREATE TRIGGER update_export_contracts_updated_at
        BEFORE UPDATE ON export_contracts
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
      `;
      
      // Execute the SQL
      const { error: createError } = await supabase.rpc('pgclient', {
        query: createTableSQL
      });
      
      if (createError) {
        console.error('Error creating export_contracts table:', createError);
        throw createError;
      }
      
      console.log('Successfully created export_contracts table');
    } else {
      console.log('export_contracts table already exists');
      
      // Check if we need to add any missing columns or update existing ones
      // This is a good place to handle schema migrations in the future
    }
    
    return { success: true };
  } catch (error) {
    console.error('Migration failed for export_contracts:', error);
    return { success: false, error };
  }
};

/**
 * Helper function to run the migration
 * This can be called on app initialization
 */
export const runExportContractsMigration = async () => {
  try {
    const result = await setupExportContractsTable();
    return result;
  } catch (error) {
    console.error('Failed to run export_contracts migration:', error);
    return { success: false, error };
  }
};
