
import { supabase } from '../supabase';

/**
 * Creates the necessary tables for contract documents
 */
export const runContractDocumentsMigration = async () => {
  try {
    console.log('Running contract documents migration...');
    
    // Check if the contract_documents table exists
    const { data, error: checkError } = await supabase
      .from('contract_documents')
      .select('id')
      .limit(1);
    
    // If the table doesn't exist or there's an error, create it
    if (checkError && checkError.code === '42P01') {
      console.log('Creating contract_documents table...');
      
      // Create the contract_documents table using raw SQL
      const { error } = await supabase.rpc('run_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS contract_documents (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            filename TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_url TEXT,
            contract_id TEXT,
            file_type TEXT,
            file_size BIGINT,
            status TEXT DEFAULT 'pending_verification',
            upload_date TIMESTAMPTZ DEFAULT NOW(),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            client TEXT,
            notes TEXT,
            keywords TEXT[],
            signed_by TEXT[],
            verified_by TEXT,
            verified_at TIMESTAMPTZ,
            metadata JSONB
          );
          
          CREATE INDEX IF NOT EXISTS idx_contract_documents_contract_id ON contract_documents(contract_id);
          CREATE INDEX IF NOT EXISTS idx_contract_documents_status ON contract_documents(status);
          CREATE INDEX IF NOT EXISTS idx_contract_documents_filename ON contract_documents(filename);
        `
      });
      
      if (error) {
        console.error('Error creating contract_documents table:', error);
        throw error;
      }
      
      console.log('Contract documents migration completed successfully');
    } else {
      console.log('contract_documents table already exists');
    }
    
    // Create storage bucket if it doesn't exist
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
      
      if (!documentsBucket) {
        await supabase.storage.createBucket('documents', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg']
        });
        console.log('Created documents storage bucket');
      }
    } catch (storageError) {
      console.error('Error checking or creating storage bucket:', storageError);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error running contract documents migration:', error);
    return { success: false, error };
  }
};

export default runContractDocumentsMigration;

