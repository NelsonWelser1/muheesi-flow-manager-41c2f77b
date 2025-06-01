
export const useFormReset = (reset, setValue, getLatestBillNumber, resetFileState, setIsRecurring) => {
  const clearFormAfterSubmission = async () => {
    // Get a new bill number first
    const newBillNumber = await getLatestBillNumber();
    
    // Reset the form completely with default values and new bill number
    const defaultValues = {
      billDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      paymentMethod: 'bank_transfer',
      currency: 'UGX',
      isRecurring: false,
      recurringFrequency: '',
      recurringEndDate: '',
      billNumber: newBillNumber,
      vendorName: '',
      expenseType: '',
      amount: '',
      description: '',
      notes: ''
    };
    
    // Reset form with new default values
    reset(defaultValues);
    
    // Manually set each field to ensure they are cleared
    Object.keys(defaultValues).forEach(key => {
      setValue(key, defaultValues[key]);
    });
    
    // Reset file state completely
    resetFileState();
    
    // Reset recurring state
    setIsRecurring(false);
  };

  return { clearFormAfterSubmission };
};
