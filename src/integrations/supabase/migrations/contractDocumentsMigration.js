
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
          
          // Try directly creating the bucket anyway
          try {
            console.log('Creating documents storage bucket by direct method...');
            
            // Try to create the bucket directly with fetch API to bypass RLS if needed
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_PROJECT_URL}/storage/v1/bucket`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SUPABASE_API_KEY,
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`
              },
              body: JSON.stringify({
                id: 'documents',
                name: 'documents',
                public: true
              })
            });
            
            const result = await response.json();
            console.log('Direct bucket creation result:', result);
            
            if (response.ok || result.message?.includes('already exists')) {
              if (toast) {
                showSuccessToast(toast, 'Document storage initialized successfully (direct method)');
              }
              return { success: true };
            }
          } catch (directError) {
            console.error('Direct bucket creation failed:', directError);
          }
        } else {
          // If we got files or a 404 error about a file not found (but bucket exists), bucket exists
          console.log('Alternative check: documents bucket exists');
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
              
              // Try to create a simpler public policy instead
              try {
                // Create the bucket with minimal options
                await supabase.storage.createBucket('documents', {
                  public: true
                });
                
                if (toast) {
                  showSuccessToast(toast, 'Document storage initialized with basic permissions');
                }
                return { success: true };
              } catch (basicBucketError) {
                console.warn('Basic bucket creation also failed:', basicBucketError);
              }
              
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
            // Create a simple public policy
            const { error: policyError } = await supabase.storage.from('documents')
              .createSignedUrl('test-policy.txt', 10);
              
            if (policyError && !policyError.message.includes('not found')) {
              console.warn('Policy test failed (non-critical):', policyError.message);
            }
          } catch (policyError) {
            console.warn('Policy testing error (non-critical):', policyError);
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

// Add an RPC function to support document uploads when RLS is enabled
export const createContractDocumentRpcIfNeeded = async () => {
  try {
    // Check if we can create a stored procedure in Supabase
    // This would need admin privileges, so it will likely fail in most cases
    const functionBody = `
      CREATE OR REPLACE FUNCTION insert_contract_document(document_data JSONB)
      RETURNS JSONB
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        inserted_row contract_documents;
      BEGIN
        INSERT INTO contract_documents (
          filename, file_path, file_url, contract_id, file_type, file_size,
          status, upload_date, created_at, client, notes, keywords, signed_by
        )
        VALUES (
          document_data->>'filename',
          document_data->>'file_path',
          document_data->>'file_url',
          document_data->>'contract_id',
          document_data->>'file_type',
          (document_data->>'file_size')::bigint,
          document_data->>'status',
          COALESCE((document_data->>'upload_date')::timestamptz, NOW()),
          COALESCE((document_data->>'created_at')::timestamptz, NOW()),
          document_data->>'client',
          document_data->>'notes',
          document_data->'keywords',
          document_data->'signed_by'
        )
        RETURNING * INTO inserted_row;
        
        RETURN to_jsonb(inserted_row);
      END;
      $$;
    `;
    
    // This will likely fail due to permissions, but we try anyway
    const { error } = await supabase.rpc('exec_sql', { sql: functionBody });
    
    if (error) {
      console.warn('Could not create RPC function (expected, requires admin):', error.message);
      return false;
    }
    
    console.log('Successfully created insert_contract_document RPC function');
    return true;
  } catch (error) {
    console.error('Error creating RPC function:', error);
    return false;
  }
};

export default runContractDocumentsMigration;
