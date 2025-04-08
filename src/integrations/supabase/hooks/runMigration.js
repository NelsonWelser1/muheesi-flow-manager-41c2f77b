
import { supabase } from '../supabase';

export const runLocalPurchaseAgreementMigration = async () => {
  console.log('Running local purchase agreement migration...');
  
  try {
    // SQL statements to create local_purchase_agreements table
    const sqlStatements = `
      -- Check if uuid-ossp extension exists
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Migration for Local Purchase Agreement table
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
        
        -- Authentication temporarily disabled
        -- created_by UUID REFERENCES auth.users(id),
        created_by UUID, -- will be linked to auth.users when authentication is enabled
        
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
    
    // Execute the SQL migration
    const { error } = await supabase.rpc('exec_sql', { sql: sqlStatements });
    
    if (error) throw error;
    
    console.log('Local purchase agreement migration completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Error running local purchase agreement migration:', error);
    return { success: false, error };
  }
};

// Function to initialize the database with migrations
export const initializeDatabase = async () => {
  try {
    // Run the local purchase agreement migration
    const result = await runLocalPurchaseAgreementMigration();
    if (!result.success) {
      console.error('Failed to initialize local_purchase_agreements table:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error };
  }
};
