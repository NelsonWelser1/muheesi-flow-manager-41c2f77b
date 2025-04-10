
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
 * @returns {Promise<boolean>} - Whether the bucket exists
 */
export const ensureDocumentsBucketExists = async (supabase, toast, showErrorToast) => {
  try {
    // Check if the documents bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error checking buckets:', bucketsError);
      showErrorToast(toast, `Storage error: ${bucketsError.message}`);
      return false;
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
