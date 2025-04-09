
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  uploadContractDocument, 
  getContractDocuments, 
  searchContractDocuments,
  updateDocumentMetadata,
  deleteDocument
} from '../utils/documentUtils';
import { showSuccessToast, showErrorToast } from '@/components/ui/notifications';

/**
 * Custom hook for managing contract documents with Supabase integration
 */
export const useContractDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  /**
   * Upload a document to Supabase
   */
  const uploadDocument = useCallback(async (file, contractId = null, metadata = {}) => {
    if (!file) {
      showErrorToast(toast, "No file selected for upload");
      return { success: false };
    }

    try {
      setLoading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      // Perform the upload to Supabase
      const result = await uploadContractDocument(file, contractId, metadata);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success) {
        // Add the document to the list
        setDocuments(prevDocs => [result.data, ...prevDocs]);
        
        showSuccessToast(toast, "Document uploaded successfully");
      } else {
        showErrorToast(toast, result.message || "Failed to upload document");
      }
      
      return result;
    } catch (error) {
      console.error("Error uploading document:", error);
      
      showErrorToast(toast, error.message || "An unexpected error occurred during upload");
      
      return { success: false, error };
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [toast]);

  /**
   * Load documents from Supabase, with optional filtering
   */
  const loadDocuments = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      
      const result = await getContractDocuments(filters);
      
      if (result.success) {
        setDocuments(result.data);
      } else {
        showErrorToast(toast, result.message || "Failed to load documents");
      }
      
      return result;
    } catch (error) {
      console.error("Error loading documents:", error);
      
      showErrorToast(toast, error.message || "An unexpected error occurred while loading documents");
      
      return { success: false, error, data: [] };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Search for documents in Supabase
   */
  const searchDocuments = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return { success: false, message: "Search query is required", data: [] };
    }
    
    try {
      setSearchLoading(true);
      
      const result = await searchContractDocuments(query);
      
      if (result.success) {
        setSearchResults(result.data);
      } else {
        showErrorToast(toast, result.message || "Failed to search documents");
      }
      
      return result;
    } catch (error) {
      console.error("Error searching documents:", error);
      
      showErrorToast(toast, error.message || "An unexpected error occurred during search");
      
      return { success: false, error, data: [] };
    } finally {
      setSearchLoading(false);
    }
  }, [toast]);

  /**
   * Update document metadata or status in Supabase
   */
  const updateDocument = useCallback(async (documentId, updates) => {
    try {
      setLoading(true);
      
      const result = await updateDocumentMetadata(documentId, updates);
      
      if (result.success) {
        // Update the local document list
        setDocuments(prevDocs => 
          prevDocs.map(doc => 
            doc.id === documentId ? { ...doc, ...updates } : doc
          )
        );
        
        // Also update search results if present
        if (searchResults.length > 0) {
          setSearchResults(prevResults => 
            prevResults.map(doc => 
              doc.id === documentId ? { ...doc, ...updates } : doc
            )
          );
        }
        
        showSuccessToast(toast, "Document updated successfully");
      } else {
        showErrorToast(toast, result.message || "Failed to update document");
      }
      
      return result;
    } catch (error) {
      console.error("Error updating document:", error);
      
      showErrorToast(toast, error.message || "An unexpected error occurred during update");
      
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [toast, searchResults]);

  /**
   * Delete a document from Supabase
   */
  const removeDocument = useCallback(async (documentId) => {
    try {
      setLoading(true);
      
      const result = await deleteDocument(documentId);
      
      if (result.success) {
        // Remove from local state
        setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
        
        // Also remove from search results if present
        if (searchResults.length > 0) {
          setSearchResults(prevResults => prevResults.filter(doc => doc.id !== documentId));
        }
        
        showSuccessToast(toast, "Document deleted successfully");
      } else {
        showErrorToast(toast, result.message || "Failed to delete document");
      }
      
      return result;
    } catch (error) {
      console.error("Error deleting document:", error);
      
      showErrorToast(toast, error.message || "An unexpected error occurred while deleting");
      
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [toast, searchResults]);

  // Load documents on mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        await loadDocuments();
      } catch (error) {
        console.error("Error connecting to Supabase:", error);
        showErrorToast(toast, "Failed to connect to database. Please try again later.");
      }
    };
    
    fetchDocuments();
  }, [loadDocuments, toast]);

  return {
    documents,
    loading,
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
