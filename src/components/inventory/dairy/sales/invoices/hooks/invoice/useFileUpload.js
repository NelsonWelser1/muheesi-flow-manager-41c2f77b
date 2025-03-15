
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

export const useFileUpload = (setFileUpload, setFilePreview, setIsUploading) => {
  const { toast } = useToast();

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload JPG, PNG, or PDF files only",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setFileUpload(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(file.name); // Just show the filename for PDFs
    }
  };
  
  // Upload file to Supabase
  const uploadPaymentProof = async (file, invoiceId) => {
    if (!file) return null;
    
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${invoiceId}-payment-proof.${fileExt}`;
      const filePath = `payment-proofs/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('invoices')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      const { data: publicURL } = supabase.storage
        .from('invoices')
        .getPublicUrl(filePath);
      
      return publicURL.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "File upload failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    handleFileChange,
    uploadPaymentProof
  };
};
