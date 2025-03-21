
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

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
    },
    enabled: !!employeeId // Only run query if employeeId exists
  });

  // Upload file to Supabase storage
  const uploadFile = async (file, employeeId, category = 'General', description = '') => {
    if (!employeeId) {
      toast({
        title: "Error",
        description: "Employee ID is required to upload documents",
        variant: "destructive",
      });
      return null;
    }

    if (!file) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });
      return null;
    }
    
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "File size exceeds 5MB limit",
        variant: "destructive",
      });
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
        throw uploadError;
      }
      
      console.log('File uploaded successfully:', data);
      
      // Create database record
      const { data: documentData, error: dbError } = await supabase
        .from('personnel_documents')
        .insert([{
          employee_id: employeeId,
          filename: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: (file.size / 1024).toFixed(2), // Size in KB
          category: category,
          description: description,
          uploaded_by: 'System User', // Placeholder until auth is implemented
        }])
        .select()
        .single();
      
      if (dbError) {
        throw dbError;
      }
      
      // Invalidate cache and refresh data
      queryClient.invalidateQueries({ queryKey: ['personnelDocuments', employeeId] });
      
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      
      return documentData;
      
    } catch (error) {
      console.error('Error uploading document:', error);
      
      toast({
        title: "Upload Failed",
        description: error.message || "An error occurred during upload",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Delete document
  const deleteDocument = useMutation({
    mutationFn: async ({ documentId, filePath }) => {
      console.log('Deleting document:', documentId, 'with file path:', filePath);
      
      // First delete from storage
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
      
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete document: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update document metadata
  const updateDocument = useMutation({
    mutationFn: async ({ documentId, updates }) => {
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
      
      toast({
        title: "Success",
        description: "Document information updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update document: ${error.message}`,
        variant: "destructive",
      });
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
