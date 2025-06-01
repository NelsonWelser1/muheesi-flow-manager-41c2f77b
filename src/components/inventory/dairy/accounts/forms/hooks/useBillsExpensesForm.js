
import { useEffect } from 'react';
import { useBillsExpenses } from "@/integrations/supabase/hooks/accounting/useBillsExpenses";
import { useFormState } from './useFormState';
import { useFileUploadState } from './useFileUploadState';
import { useFormReset } from './useFormReset';
import { useFileUploadHandler } from './useFileUploadHandler';
import { useFormSubmission } from './useFormSubmission';

export const useBillsExpensesForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    errors,
    isRecurring,
    isSubmissionCooldown,
    handleRecurringToggle,
    startSubmissionCooldown
  } = useFormState();

  const {
    isUploading,
    setIsUploading,
    fileSelected,
    uploadedFileUrl,
    setUploadedFileUrl,
    filePreviewUrl,
    fileInputRef,
    handleFileChange,
    resetFileState
  } = useFileUploadState();

  const { createBillExpense, uploadReceipt, getLatestBillNumber } = useBillsExpenses();

  const { clearFormAfterSubmission } = useFormReset(
    reset, 
    setValue, 
    getLatestBillNumber, 
    resetFileState,
    handleRecurringToggle
  );

  const { handleFileUpload } = useFileUploadHandler(
    fileSelected,
    setIsUploading,
    setUploadedFileUrl,
    uploadReceipt,
    watch
  );

  const { onSubmit } = useFormSubmission(
    createBillExpense,
    uploadedFileUrl,
    isRecurring,
    clearFormAfterSubmission,
    startSubmissionCooldown,
    isSubmissionCooldown
  );
  
  useEffect(() => {
    const loadBillNumber = async () => {
      const billNumber = await getLatestBillNumber();
      setValue("billNumber", billNumber);
    };
    
    loadBillNumber();
  }, [setValue, getLatestBillNumber]);

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
    filePreviewUrl,
    isRecurring,
    isSubmissionCooldown,
    handleRecurringToggle,
    handleFileChange,
    handleFileUpload,
    onSubmit
  };
};
