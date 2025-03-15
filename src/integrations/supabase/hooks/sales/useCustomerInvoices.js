
import { useEffect } from 'react';
import { useFetchInvoices } from './invoices/useFetchInvoices';
import { useCreateInvoice } from './invoices/useCreateInvoice';
import { useUpdateInvoice } from './invoices/useUpdateInvoice';
import { useDeleteInvoice } from './invoices/useDeleteInvoice';

/**
 * Combined hook for managing customer invoices
 */
export const useCustomerInvoices = () => {
  // Use the individual hooks
  const { invoices, loading: fetchLoading, error: fetchError, fetchInvoices } = useFetchInvoices();
  const { createInvoice, loading: createLoading, error: createError } = useCreateInvoice(fetchInvoices);
  const { updateInvoice, loading: updateLoading, error: updateError } = useUpdateInvoice(fetchInvoices);
  const { deleteInvoice, loading: deleteLoading, error: deleteError } = useDeleteInvoice(fetchInvoices);

  // Combined loading state
  const loading = fetchLoading || createLoading || updateLoading || deleteLoading;
  
  // Combined error state (prioritize the first error)
  const error = fetchError || createError || updateError || deleteError;

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    // Data
    invoices,
    loading,
    error,
    
    // Actions
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice
  };
};
