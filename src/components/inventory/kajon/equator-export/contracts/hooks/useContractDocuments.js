
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  uploadContractDocument, 
  getContractDocuments, 
  searchContractDocuments,
  updateDocumentMetadata
} from '../utils/documentUtils';

/**
 * Custom hook for managing contract documents
 */
export const useContractDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  /**
   * Upload a document
   */
  const uploadDocument = useCallback(async (file, contractId = null, metadata = {}) => {
    if (!file) {
      toast({
        title: "Error",
        description: "No file selected for upload",
        variant: "destructive"
      });
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

      // Perform the upload
      const result = await uploadContractDocument(file, contractId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success) {
        // Add the document to the list
        setDocuments(prevDocs => [result.data, ...prevDocs]);
        
        toast({
          title: "Success",
          description: "Document uploaded successfully"
        });
      } else {
        toast({
          title: "Upload Failed",
          description: result.message || "Failed to upload document",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error uploading document:", error);
      
      toast({
        title: "Upload Error",
        description: error.message || "An unexpected error occurred during upload",
        variant: "destructive"
      });
      
      return { success: false, error };
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [toast]);

  /**
   * Load documents, with optional filtering
   */
  const loadDocuments = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      
      const result = await getContractDocuments(filters);
      
      if (result.success) {
        setDocuments(result.data);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to load documents",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error loading documents:", error);
      
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred while loading documents",
        variant: "destructive"
      });
      
      return { success: false, error, data: [] };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Search for documents
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
        toast({
          title: "Search Error",
          description: result.message || "Failed to search documents",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error searching documents:", error);
      
      toast({
        title: "Search Error",
        description: error.message || "An unexpected error occurred during search",
        variant: "destructive"
      });
      
      return { success: false, error, data: [] };
    } finally {
      setSearchLoading(false);
    }
  }, [toast]);

  /**
   * Update document metadata or status
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
        
        toast({
          title: "Success",
          description: "Document updated successfully"
        });
      } else {
        toast({
          title: "Update Failed",
          description: result.message || "Failed to update document",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error updating document:", error);
      
      toast({
        title: "Update Error",
        description: error.message || "An unexpected error occurred during update",
        variant: "destructive"
      });
      
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [toast, searchResults]);

  return {
    documents,
    loading,
    uploadProgress,
    searchResults,
    searchLoading,
    uploadDocument,
    loadDocuments,
    searchDocuments,
    updateDocument
  };
};

export default useContractDocuments;
