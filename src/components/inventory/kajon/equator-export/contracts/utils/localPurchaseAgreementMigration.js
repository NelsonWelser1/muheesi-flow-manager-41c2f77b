
import { supabase } from '@/integrations/supabase/supabase';

/**
 * Creates the necessary tables for local purchase agreement contracts
 */
export const runLocalPurchaseAgreementMigration = async () => {
  try {
    console.log('Running local purchase agreement migration...');
    
    // Check if the purchase_agreement_contracts table exists
    const { error: checkError } = await supabase
      .from('purchase_agreement_contracts')
      .select('id')
      .limit(1);
    
    // If the table doesn't exist or there's an error, create it
    if (checkError) {
      console.log('Creating purchase_agreement_contracts table...');
      
      // Create the purchase_agreement_contracts table
      const { error: createError } = await supabase.rpc('create_purchase_agreement_table', {});
      
      if (createError) {
        console.log('Creating table with direct SQL...');
        // If the RPC function doesn't exist, try direct SQL
        const { error } = await supabase.supabase.sql(`
          CREATE TABLE IF NOT EXISTS purchase_agreement_contracts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            contract_number TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            agreement_date DATE NOT NULL,
            buyer_name TEXT NOT NULL,
            buyer_address TEXT,
            buyer_contact TEXT,
            supplier_name TEXT NOT NULL,
            supplier_address TEXT,
            supplier_contact TEXT,
            payment_terms TEXT,
            delivery_terms TEXT,
            contract_status TEXT DEFAULT 'draft',
            items JSONB,
            total_value NUMERIC(12,2),
            quality_requirements TEXT,
            special_terms TEXT,
            notes TEXT,
            created_by UUID,
            signature_buyer TEXT,
            signature_supplier TEXT
          );
          
          CREATE INDEX IF NOT EXISTS idx_purchase_agreement_contract_number ON purchase_agreement_contracts(contract_number);
          CREATE INDEX IF NOT EXISTS idx_purchase_agreement_buyer ON purchase_agreement_contracts(buyer_name);
          CREATE INDEX IF NOT EXISTS idx_purchase_agreement_supplier ON purchase_agreement_contracts(supplier_name);
        `);
        
        if (error) {
          console.error('Error creating purchase_agreement_contracts table:', error);
          throw error;
        }
      }
      
      console.log('Local purchase agreement migration completed successfully');
    } else {
      console.log('purchase_agreement_contracts table already exists');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error running local purchase agreement migration:', error);
    return { success: false, error };
  }
};
