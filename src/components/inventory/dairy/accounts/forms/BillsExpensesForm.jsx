
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useBillsExpenses } from "@/integrations/supabase/hooks/accounting/useBillsExpenses";
import { toast } from "@/components/ui/use-toast";

// Import our component modules
import FormFieldGroup from './components/FormFieldGroup';
import RecurringSection from './components/RecurringSection';
import NotesField from './components/NotesField';
import FileUploadSection from './components/FileUploadSection';
import BillsExpensesRecords from '../records/BillsExpensesRecords';

const BillsExpensesForm = ({ onBack }) => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileSelected, setFileSelected] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [viewMode, setViewMode] = useState("form"); // form or records
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
  }, [setValue]);
  
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

  if (viewMode === "records") {
    return <BillsExpensesRecords onBack={() => setViewMode("form")} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          variant="outline"
          onClick={() => setViewMode("records")}
        >
          View Records
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Bills & Expenses Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormFieldGroup 
              register={register} 
              errors={errors} 
              setValue={setValue} 
            />

            <RecurringSection 
              isRecurring={isRecurring}
              handleRecurringToggle={handleRecurringToggle}
              setValue={setValue}
              register={register}
            />

            <NotesField register={register} />

            <FileUploadSection 
              fileInputRef={fileInputRef}
              fileSelected={fileSelected}
              handleFileUpload={handleFileUpload}
              isUploading={isUploading}
              uploadedFileUrl={uploadedFileUrl}
            />

            <div className="flex gap-4">
              <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">Record Expense</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillsExpensesForm;
