
import { toast } from "@/components/ui/use-toast";

export const useFileUploadHandler = (fileSelected, setIsUploading, setUploadedFileUrl, uploadReceipt, watch) => {
  const handleFileUpload = async () => {
    if (!fileSelected) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const billNumber = watch("billNumber");
      const result = await uploadReceipt(fileSelected, billNumber);
      
      if (result.success) {
        setUploadedFileUrl(result.url);
        toast({
          title: "File uploaded",
          description: "Your receipt has been uploaded successfully.",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your receipt.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return { handleFileUpload };
};
