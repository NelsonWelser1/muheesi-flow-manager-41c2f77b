
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const useDocuments = (employeeId = null) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch documents for a specific employee
  const { 
    data: documents = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['personnelDocuments', employeeId],
    queryFn: async () => {
      // Skip query if no employeeId is provided
      if (!employeeId) return [];
      
      console.log('Fetching documents for employee:', employeeId);
      
      try {
        const { data, error } = await supabase
          .from('personnel_documents')
          .select('*')
          .eq('employee_id', employeeId)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching documents:', error);
          throw error;
        }
        
        console.log('Fetched documents:', data);
        return data || [];
      } catch (err) {
        console.error('Error in document fetch operation:', err);
        showErrorToast(toast, `Failed to fetch documents: ${err.message}`);
        return [];
      }
    },
    enabled: !!employeeId // Only run query if employeeId exists
  });

  // Upload file to Supabase storage
  const uploadFile = async (file, employeeId, category = 'General', description = '') => {
    if (!employeeId) {
      showErrorToast(toast, "Employee ID is required to upload documents");
      return null;
    }

    if (!file) {
      showErrorToast(toast, "No file selected");
      return null;
    }
    
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showErrorToast(toast, "File size exceeds 5MB limit");
      return null;
    }
    
    setUploading(true);
    
    try {
      console.log('Uploading file:', file.name, 'for employee:', employeeId);
      
      // Create a unique filename to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${employeeId}/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('employee_documents')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }
      
      console.log('File uploaded successfully:', data);
      
      // Ensure we have valid file_size (convert to string if needed)
      const fileSizeStr = typeof file.size === 'number' 
        ? (file.size / 1024).toFixed(2) 
        : String(file.size);
      
      // Create database record
      const { data: documentData, error: dbError } = await supabase
        .from('personnel_documents')
        .insert([{
          employee_id: employeeId,
          filename: file.name,
          file_path: filePath,
          file_type: file.type || 'application/octet-stream',
          file_size: fileSizeStr,
          category: category || 'General',
          description: description || '',
          uploaded_by: 'System User', // Placeholder until auth is implemented
        }])
        .select()
        .single();
      
      if (dbError) {
        console.error('Database insert error:', dbError);
        // If DB insert fails, try to clean up the uploaded file
        await supabase.storage.from('employee_documents').remove([filePath]);
        throw dbError;
      }
      
      // Invalidate cache and refresh data
      queryClient.invalidateQueries({ queryKey: ['personnelDocuments', employeeId] });
      
      showSuccessToast(toast, "Document uploaded successfully");
      
      return documentData;
      
    } catch (error) {
      console.error('Error uploading document:', error);
      showErrorToast(toast, error.message || "An error occurred during upload");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Delete document
  const deleteDocument = useMutation({
    mutationFn: async ({ documentId, filePath }) => {
      if (!documentId) {
        throw new Error('Document ID is required for deletion');
      }
      
      console.log('Deleting document:', documentId, 'with file path:', filePath);
      
      // First delete from storage if filePath exists
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('employee_documents')
          .remove([filePath]);
        
        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
          throw storageError;
        }
      }
      
      // Then delete from database
      const { error: dbError } = await supabase
        .from('personnel_documents')
        .delete()
        .eq('id', documentId);
      
      if (dbError) {
        console.error('Error deleting document record:', dbError);
        throw dbError;
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnelDocuments', employeeId] });
      showSuccessToast(toast, "Document deleted successfully");
    },
    onError: (error) => {
      showErrorToast(toast, `Failed to delete document: ${error.message}`);
    }
  });

  // Update document metadata
  const updateDocument = useMutation({
    mutationFn: async ({ documentId, updates }) => {
      if (!documentId) {
        throw new Error('Document ID is required for updates');
      }
      
      console.log('Updating document:', documentId, 'with updates:', updates);
      
      const { data, error } = await supabase
        .from('personnel_documents')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating document:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnelDocuments', employeeId] });
      showSuccessToast(toast, "Document information updated successfully");
    },
    onError: (error) => {
      showErrorToast(toast, `Failed to update document: ${error.message}`);
    }
  });

  // Get public URL for a file
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    
    const { data } = supabase.storage
      .from('employee_documents')
      .getPublicUrl(filePath);
    
    return data?.publicUrl || null;
  };

  // Debug handler example for document operations
  const debugDocumentOperation = (operationType, data) => {
    console.group(`Document Operation: ${operationType}`);
    console.log('Time:', new Date().toISOString());
    console.log('Data:', data);
    console.groupEnd();
  };

  return {
    documents,
    isLoading,
    error,
    uploading,
    uploadFile,
    deleteDocument: (documentId, filePath) => {
      debugDocumentOperation('Delete', { documentId, filePath });
      return deleteDocument.mutate({ documentId, filePath });
    },
    updateDocument: (documentId, updates) => {
      debugDocumentOperation('Update', { documentId, updates });
      return updateDocument.mutate({ documentId, updates });
    },
    getFileUrl,
    refetchDocuments: refetch,
    isDeleting: deleteDocument.isPending,
    isUpdating: updateDocument.isPending
  };
};
