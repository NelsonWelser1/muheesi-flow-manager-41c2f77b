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
  ensureDocumentsBucketExists,
  uploadFileWithRetry
} from '../utils/documentUtils';
import runContractDocumentsMigration from '@/integrations/supabase/migrations/contractDocumentsMigration';

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
  const [isBucketInitialized, setIsBucketInitialized] = useState(false);

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
      
      // Ensure bucket exists if not already verified
      if (!isBucketInitialized) {
        const bucketExists = await ensureDocumentsBucketExists(supabase, toast, showErrorToast, showWarningToast);
        setIsBucketInitialized(bucketExists);
        if (!bucketExists) {
          return { success: false, error: new Error('Storage bucket not available') };
        }
      }
      
      // Update progress
      setUploadProgress(20);
      
      // Generate a unique filename with timestamp and random string to avoid collisions
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 10);
      const fileName = `${contractId ? contractId + '_' : ''}${timestamp}_${randomString}.${fileExt}`;
      const filePath = `contract-documents/${fileName}`;
      
      console.log('Uploading file to Supabase storage:', filePath);
      
      // Upload to Supabase Storage with retry
      const uploadResult = await uploadFileWithRetry(
        supabase, 
        file, 
        filePath, 
        (progress) => setUploadProgress(progress)
      );
      
      // Check upload result
      if (!uploadResult.success) {
        console.error('Upload failed after multiple attempts:', uploadResult.error);
        showErrorToast(toast, `Upload failed: ${uploadResult.error?.message || 'Unknown error'}`);
        return { success: false, error: uploadResult.error };
      }
      
      // Update progress
      setUploadProgress(70);
      
      const publicUrl = uploadResult.publicUrl || '';
      
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
  }, [isBucketInitialized, loadDocuments, toast]);

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

  // Initialize on mount
  useEffect(() => {
    // Run migrations and load documents
    const initializeStorage = async () => {
      try {
        // Run migration to ensure the bucket exists
        const migrationResult = await runContractDocumentsMigration(toast);
        
        if (migrationResult.success || migrationResult.bypassed) {
          setIsBucketInitialized(true);
          
          if (migrationResult.bypassed) {
            showWarningToast(toast, 'Document storage has limited permissions. Some operations may fail.');
          }
        } else {
          showWarningToast(toast, 'Document storage initialization had issues. Uploads may fail.');
        }
        
        // Load initial documents
        await loadDocuments();
      } catch (err) {
        console.error('Initialization error:', err);
        showErrorToast(toast, 'Failed to initialize document storage');
      }
    };
    
    initializeStorage();
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
    removeDocument,
    isBucketInitialized
  };
};

export default useContractDocuments;
