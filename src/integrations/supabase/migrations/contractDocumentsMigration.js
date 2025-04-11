
import { supabase } from '../supabase';
import { showWarningToast, showErrorToast, showSuccessToast } from '@/components/ui/notifications';

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
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.warn('Could not list buckets, will try alternative check:', bucketsError.message);
        
        // Try an alternative way to check if the bucket exists - attempt to list files
        const { data: files, error: filesError } = await supabase.storage
          .from('documents')
          .list('', { limit: 1 });
          
        if (filesError && !filesError.message.includes('not found')) {
          console.warn('Alternative bucket check failed:', filesError.message);
          
          // Even if we got an error that's not "bucket not found", we'll still try to create it
          const documentsBucket = false;
        } else {
          // If we got files or a 404 error about a file not found (but bucket exists), bucket exists
          console.log('Alternative check: documents bucket exists');
          const documentsBucket = true;
          return { success: true };
        }
      }
      
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
                showWarningToast(toast, 'Storage setup requires admin access. Documents can still be uploaded but may have limited functionality.');
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
          
          // Try to set a policy for public access
          try {
            // This is a simplified approach - in production you would want more restrictive policies
            const { error: policyError } = await supabase.rpc('create_public_bucket_policy', {
              bucket_name: 'documents'
            });
            
            if (policyError) {
              console.warn('Could not set bucket policy (non-critical):', policyError.message);
            }
          } catch (policyError) {
            console.warn('Policy setting error (non-critical):', policyError);
          }
          
          if (toast) {
            showSuccessToast(toast, 'Document storage initialized successfully');
          }
          
          return { success: true };
          
        } catch (storageError) {
          console.error('Error creating storage bucket:', storageError);
          
          // If it's an RLS error, we'll warn but not treat as fatal
          if (storageError.message?.includes('row-level security') || 
              storageError.status === 400 || 
              storageError.code === 'PGRST116') {
            console.warn('Contract documents migration notice: ' + storageError.message);
            if (toast) {
              showWarningToast(toast, 'Storage setup requires admin access. Alternative storage methods will be used.');
            }
            return { 
              success: false,
              bypassed: true,
              error: storageError
            };
          }
          
          if (toast) {
            showErrorToast(toast, `Storage setup error: ${storageError.message}`);
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
      
      if (toast) {
        showErrorToast(toast, 'Database tables not found. Please run the SQL migration.');
      }
      
      return { 
        success: false, 
        error: new Error('Please run the SQL migration manually in Supabase SQL Editor') 
      };
    }
    
  } catch (error) {
    console.error('Error in contract documents migration:', error);
    
    if (toast) {
      showErrorToast(toast, `Migration error: ${error.message}`);
    }
    
    return { success: false, error };
  }
};

export default runContractDocumentsMigration;
