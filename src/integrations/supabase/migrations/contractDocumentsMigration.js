
import { supabase } from '../supabase';

/**
 * Creates the necessary tables for contract documents
 * This function attempts to check if the table exists first
 */
export const runContractDocumentsMigration = async () => {
  try {
    console.log('Running contract documents migration...');
    
    // Check if the contract_documents table exists by attempting to query it
    try {
      const { data, error } = await supabase
        .from('contract_documents')
        .select('id')
        .limit(1);
      
      // If this succeeds, the table exists
      console.log('contract_documents table already exists');
      
      // Check if the documents storage bucket exists
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
      
    } catch (checkError) {
      // If we get an error, the table might not exist
      // But we can't reliably create it from JavaScript so we'll show instructions
      console.log('The contract_documents table needs to be created manually.');
      console.log('Please run the SQL in src/integrations/supabase/migrations/contract_documents.sql');
      
      return { 
        success: false, 
        error: new Error('Please run the SQL migration manually in Supabase SQL Editor') 
      };
    }
    
  } catch (error) {
    console.error('Error in contract documents migration:', error);
    return { success: false, error };
  }
};

export default runContractDocumentsMigration;
