
import { useState } from 'react';
import { useFetchBillsExpenses } from './bills/useFetchBillsExpenses';
import { useCreateBillExpense } from './bills/useCreateBillExpense';
import { useReceiptUpload } from './bills/useReceiptUpload';
import { useBillNumberGenerator } from './bills/useBillNumberGenerator';

/**
 * Combined hook for managing bills and expenses in Supabase
 */
export const useBillsExpenses = () => {
  const [error, setError] = useState(null);
  
  // Import functionality from smaller hooks
  const { billsExpenses, loading: fetchLoading, fetchBillsExpenses } = useFetchBillsExpenses();
  const { createBillExpense, loading: createLoading } = useCreateBillExpense(fetchBillsExpenses);
  const { uploadReceipt, loading: uploadLoading } = useReceiptUpload();
  const { getNextBillNumber } = useBillNumberGenerator();
  
  // Combine loading states
  const loading = fetchLoading || createLoading || uploadLoading;

  return {
    billsExpenses,
    loading,
    error,
    fetchBillsExpenses,
    createBillExpense,
    uploadReceipt,
    getNextBillNumber
  };
};
