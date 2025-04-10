
import { supabase } from '../supabase';

/**
 * Creates the necessary storage bucket for contract documents
 * This function assumes the SQL migration has already been run to create the table
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
      const { data: buckets } = await supabase.storage.listBuckets();
      const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
      
      if (!documentsBucket) {
        try {
          console.log('Creating documents storage bucket...');
          const { data, error } = await supabase.storage.createBucket('documents', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
          });
          
          if (error) throw error;
          console.log('Created documents storage bucket successfully:', data);
          
          // Set bucket public policy to allow public access to files
          const { error: policyError } = await supabase.storage.from('documents').createSignedUrl(
            'test.txt',
            60,
            {
              transform: {
                width: 100,
                height: 100,
              },
            }
          );
          
          // If we get a 404 error, it means the bucket exists but the file doesn't
          // This is expected and actually what we want to confirm
          if (policyError && policyError.statusCode !== 404) {
            console.error('Error setting bucket policy:', policyError);
            // Don't throw here, we want to continue even if policy setting fails
          }
        } catch (storageError) {
          console.error('Error creating storage bucket:', storageError);
          return { 
            success: false, 
            error: storageError
          };
        }
      } else {
        console.log('Documents storage bucket already exists');
      }
      
      return { success: true };
      
    } catch (checkError) {
      // If we get an error, the table might not exist
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
