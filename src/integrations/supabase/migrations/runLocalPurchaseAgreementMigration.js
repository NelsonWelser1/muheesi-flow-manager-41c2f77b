
import { supabase } from '../supabase';

/**
 * Runs the migration to create the local_purchase_agreements table
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export const runLocalPurchaseAgreementMigration = async () => {
  try {
    console.log('Running local purchase agreement migration...');
    
    // Check if the exec_sql function is available
    const { error: rpcError } = await supabase.rpc('exec_sql', { sql: 'SELECT 1' }).catch(() => ({ error: true }));
    
    if (rpcError) {
      console.log('Creating tables directly with multiple queries...');
      
      // Check if uuid-ossp extension is available and enable it if needed
      await supabase.from('_test_migration').select('*').limit(1).catch(async () => {
        try {
          // Try to create a temporary table to check if we can run DDL commands
          await supabase.rpc('create_test_table').catch(() => {
            console.log('Cannot run DDL commands through RPC, will use a different approach');
          });
        } catch (err) {
          console.error('Error checking migrations capability:', err);
        }
      });
      
      // Try to check if table exists
      const { error: checkError } = await supabase
        .from('local_purchase_agreements')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') {
        console.log('local_purchase_agreements table does not exist, attempting to create it');
        
        // Since we can't run the full SQL directly, handle it through app logic
        // First try to create the table with basic structure
        try {
          await supabase
            .from('local_purchase_agreements')
            .insert([{ 
              contract_number: 'MIGRATION-TEST', 
              agreement_date: new Date().toISOString(), 
              buyer_name: 'Test', 
              supplier_name: 'Test'
            }]);
        } catch (err) {
          console.log('Table does not exist, will need to be created through Supabase dashboard or Functions');
          console.error('Migration error:', err);
          
          return { 
            success: false, 
            error: new Error('Database tables need to be created through Supabase dashboard. Please check documentation.') 
          };
        }
      } else {
        console.log('local_purchase_agreements table already exists');
      }
    } else {
      // We can use the exec_sql RPC function
      const migrationSQL = `
        CREATE TABLE IF NOT EXISTS local_purchase_agreements (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          contract_number TEXT NOT NULL,
          agreement_date DATE NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          
          -- Buyer information
          buyer_name TEXT NOT NULL,
          buyer_address TEXT,
          buyer_contact TEXT,
          
          -- Supplier information
          supplier_name TEXT NOT NULL,
          supplier_address TEXT,
          supplier_contact TEXT,
          
          -- Terms
          payment_terms TEXT,
          delivery_terms TEXT,
          quality_requirements TEXT,
          special_terms TEXT,
          notes TEXT,
          
          -- Status and metadata
          contract_status TEXT DEFAULT 'draft',
          total_value NUMERIC(12,2),
          
          -- Items as JSONB array
          items JSONB,
          
          created_by UUID,
          
          -- Signatures (stored as image URLs or base64 strings)
          signature_buyer TEXT,
          signature_supplier TEXT
        );

        -- Create indexes for better query performance
        CREATE INDEX IF NOT EXISTS idx_lpa_contract_number ON local_purchase_agreements(contract_number);
        CREATE INDEX IF NOT EXISTS idx_lpa_supplier_name ON local_purchase_agreements(supplier_name);
        CREATE INDEX IF NOT EXISTS idx_lpa_created_at ON local_purchase_agreements(created_at);
        CREATE INDEX IF NOT EXISTS idx_lpa_contract_status ON local_purchase_agreements(contract_status);
      `;
      
      const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
      
      if (error) {
        console.error('Error creating local_purchase_agreements table:', error);
        return { success: false, error };
      }
      
      console.log('Local purchase agreement table migration completed successfully');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error running local purchase agreement migration:', error);
    return { success: false, error };
  }
};
