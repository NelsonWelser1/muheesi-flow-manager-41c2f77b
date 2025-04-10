
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
    
    // Check if the documents bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      // If we can't list buckets due to permissions, we'll try a fallback approach
      console.warn('Unable to list buckets, attempting fallback verification:', bucketsError);
      
      // Try to verify if bucket exists by attempting to fetch a non-existent file (should return 404)
      try {
        const { error: testError } = await supabase.storage
          .from('documents')
          .download('test-bucket-exists.txt');
          
        // If we get a 404, that means the bucket exists but the file doesn't
        if (testError && testError.statusCode === 404) {
          console.log('Bucket verification fallback successful - bucket exists');
          return true;
        }
        
        // Any other error means we might have permission issues
        if (testError && testError.statusCode !== 404) {
          console.warn('Bucket access issue detected with fallback verification');
          showWarningToast(toast, 'Limited storage access - uploads may not work correctly');
          return true; // Return true anyway so we can try uploading
        }
      } catch (fallbackError) {
        console.error('Fallback bucket verification failed:', fallbackError);
      }
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.log('Documents bucket not found, creating it...');
      
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
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: attempt > 1 // Only upsert on retry attempts
        });
        
      if (error) {
        console.error(`Upload attempt ${attempt} failed:`, error);
        lastError = error;
        
        // If it's not an error we should retry on, break immediately
        if (!shouldRetryUpload(error)) {
          break;
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
