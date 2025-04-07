
import { supabase } from '../supabase';

/**
 * Runs the migration to create the local_purchase_agreements table
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export const runLocalPurchaseAgreementMigration = async () => {
  try {
    console.log('Running local purchase agreement migration...');
    
    // Check if the table already exists
    const { error: checkError } = await supabase
      .from('local_purchase_agreements')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.code === '42P01') { // Table does not exist
      console.log('Creating local_purchase_agreements table...');
      
      // SQL for creating the table - copied from the migration file
      const sql = `
        CREATE TABLE IF NOT EXISTS local_purchase_agreements (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          contract_number TEXT NOT NULL,
          agreement_date DATE NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          buyer_name TEXT NOT NULL,
          buyer_address TEXT,
          buyer_contact TEXT,
          supplier_name TEXT NOT NULL,
          supplier_address TEXT,
          supplier_contact TEXT,
          payment_terms TEXT,
          delivery_terms TEXT,
          quality_requirements TEXT,
          special_terms TEXT,
          notes TEXT,
          contract_status TEXT DEFAULT 'draft',
          total_value NUMERIC(12,2),
          items JSONB,
          created_by UUID,
          signature_buyer TEXT,
          signature_supplier TEXT
        );
        
        CREATE INDEX IF NOT EXISTS idx_lpa_contract_number ON local_purchase_agreements(contract_number);
        CREATE INDEX IF NOT EXISTS idx_lpa_supplier_name ON local_purchase_agreements(supplier_name);
        CREATE INDEX IF NOT EXISTS idx_lpa_created_at ON local_purchase_agreements(created_at);
        CREATE INDEX IF NOT EXISTS idx_lpa_contract_status ON local_purchase_agreements(contract_status);
      `;
      
      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.error('Error creating local_purchase_agreements table:', error);
        return { success: false, error };
      }
      
      console.log('Local purchase agreement table created successfully');
    } else {
      console.log('local_purchase_agreements table already exists');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error running local purchase agreement migration:', error);
    return { success: false, error };
  }
};
