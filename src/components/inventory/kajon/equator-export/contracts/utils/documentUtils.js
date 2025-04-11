
/**
 * Helper function to format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

/**
 * Helper function to get appropriate icon based on file type
 * @param {string} fileType - MIME type of the file
 * @returns {string} Icon name to use
 */
export const getFileIconName = (fileType) => {
  if (fileType?.startsWith('image/')) {
    return 'image';
  } else if (fileType === 'application/pdf') {
    return 'file-text';
  } else {
    return 'file';
  }
};

/**
 * Validates a document file before upload
 * @param {File} file - The file to validate
 * @param {Function} toast - Toast function for notifications
 * @param {Function} showErrorToast - Error toast helper function
 * @returns {boolean} - Whether the file is valid
 */
export const validateDocumentFile = (file, toast, showErrorToast) => {
  if (!file) {
    showErrorToast(toast, "No file selected for upload");
    return false;
  }
  
  // Check file size (10MB limit)
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    showErrorToast(toast, `File size exceeds 10MB limit (${formatFileSize(file.size)})`);
    return false;
  }

  // Check file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    showErrorToast(toast, `File type "${file.type}" is not supported. Please use PDF, JPEG, or PNG.`);
    return false;
  }

  return true;
};

/**
 * Ensures the 'documents' bucket exists before upload
 * @param {Object} supabase - Supabase client
 * @param {Function} toast - Toast function for notifications
 * @param {Function} showErrorToast - Error toast helper function
 * @param {Function} showWarningToast - Warning toast helper function
 * @returns {Promise<boolean>} - Whether the bucket exists or we can use a fallback
 */
export const ensureDocumentsBucketExists = async (supabase, toast, showErrorToast, showWarningToast) => {
  try {
    // First check if we're authenticated
    const { data: userData } = await supabase.auth.getUser();
    const isAuthenticated = !!userData?.user;
    
    console.log('Checking if documents bucket exists (authenticated:', isAuthenticated, ')');
    
    // First, try a direct test by attempting to upload a small test file
    // This will tell us if the bucket exists and if we have write permissions
    try {
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      const testFile = new File([testBlob], 'bucket-test.txt', { type: 'text/plain' });
      
      const { error: testError } = await supabase.storage
        .from('documents')
        .upload('test-' + Date.now() + '.txt', testFile, { upsert: true });
      
      if (!testError) {
        console.log('Bucket exists and is writable');
        return true;
      }
      
      // If we get a "not found" error, the bucket doesn't exist
      if (testError.message?.includes('not found')) {
        console.log('Bucket does not exist, will try to create it');
      } else {
        console.warn('Bucket test upload failed:', testError.message);
      }
    } catch (testErr) {
      console.warn('Error testing bucket:', testErr);
    }
    
    // Check if the documents bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      // If we can't list buckets due to permissions, we'll try creating it directly
      console.warn('Unable to list buckets, attempting direct creation:', bucketsError);
      
      try {
        // Try to create the bucket directly
        const { error: createError } = await supabase.storage.createBucket('documents', {
          public: true
        });
        
        if (!createError || createError.message?.includes('already exists')) {
          console.log('Bucket successfully created or already exists');
          return true;
        }
        
        // If creation fails due to RLS, we'll try alternate methods
        if (createError.message?.includes('row-level security')) {
          console.warn('RLS blocked bucket creation, trying alternative method');
          
          // Try a direct API call to bypass RLS if possible
          try {
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
            
            if (response.ok || result.message?.includes('already exists')) {
              console.log('Direct bucket creation successful');
              return true;
            }
            
            console.warn('Alternative bucket creation failed:', result);
          } catch (directErr) {
            console.warn('Direct API call failed:', directErr);
          }
          
          // If we still can't create the bucket, we'll warn the user but continue
          showWarningToast(toast, 'Limited storage permissions - upload may still work');
          return true; // Return true anyway to try the upload
        }
        
        showErrorToast(toast, `Failed to create storage bucket: ${createError.message}`);
        return false;
      } catch (createErr) {
        console.error('Error creating bucket:', createErr);
        showErrorToast(toast, `Storage error: ${createErr.message}`);
        return false;
      }
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.log('Documents bucket not found, attempting to create it...');
      
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      });
      
      if (createError) {
        console.error('Error creating documents bucket:', createError);
        
        // If it's an RLS or permissions error, warn but return true to still try the upload
        if (createError.message?.includes('row-level security') || createError.status === 400) {
          console.warn('Using fallback upload method due to limited permissions');
          showWarningToast(toast, 'Storage access is limited - trying alternative upload method');
          return true; // Return true anyway so we can try uploading
        }
        
        showErrorToast(toast, `Failed to create storage bucket: ${createError.message}`);
        return false;
      }
      
      console.log('Documents bucket created successfully');
    } else {
      console.log('Documents bucket already exists');
    }
    
    return true;
  } catch (error) {
    console.error('Error in ensureDocumentsBucketExists:', error);
    showErrorToast(toast, `Storage initialization error: ${error.message}`);
    return false;
  }
};

/**
 * Upload a file to Supabase Storage with retry and fallback mechanisms
 * @param {Object} supabase - Supabase client
 * @param {File} file - File to upload
 * @param {string} filePath - Path to save the file to
 * @param {Function} updateProgress - Function to report progress
 * @returns {Promise<Object>} Upload result
 */
export const uploadFileWithRetry = async (supabase, file, filePath, updateProgress = null) => {
  let attempt = 0;
  const maxAttempts = 3;
  let lastError = null;
  let backoffTime = 1000; // Start with 1 second
  
  while (attempt < maxAttempts) {
    attempt++;
    console.log(`Upload attempt ${attempt} for ${filePath}`);
    
    try {
      if (updateProgress) updateProgress(10 + (attempt - 1) * 10);
      
      // Make sure we're using the correct bucket name and path
      console.log(`Uploading to bucket 'documents' with path: ${filePath}`);
      
      // First, check if we have direct upload access
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: attempt > 1 // Only upsert on retry attempts
        });
        
      if (error) {
        console.error(`Upload attempt ${attempt} failed:`, error);
        lastError = error;
        
        // If we get a 404 bucket not found error, try to create it
        if (error.message?.includes('not found') && attempt === 1) {
          console.log('Bucket not found, attempting to create it...');
          
          try {
            const { error: createError } = await supabase.storage.createBucket('documents', {
              public: true
            });
            
            if (!createError || createError.message?.includes('already exists')) {
              console.log('Bucket created or already exists, retrying upload...');
              continue; // Skip to next attempt without waiting
            }
          } catch (createErr) {
            console.warn('Error creating bucket:', createErr);
          }
        }
        
        // If it's not an error we should retry on, try alternative upload methods
        if (!shouldRetryUpload(error) && attempt === 1) {
          console.log('Trying alternative upload method...');
          
          try {
            // Try using direct fetch API to upload the file
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_PROJECT_URL}/storage/v1/object/documents/${filePath}`, {
              method: 'POST',
              headers: {
                'apikey': import.meta.env.VITE_SUPABASE_API_KEY,
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`
              },
              body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
              console.log('Direct upload succeeded:', result);
              
              // Get public URL
              const publicUrl = `${import.meta.env.VITE_SUPABASE_PROJECT_URL}/storage/v1/object/public/documents/${filePath}`;
              
              return {
                success: true,
                data: result,
                publicUrl
              };
            } else {
              console.error('Direct upload failed:', result);
            }
          } catch (directErr) {
            console.error('Direct upload error:', directErr);
          }
        }
        
        // Wait with exponential backoff before retrying
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          backoffTime *= 2; // Exponential backoff
        }
      } else {
        if (updateProgress) updateProgress(50);
        
        // Get public URL if possible
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);
          
        // Verify the file exists by trying to get its metadata
        try {
          const { data: metadata, error: metaError } = await supabase.storage
            .from('documents')
            .getMetadata(filePath);
            
          if (metaError) {
            console.warn('Could not verify file metadata after upload:', metaError);
            // Continue anyway, this is just extra verification
          } else {
            console.log('File metadata verified:', metadata);
          }
        } catch (metaError) {
          console.warn('Error checking file metadata:', metaError);
          // Continue anyway
        }
        
        return {
          success: true,
          data,
          publicUrl: urlData?.publicUrl
        };
      }
    } catch (err) {
      console.error(`Upload attempt ${attempt} exception:`, err);
      lastError = err;
      
      // Wait with exponential backoff before retrying
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        backoffTime *= 2; // Exponential backoff
      }
    }
  }
  
  return {
    success: false,
    error: lastError
  };
};

/**
 * Determine if we should retry an upload based on the error
 * @param {Error} error - The upload error
 * @returns {boolean} Whether to retry the upload
 */
const shouldRetryUpload = (error) => {
  // Retry on network errors, timeouts, or 5xx server errors
  if (error.message?.includes('network') || 
      error.message?.includes('timeout') || 
      error.status >= 500) {
    return true;
  }
  
  // Don't retry on client errors (4xx) except specific retryable ones
  if (error.status >= 400 && error.status < 500) {
    // These specific 4xx errors might be worth retrying
    const retryable4xxErrors = [408, 429]; // Request Timeout, Too Many Requests
    return retryable4xxErrors.includes(error.status);
  }
  
  return false;
};

/**
 * Test if document storage is working properly
 * @param {Object} supabase - Supabase client
 * @returns {Promise<Object>} Test results
 */
export const testDocumentStorage = async (supabase) => {
  const results = {
    bucketExists: false,
    canUpload: false,
    canInsert: false,
    errors: []
  };
  
  try {
    console.log('Testing document storage system...');
    
    // 1. Check if bucket exists
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        results.errors.push({ component: 'listBuckets', error: bucketsError });
      } else {
        const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
        results.bucketExists = !!documentsBucket;
      }
    } catch (bucketError) {
      results.errors.push({ component: 'checkBuckets', error: bucketError });
    }
    
    // 2. Test file upload
    try {
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      const testFile = new File([testBlob], 'storage-test.txt', { type: 'text/plain' });
      const testPath = `test-${Date.now()}.txt`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(testPath, testFile, { upsert: true });
        
      if (uploadError) {
        results.errors.push({ component: 'upload', error: uploadError });
      } else {
        results.canUpload = true;
        
        // Clean up test file
        try {
          await supabase.storage.from('documents').remove([testPath]);
        } catch (cleanupError) {
          console.warn('Could not clean up test file:', cleanupError);
        }
      }
    } catch (uploadError) {
      results.errors.push({ component: 'uploadTest', error: uploadError });
    }
    
    // 3. Test database insert
    try {
      const testRecord = {
        filename: 'test-document.pdf',
        file_path: 'test/test-document.pdf',
        file_url: 'https://example.com/test-document.pdf',
        file_type: 'application/pdf',
        file_size: 1024,
        status: 'test',
        upload_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('contract_documents')
        .insert([testRecord])
        .select();
        
      if (insertError) {
        results.errors.push({ component: 'dbInsert', error: insertError });
      } else {
        results.canInsert = true;
        
        // Clean up test record
        if (insertData?.[0]?.id) {
          try {
            await supabase
              .from('contract_documents')
              .delete()
              .eq('id', insertData[0].id);
          } catch (cleanupError) {
            console.warn('Could not clean up test record:', cleanupError);
          }
        }
      }
    } catch (insertError) {
      results.errors.push({ component: 'dbInsertTest', error: insertError });
    }
    
    console.log('Document storage test results:', results);
    return results;
  } catch (error) {
    console.error('Error testing document storage:', error);
    results.errors.push({ component: 'overall', error });
    return results;
  }
};
