
import { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { useBillsExpenses } from "@/integrations/supabase/hooks/accounting/useBillsExpenses";
import { toast } from "@/components/ui/use-toast";

export const useBillsExpensesForm = () => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileSelected, setFileSelected] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const fileInputRef = useRef(null);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      billDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      status: 'pending',
      paymentMethod: 'bank_transfer',
      currency: 'UGX',
      isRecurring: false,
      recurringFrequency: '',
      recurringEndDate: '',
    }
  });
  
  const { createBillExpense, uploadReceipt, getLatestBillNumber } = useBillsExpenses();
  
  useEffect(() => {
    const loadBillNumber = async () => {
      const billNumber = await getLatestBillNumber();
      setValue("billNumber", billNumber);
    };
    
    loadBillNumber();
  }, [setValue, getLatestBillNumber]);
  
  const onSubmit = async (data) => {
    try {
      console.log("Bill/Expense data:", data);
      
      // Add recurring fields if enabled
      if (isRecurring) {
        data.isRecurring = true;
      } else {
        data.isRecurring = false;
        data.recurringFrequency = null;
        data.recurringEndDate = null;
      }
      
      // If file was uploaded, add the URL
      if (uploadedFileUrl) {
        data.receiptUrl = uploadedFileUrl;
      }
      
      // Submit to Supabase
      const result = await createBillExpense(data);
      
      if (result.success) {
        toast({
          title: "Bill/Expense saved",
          description: "Your bill/expense record has been saved successfully.",
        });
        
        // Reset the form
        reset({
          billDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending',
          paymentMethod: 'bank_transfer',
          currency: 'UGX',
          isRecurring: false,
          recurringFrequency: '',
          recurringEndDate: '',
        });
        
        // Get a new bill number
        const newBillNumber = await getLatestBillNumber();
        setValue("billNumber", newBillNumber);
        
        // Reset file state
        setFileSelected(null);
        setUploadedFileUrl("");
        
        // Reset recurring
        setIsRecurring(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an error saving your bill/expense record.",
        variant: "destructive",
      });
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileSelected(file);
    }
  };
  
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
  
  const handleRecurringToggle = (checked) => {
    setIsRecurring(checked);
    setValue("isRecurring", checked);
  };

  // Update fileInputRef to handle file selection
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.addEventListener('change', handleFileChange);
    }
    
    return () => {
      if (fileInputRef.current) {
        fileInputRef.current.removeEventListener('change', handleFileChange);
      }
    };
  }, [fileInputRef]);

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    errors,
    fileInputRef,
    fileSelected,
    isUploading,
    uploadedFileUrl,
    isRecurring,
    handleRecurringToggle,
    handleFileChange,
    handleFileUpload,
    onSubmit
  };
};
