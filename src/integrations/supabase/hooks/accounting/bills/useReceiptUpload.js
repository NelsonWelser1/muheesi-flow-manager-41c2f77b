
import { useState } from 'react';
import { supabase } from '../../../supabase';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for handling receipt file uploads
 */
export const useReceiptUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const uploadReceipt = async (file, billNumber) => {
    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${billNumber}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading receipt:', filePath);
      
      const { data, error } = await supabase.storage
        .from('expenses')
        .upload(filePath, file);
      
      if (error) {
        console.error('Error uploading receipt:', error);
        toast({
          title: "Error uploading receipt",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('expenses')
        .getPublicUrl(filePath);
      
      console.log('Receipt uploaded successfully:', publicUrl);
      
      toast({
        title: "Success",
        description: "Receipt uploaded successfully",
      });
      
      return { success: true, url: publicUrl };
    } catch (err) {
      console.error('Unexpected error uploading receipt:', err);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadReceipt,
    loading,
    error
  };
};
