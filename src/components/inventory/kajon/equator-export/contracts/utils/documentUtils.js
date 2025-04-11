
import { showErrorToast, showWarningToast } from '@/components/ui/notifications';

/**
 * Validates a document file for upload
 * @param {File} file - The file to validate
 * @param {Object} toast - Toast notification handler
 * @param {Function} showErrorToast - Function to show error toast
 * @returns {boolean} - Whether the file is valid
 */
export const validateDocumentFile = (file, toast, showErrorToast) => {
  // Check if file exists
  if (!file) {
    if (showErrorToast && toast) {
      showErrorToast(toast, 'No file selected');
    }
    return false;
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    if (showErrorToast && toast) {
      showErrorToast(toast, 'File is too large. Maximum size is 10MB');
    }
    return false;
  }
  
  // Check file type
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    if (showErrorToast && toast) {
      showErrorToast(toast, 'Invalid file type. Allowed types: PDF, JPEG, JPG, PNG, DOC, DOCX');
    }
    return false;
  }
  
  return true;
};

/**
 * Ensures the documents bucket exists in Supabase storage
 * @param {Object} supabase - Supabase client
 * @param {Object} toast - Toast notification handler
 * @param {Function} showErrorToast - Function to show error toast
 * @param {Function} showWarningToast - Function to show warning toast
 * @returns {Promise<boolean>} - Whether the bucket exists or was created
 */
export const ensureDocumentsBucketExists = async (
  supabase, 
  toast, 
  showErrorToast, 
  showWarningToast
) => {
  try {
    // First, try to list buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.warn('Unable to list buckets:', listError);
      
      // Try alternative check - attempt to list files in the documents bucket
      const { data: files, error: filesError } = await supabase.storage
        .from('documents')
        .list('', { limit: 1 });
        
      if (filesError && !filesError.message.includes('not found')) {
        console.warn('Alternative bucket check failed:', filesError);
        
        // Try to create the bucket
        const { error: createError } = await supabase.storage.createBucket('documents', {
          public: true
        });
        
        if (createError && !createError.message.includes('already exists')) {
          console.warn('Bucket creation failed:', createError);
          
          if (showWarningToast && toast) {
            showWarningToast(toast, 'Storage setup may have issues. Will try to upload anyway.');
          }
          
          return false;
        }
      }
      
      // If we got here, either the bucket exists or was created
      return true;
    }
    
    // Check if documents bucket exists in the list
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.log('Documents bucket not found, creating it...');
      
      const { error: createError } = await supabase.storage.createBucket('documents', {
        public: true
      });
      
      if (createError && !createError.message.includes('already exists')) {
        console.warn('Bucket creation failed:', createError);
        
        if (showWarningToast && toast) {
          showWarningToast(toast, 'Failed to create storage bucket. Will try to upload anyway.');
        }
        
        return false;
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('Error ensuring documents bucket exists:', error);
    
    if (showErrorToast && toast) {
      showErrorToast(toast, `Storage error: ${error.message}`);
    }
    
    return false;
  }
};

/**
 * Uploads a file to Supabase storage with retries
 * @param {Object} supabase - Supabase client
 * @param {File} file - The file to upload
 * @param {string} filePath - The destination path in storage
 * @param {Function} progressCallback - Callback function for upload progress updates
 * @returns {Promise<Object>} - Upload result
 */
export const uploadFileWithRetry = async (
  supabase,
  file,
  filePath,
  progressCallback = null
) => {
  const maxRetries = 3;
  let attempt = 0;
  let lastError = null;
  
  while (attempt < maxRetries) {
    attempt++;
    
    try {
      console.log(`Upload attempt ${attempt}/${maxRetries} for file: ${filePath}`);
      
      if (progressCallback) {
        // Update progress based on attempt
        const baseProgress = 20 + (attempt - 1) * 10;
        progressCallback(baseProgress);
      }
      
      // Attempt the upload
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        console.warn(`Upload attempt ${attempt} failed:`, error);
        lastError = error;
        
        // If this error indicates the bucket doesn't exist, break and don't retry
        if (error.message.includes('not found') && error.message.includes('bucket')) {
          console.error('Bucket not found, abandoning retry attempts');
          break;
        }
        
        // Try an alternative path if it might be a path issue
        if (error.message.includes('not found') || error.statusCode === 404) {
          console.log('Trying alternative path...');
          
          // Simplify the path by removing subfolders
          const parts = filePath.split('/');
          const simplePath = parts[parts.length - 1];
          
          const { data: altData, error: altError } = await supabase.storage
            .from('documents')
            .upload(simplePath, file, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (!altError) {
            console.log('Upload succeeded with simplified path');
            
            if (progressCallback) {
              progressCallback(60);
            }
            
            return { 
              success: true, 
              data: altData,
              path: simplePath
            };
          }
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      
      console.log(`Upload succeeded on attempt ${attempt}`);
      
      if (progressCallback) {
        progressCallback(60);
      }
      
      return { success: true, data };
    } catch (err) {
      console.error(`Unexpected error during upload attempt ${attempt}:`, err);
      lastError = err;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  console.error(`Upload failed after ${maxRetries} attempts`);
  return { success: false, error: lastError };
};
