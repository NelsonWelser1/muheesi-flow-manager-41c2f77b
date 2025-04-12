
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { showSuccessToast, showErrorToast } from '@/components/ui/notifications';

export const useLoanData = () => {
  const [loansData, setLoansData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch loans data on component mount
  const fetchLoansData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('loans')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching loans:', fetchError);
        setError(fetchError.message);
        showErrorToast(toast, `Failed to load loans: ${fetchError.message}`);
        return [];
      }

      // Format the data for display
      const formattedData = data.map(loan => ({
        ...loan,
        id: loan.loan_id, // Use loan_id as the display id
        amount: loan.amount ? `UGX ${parseFloat(loan.amount).toLocaleString()}` : 'UGX 0',
        remainingAmount: loan.remaining_amount ? `UGX ${parseFloat(loan.remaining_amount).toLocaleString()}` : 'UGX 0',
        nextPaymentAmount: loan.next_payment_amount ? `UGX ${parseFloat(loan.next_payment_amount).toLocaleString()}` : 'N/A',
      }));

      setLoansData(formattedData);
      return formattedData;
    } catch (error) {
      console.error('Unexpected error fetching loans:', error);
      setError('Failed to load loans. Please try again later.');
      showErrorToast(toast, 'Failed to load loans. Please try again later.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Add new loan to the database
  const addLoan = async (loanData) => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      const requiredFields = ['loan_id', 'institution', 'start_date', 'due_date', 'amount', 'interest_rate', 'payment_frequency'];
      for (const field of requiredFields) {
        if (!loanData[field]) {
          showErrorToast(toast, `${field.replace('_', ' ')} is required`);
          return false;
        }
      }

      // Calculate remaining amount (initially equal to the loan amount)
      const amount = parseFloat(loanData.amount);
      const remainingAmount = amount;

      // Create the loan record to insert
      const loanRecord = {
        ...loanData,
        amount: amount,
        remaining_amount: remainingAmount,
        status: 'active'
      };

      console.log('Submitting loan data:', loanRecord);

      const { data, error: insertError } = await supabase
        .from('loans')
        .insert([loanRecord])
        .select();

      if (insertError) {
        console.error('Error adding loan:', insertError);
        showErrorToast(toast, `Failed to add loan: ${insertError.message}`);
        return false;
      }

      console.log('Loan added successfully:', data);
      showSuccessToast(toast, 'Loan added successfully');
      
      // Refresh the loans data
      await fetchLoansData();
      return true;
    } catch (error) {
      console.error('Unexpected error adding loan:', error);
      showErrorToast(toast, 'Failed to add loan. Please try again later.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a loan from the database
  const deleteLoan = async (loanId) => {
    try {
      setIsSubmitting(true);

      const { error: deleteError } = await supabase
        .from('loans')
        .delete()
        .eq('loan_id', loanId);

      if (deleteError) {
        console.error('Error deleting loan:', deleteError);
        showErrorToast(toast, `Failed to delete loan: ${deleteError.message}`);
        return false;
      }

      showSuccessToast(toast, 'Loan deleted successfully');
      await fetchLoansData();
      return true;
    } catch (error) {
      console.error('Unexpected error deleting loan:', error);
      showErrorToast(toast, 'Failed to delete loan. Please try again later.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch loans data on component mount
  useEffect(() => {
    fetchLoansData();
  }, []);

  return {
    loansData,
    isLoading,
    isSubmitting,
    error,
    fetchLoansData,
    addLoan,
    deleteLoan
  };
};
