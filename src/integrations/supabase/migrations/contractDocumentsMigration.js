
import { supabase } from '../supabase';
import { showWarningToast } from '@/components/ui/notifications';

/**
 * Creates the necessary storage bucket for contract documents
 * This function assumes the SQL migration has already been run to create the table
 */
export const runContractDocumentsMigration = async (toast = null) => {
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
          
          // First, check if we're authenticated
          const { data: user } = await supabase.auth.getUser();
          if (!user?.user) {
            console.warn('User is not authenticated, bucket creation may fail');
          }
          
          // Try creating the bucket with public access
          const { data, error } = await supabase.storage.createBucket('documents', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
          });
          
          if (error) {
            if (error.message.includes('already exists')) {
              console.log('Bucket already exists but was not found in list, continuing...');
              return { success: true };
            }
            
            // Check if this is an RLS error
            if (error.message.includes('row-level security') || error.status === 400) {
              console.warn('Contract documents migration notice: ' + error.message);
              if (toast) {
                showWarningToast(toast, 'Storage setup requires admin access. Some file uploads may fail.');
              }
              return { 
                success: false,
                bypassed: true,
                error
              };
            }
            
            throw error;
          }
          
          console.log('Created documents storage bucket successfully:', data);
          
          // We'll skip the policy setting as it requires more permissions
          return { success: true };
          
        } catch (storageError) {
          console.error('Error creating storage bucket:', storageError);
          
          // If it's an RLS error, we'll warn but not treat as fatal
          if (storageError.message?.includes('row-level security') || 
              storageError.status === 400 || 
              storageError.code === 'PGRST116') {
            console.warn('Contract documents migration notice: ' + storageError.message);
            if (toast) {
              showWarningToast(toast, 'Storage setup requires admin access. Using fallback method.');
            }
            return { 
              success: false,
              bypassed: true,
              error: storageError
            };
          }
          
          return { 
            success: false, 
            error: storageError
          };
        }
      } else {
        console.log('Documents storage bucket already exists');
        return { success: true };
      }
      
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
