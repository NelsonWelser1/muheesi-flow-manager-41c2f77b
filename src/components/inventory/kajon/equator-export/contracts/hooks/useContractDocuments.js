
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { 
  showSuccessToast, 
  showErrorToast, 
  showWarningToast 
} from '@/components/ui/notifications';
import { 
  validateDocumentFile, 
  ensureDocumentsBucketExists 
} from '../utils/documentUtils';

/**
 * Custom hook for managing contract documents
 * @returns {Object} Document management functions and state
 */
const useContractDocuments = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  /**
   * Load documents from the database
   */
  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading contract documents from Supabase...');
      
      const { data, error } = await supabase
        .from('contract_documents')
        .select('*')
        .order('upload_date', { ascending: false });
      
      if (error) {
        console.error('Error retrieving documents:', error);
        setError(error);
        showErrorToast(toast, `Error loading documents: ${error.message}`);
        return [];
      }
      
      console.log(`Loaded ${data?.length || 0} contract documents`);
      setDocuments(data || []);
      return data || [];
    } catch (err) {
      console.error('Error in loadDocuments:', err);
      setError(err);
      showErrorToast(toast, `Error loading documents: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Upload a document to Supabase storage and create a database record
   * @param {File} file - The file to upload
   * @param {string} contractId - Associated contract ID (optional)
   * @param {Object} metadata - Additional metadata for the document
   * @returns {Promise<Object>} Upload result
   */
  const uploadDocument = useCallback(async (file, contractId = null, metadata = {}) => {
    try {
      if (!file) {
        const error = new Error('No file provided');
        showErrorToast(toast, error.message);
        return { success: false, error };
      }
      
      setLoading(true);
      setUploadProgress(0);
      
      // Validate file
      if (!validateDocumentFile(file, toast, showErrorToast)) {
        return { success: false, error: new Error('File validation failed') };
      }
      
      // Update progress
      setUploadProgress(10);
      
      // Ensure documents bucket exists
      const bucketExists = await ensureDocumentsBucketExists(supabase, toast, showErrorToast);
      if (!bucketExists) {
        return { success: false, error: new Error('Storage bucket not available') };
      }
      
      // Update progress
      setUploadProgress(20);
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${contractId ? contractId + '_' : ''}${Date.now()}.${fileExt}`;
      const filePath = `contract-documents/${fileName}`;
      
      console.log('Uploading file to Supabase storage:', filePath);
      
      // Upload to Supabase Storage with exponential backoff retry
      let uploadAttempt = 0;
      let uploadSuccess = false;
      let uploadData = null;
      let uploadError = null;
      
      while (uploadAttempt < 3 && !uploadSuccess) {
        try {
          uploadAttempt++;
          
          const { data, error } = await supabase.storage
            .from('documents')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (error) {
            console.error(`Upload attempt ${uploadAttempt} failed:`, error);
            uploadError = error;
            // Wait before retrying
            if (uploadAttempt < 3) {
              await new Promise(resolve => setTimeout(resolve, 1000 * uploadAttempt));
            }
          } else {
            uploadSuccess = true;
            uploadData = data;
          }
        } catch (err) {
          console.error(`Upload attempt ${uploadAttempt} exception:`, err);
          uploadError = err;
          if (uploadAttempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000 * uploadAttempt));
          }
        }
      }
      
      // Check final upload result
      if (!uploadSuccess) {
        console.error('All upload attempts failed:', uploadError);
        showErrorToast(toast, `Upload failed after multiple attempts: ${uploadError.message}`);
        return { success: false, error: uploadError };
      }
      
      // Update progress
      setUploadProgress(50);
        
      console.log('File uploaded successfully, generating public URL');
      
      // Get public URL for the file
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData?.publicUrl || '';
      
      // Update progress
      setUploadProgress(70);
      
      console.log('Creating database record for document');
      
      // Create metadata record in the database
      const { data: documentRecord, error: recordError } = await supabase
        .from('contract_documents')
        .insert({
          filename: file.name,
          file_path: filePath,
          contract_id: contractId,
          file_type: file.type,
          file_size: file.size,
          file_url: publicUrl,
          status: 'pending_verification',
          upload_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          ...metadata
        })
        .select()
        .single();
        
      // Update progress
      setUploadProgress(90);
      
      if (recordError) {
        console.error('Database record error:', recordError);
        showErrorToast(toast, `Database error: ${recordError.message}`);
        
        // Try to delete the uploaded file to avoid orphaned files
        try {
          await supabase.storage.from('documents').remove([filePath]);
          console.log('Cleaned up orphaned file after database error');
        } catch (cleanupError) {
          console.error('Failed to clean up orphaned file:', cleanupError);
        }
        
        return { success: false, error: recordError };
      }
      
      // Update progress
      setUploadProgress(100);
      
      console.log('Document record created successfully:', documentRecord);
      
      // Refresh document list
      await loadDocuments();
      
      showSuccessToast(toast, 'Document uploaded successfully');
      
      return {
        success: true,
        data: documentRecord,
        message: 'Document uploaded successfully'
      };
    } catch (err) {
      console.error('Upload error:', err);
      showErrorToast(toast, `Upload failed: ${err.message || 'Unknown error'}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 2000);
    }
  }, [loadDocuments, toast]);

  /**
   * Search for documents by query term
   * @param {string} query - Search query
   */
  const searchDocuments = useCallback(async (query) => {
    try {
      if (!query || query.trim() === '') {
        showWarningToast(toast, 'Please enter a search term');
        return;
      }
      
      setSearchLoading(true);
      
      const searchTerm = query.trim();
      console.log('Searching documents with term:', searchTerm);
      
      // For Supabase, we use ILIKE for case-insensitive search
      const { data, error } = await supabase
        .from('contract_documents')
        .select('*')
        .or(`
          filename.ilike.%${searchTerm}%,
          contract_id.ilike.%${searchTerm}%,
          client.ilike.%${searchTerm}%,
          notes.ilike.%${searchTerm}%
        `)
        .order('upload_date', { ascending: false });
      
      if (error) {
        console.error('Search error:', error);
        showErrorToast(toast, `Search failed: ${error.message}`);
        return;
      }
      
      console.log(`Search returned ${data?.length || 0} results`);
      setSearchResults(data || []);
      
      if (data && data.length > 0) {
        showSuccessToast(toast, `Found ${data.length} documents matching "${searchTerm}"`);
      } else {
        showWarningToast(toast, `No documents found matching "${searchTerm}"`);
      }
    } catch (err) {
      console.error('Search error:', err);
      showErrorToast(toast, `Search failed: ${err.message || 'Unknown error'}`);
    } finally {
      setSearchLoading(false);
    }
  }, [toast]);

  /**
   * Update document metadata
   * @param {string} documentId - Document ID
   * @param {Object} updates - Fields to update
   */
  const updateDocument = useCallback(async (documentId, updates) => {
    try {
      if (!documentId) {
        showErrorToast(toast, 'Document ID is required for update');
        return { success: false };
      }
      
      setLoading(true);
      
      // Don't allow updating certain fields
      const safeUpdates = { ...updates };
      delete safeUpdates.id;
      delete safeUpdates.file_path;
      delete safeUpdates.created_at;
      
      // Add updated_at timestamp
      safeUpdates.updated_at = new Date().toISOString();
      
      console.log('Updating document:', documentId, safeUpdates);
      
      const { data, error } = await supabase
        .from('contract_documents')
        .update(safeUpdates)
        .eq('id', documentId)
        .select()
        .single();
      
      if (error) {
        console.error('Update error:', error);
        showErrorToast(toast, `Update failed: ${error.message}`);
        return { success: false, error };
      }
      
      console.log('Document updated successfully:', data);
      
      // Update the documents list
      setDocuments(docs => 
        docs.map(doc => doc.id === documentId ? { ...doc, ...safeUpdates } : doc)
      );
      
      // Also update search results if present
      if (searchResults.length > 0) {
        setSearchResults(results => 
          results.map(doc => doc.id === documentId ? { ...doc, ...safeUpdates } : doc)
        );
      }
      
      showSuccessToast(toast, 'Document updated successfully');
      
      return {
        success: true,
        data,
        message: 'Document updated successfully'
      };
    } catch (err) {
      console.error('Update error:', err);
      showErrorToast(toast, `Update failed: ${err.message || 'Unknown error'}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [searchResults, toast]);

  /**
   * Remove a document
   * @param {string} documentId - Document ID to delete
   */
  const removeDocument = useCallback(async (documentId) => {
    try {
      if (!documentId) {
        showErrorToast(toast, 'Document ID is required for deletion');
        return { success: false };
      }
      
      setLoading(true);
      
      console.log('Deleting document:', documentId);
      
      // First get the document to know the file path
      const { data: document, error: getError } = await supabase
        .from('contract_documents')
        .select('file_path')
        .eq('id', documentId)
        .single();
      
      if (getError) {
        console.error('Error getting document for deletion:', getError);
        showErrorToast(toast, `Deletion failed: ${getError.message}`);
        return { success: false, error: getError };
      }
      
      if (!document) {
        showErrorToast(toast, 'Document not found');
        return { success: false, error: new Error('Document not found') };
      }
      
      // Delete from storage
      if (document.file_path) {
        console.log('Removing file from storage:', document.file_path);
        
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([document.file_path]);
          
        if (storageError) {
          console.error('Warning: Could not delete file from storage', storageError);
          showWarningToast(toast, 'Warning: File removed from database but could not be deleted from storage');
          // Continue with database deletion even if storage deletion fails
        }
      }
      
      // Delete from database
      console.log('Removing document record from database');
      const { error } = await supabase
        .from('contract_documents')
        .delete()
        .eq('id', documentId);
      
      if (error) {
        console.error('Database deletion error:', error);
        showErrorToast(toast, `Deletion failed: ${error.message}`);
        return { success: false, error };
      }
      
      console.log('Document deleted successfully');
      
      // Update the documents list
      setDocuments(docs => docs.filter(doc => doc.id !== documentId));
      
      // Also update search results if present
      if (searchResults.length > 0) {
        setSearchResults(results => results.filter(doc => doc.id !== documentId));
      }
      
      showSuccessToast(toast, 'Document deleted successfully');
      
      return {
        success: true,
        message: 'Document deleted successfully'
      };
    } catch (err) {
      console.error('Deletion error:', err);
      showErrorToast(toast, `Deletion failed: ${err.message || 'Unknown error'}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [searchResults, toast]);

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
    
    // Also check if the documents bucket exists on mount
    ensureDocumentsBucketExists(supabase, toast, showErrorToast)
      .then(exists => {
        if (exists) {
          console.log('Documents bucket is ready for uploads');
        } else {
          console.error('Failed to initialize documents bucket');
        }
      });
  }, [loadDocuments, toast]);

  return {
    documents,
    loading,
    error,
    uploadProgress,
    searchResults,
    searchLoading,
    uploadDocument,
    loadDocuments,
    searchDocuments,
    updateDocument,
    removeDocument
  };
};

export default useContractDocuments;
