
import { supabase } from '@/integrations/supabase/supabase';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a document to Supabase storage
 * @param {File} file - The file to upload
 * @param {string} contractId - Associated contract ID (optional)
 * @returns {Promise<Object>} Upload result
 */
export const uploadContractDocument = async (file, contractId = null) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }
    
    // Check file type
    if (!(file.type === 'application/pdf' || 
          file.type === 'image/jpeg' || 
          file.type === 'image/jpg')) {
      throw new Error('Invalid file type. Only PDF, JPEG, and JPG are supported.');
    }
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${contractId ? contractId + '_' : ''}${Date.now()}.${fileExt}`;
    const filePath = `contract-documents/${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) throw error;
    
    // Get public URL for the file
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
      
    // Create metadata record in the database
    const { data: documentRecord, error: recordError } = await supabase
      .from('contract_documents')
      .insert({
        id: uuidv4(),
        filename: file.name,
        file_path: filePath,
        contract_id: contractId,
        file_type: file.type,
        file_size: file.size,
        file_url: urlData?.publicUrl || '',
        status: 'pending_verification',
        upload_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (recordError) throw recordError;
    
    return {
      success: true,
      data: documentRecord,
      message: 'Document uploaded successfully'
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    return {
      success: false,
      error,
      message: error.message || 'Failed to upload document'
    };
  }
};

/**
 * Retrieves a list of contract documents
 * @param {Object} filters - Optional filtering parameters
 * @returns {Promise<Array>} List of documents
 */
export const getContractDocuments = async (filters = {}) => {
  try {
    let query = supabase
      .from('contract_documents')
      .select('*')
      .order('upload_date', { ascending: false });
    
    // Apply filters if provided
    if (filters.contractId) {
      query = query.eq('contract_id', filters.contractId);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.search) {
      query = query.or(
        `filename.ilike.%${filters.search}%,contract_id.ilike.%${filters.search}%`
      );
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return {
      success: true,
      data: data || [],
      message: `${data?.length || 0} documents retrieved successfully`
    };
  } catch (error) {
    console.error('Error retrieving documents:', error);
    return {
      success: false,
      error,
      data: [],
      message: error.message || 'Failed to retrieve documents'
    };
  }
};

/**
 * Search contract documents by content or metadata
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results
 */
export const searchContractDocuments = async (query) => {
  try {
    if (!query || query.trim() === '') {
      throw new Error('Search query is required');
    }
    
    // In a real implementation, this would use full-text search capabilities
    // For now, we'll just search basic metadata
    const { data, error } = await supabase
      .from('contract_documents')
      .select('*')
      .or(`
        filename.ilike.%${query}%,
        contract_id.ilike.%${query}%,
        notes.ilike.%${query}%,
        keywords.cs.{"${query}"}
      `)
      .order('upload_date', { ascending: false });
    
    if (error) throw error;
    
    return {
      success: true,
      data: data || [],
      message: `${data?.length || 0} documents found matching "${query}"`
    };
  } catch (error) {
    console.error('Error searching documents:', error);
    return {
      success: false,
      error,
      data: [],
      message: error.message || 'Failed to search documents'
    };
  }
};

/**
 * Update document metadata or status
 * @param {string} documentId - Document ID to update
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated document
 */
export const updateDocumentMetadata = async (documentId, updates) => {
  try {
    if (!documentId) {
      throw new Error('Document ID is required');
    }
    
    // Don't allow updating certain fields
    const safeUpdates = { ...updates };
    delete safeUpdates.id;
    delete safeUpdates.file_path;
    delete safeUpdates.created_at;
    
    // Add updated_at timestamp
    safeUpdates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('contract_documents')
      .update(safeUpdates)
      .eq('id', documentId)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data,
      message: 'Document updated successfully'
    };
  } catch (error) {
    console.error('Error updating document:', error);
    return {
      success: false,
      error,
      message: error.message || 'Failed to update document'
    };
  }
};

/**
 * Helper function to format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
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
