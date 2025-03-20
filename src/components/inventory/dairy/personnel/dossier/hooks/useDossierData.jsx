
import { useEmployeeDossiers } from './useEmployeeDossiers';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

// This is a backward compatibility wrapper around our new hook with added file functionality
export const useDossierData = (searchQuery = '') => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const employeeDossiers = useEmployeeDossiers(searchQuery);

  // Handle file upload to Supabase storage
  const uploadFile = async (file, employeeId) => {
    if (!employeeId) {
      toast({
        title: "Employee ID Required",
        description: "Please save the dossier first to upload documents.",
        variant: "destructive"
      });
      return null;
    }

    if (!file) return null;
    
    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 10MB",
        variant: "destructive"
      });
      return null;
    }
    
    setUploading(true);
    
    try {
      // Upload to Supabase Storage
      const filename = `${employeeId}/${Date.now()}_${file.name}`;
      const { error: uploadError, data } = await supabase.storage
        .from('employee_documents')
        .upload(filename, file);
      
      if (uploadError) throw uploadError;
      
      // Create database record
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error: dbError, data: documentData } = await supabase
        .from('personnel_documents')
        .insert([{
          employee_id: employeeId,
          filename: file.name,
          file_path: filename,
          file_type: file.type,
          file_size: (file.size / 1024).toFixed(2), // KB
          category: 'Other',
          uploaded_by: user?.id || 'anonymous'
        }])
        .select()
        .single();
      
      if (dbError) throw dbError;
      
      toast({
        title: "Document Uploaded",
        description: "File has been successfully uploaded.",
      });

      return documentData;
      
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Get URL for viewing a document
  const getDocumentUrl = (filePath) => {
    const { data } = supabase.storage
      .from('employee_documents')
      .getPublicUrl(filePath);
    
    return data?.publicUrl || null;
  };

  // Delete a document from storage and database
  const deleteDocument = async (documentId, filePath) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('employee_documents')
        .remove([filePath]);
      
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('personnel_documents')
        .delete()
        .eq('id', documentId);
      
      if (dbError) throw dbError;
      
      toast({
        title: "Document Deleted",
        description: "File has been successfully deleted.",
      });
      
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  // Fetch documents for a specific employee
  const fetchDocuments = async (employeeId) => {
    if (!employeeId) return [];
    
    try {
      const { data, error } = await supabase
        .from('personnel_documents')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error Fetching Documents",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    ...employeeDossiers,
    uploading,
    uploadFile,
    getDocumentUrl,
    deleteDocument,
    fetchDocuments,
  };
};
