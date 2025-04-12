
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from '@/components/ui/notifications';

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

      console.log('Attempting to fetch loans data...');
      
      // Check if the loans table exists
      const { data: tableExists, error: tableCheckError } = await supabase
        .from('loans')
        .select('count(*)', { count: 'exact', head: true })
        .limit(1);
      
      if (tableCheckError) {
        console.error('Error checking loans table:', tableCheckError);
        setError(`Table check failed: ${tableCheckError.message}`);
        showErrorToast(toast, `Failed to connect to loans database: ${tableCheckError.message}`);
        setLoansData([]);
        return [];
      }
      
      console.log('Table check successful, fetching data...');

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

      console.log('Loans data fetched successfully:', data);

      // Format the data for display
      const formattedData = data ? data.map(loan => ({
        ...loan,
        id: loan.id, // Use database id as the key
        displayId: loan.loan_id, // Use loan_id as the display id
        amount: loan.amount ? `UGX ${parseFloat(loan.amount).toLocaleString()}` : 'UGX 0',
        remainingAmount: loan.remaining_amount ? `UGX ${parseFloat(loan.remaining_amount).toLocaleString()}` : 'UGX 0',
        nextPaymentAmount: loan.next_payment_amount ? `UGX ${parseFloat(loan.next_payment_amount).toLocaleString()}` : 'N/A',
      })) : [];

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
      const loadingToastId = showLoadingToast(toast, 'Adding loan...');
      setIsSubmitting(true);
      
      console.log('Preparing loan data for submission:', loanData);
      
      // Validate required fields
      const requiredFields = ['loan_id', 'institution', 'start_date', 'due_date', 'amount', 'interest_rate', 'payment_frequency'];
      const missingFields = [];
      
      for (const field of requiredFields) {
        if (!loanData[field]) {
          missingFields.push(field.replace('_', ' '));
        }
      }
      
      if (missingFields.length > 0) {
        const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
        console.error(errorMsg);
        showErrorToast(toast, errorMsg);
        toast.dismiss(loadingToastId);
        return false;
      }

      // Convert string values to appropriate types
      const amount = parseFloat(loanData.amount);
      if (isNaN(amount)) {
        showErrorToast(toast, 'Loan amount must be a valid number');
        toast.dismiss(loadingToastId);
        return false;
      }

      const interestRate = parseFloat(loanData.interest_rate);
      if (isNaN(interestRate)) {
        showErrorToast(toast, 'Interest rate must be a valid number');
        toast.dismiss(loadingToastId);
        return false;
      }

      // Calculate remaining amount (initially equal to the loan amount)
      const remainingAmount = amount;

      // Handle next_payment_amount if provided
      let nextPaymentAmount = null;
      if (loanData.next_payment_amount) {
        nextPaymentAmount = parseFloat(loanData.next_payment_amount);
        if (isNaN(nextPaymentAmount)) {
          showErrorToast(toast, 'Next payment amount must be a valid number');
          toast.dismiss(loadingToastId);
          return false;
        }
      }

      // Create the loan record to insert
      const loanRecord = {
        ...loanData,
        amount,
        interest_rate: interestRate,
        remaining_amount: remainingAmount,
        next_payment_amount: nextPaymentAmount,
        status: loanData.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Submitting loan data to Supabase:', loanRecord);

      const { data, error: insertError } = await supabase
        .from('loans')
        .insert([loanRecord])
        .select();

      if (insertError) {
        console.error('Error adding loan:', insertError);
        showErrorToast(toast, `Failed to add loan: ${insertError.message}`);
        toast.dismiss(loadingToastId);
        return false;
      }

      console.log('Loan added successfully:', data);
      toast.dismiss(loadingToastId);
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

      console.log('Attempting to delete loan with ID:', loanId);

      const { error: deleteError } = await supabase
        .from('loans')
        .delete()
        .eq('loan_id', loanId);

      if (deleteError) {
        console.error('Error deleting loan:', deleteError);
        showErrorToast(toast, `Failed to delete loan: ${deleteError.message}`);
        return false;
      }

      console.log('Loan deleted successfully');
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

  // Update an existing loan
  const updateLoan = async (loanId, loanData) => {
    try {
      const loadingToastId = showLoadingToast(toast, 'Updating loan...');
      setIsSubmitting(true);
      
      console.log('Preparing loan update data:', loanData);
      
      // Convert string values to appropriate types
      const amount = parseFloat(loanData.amount);
      if (isNaN(amount)) {
        showErrorToast(toast, 'Loan amount must be a valid number');
        toast.dismiss(loadingToastId);
        return false;
      }

      const interestRate = parseFloat(loanData.interest_rate);
      if (isNaN(interestRate)) {
        showErrorToast(toast, 'Interest rate must be a valid number');
        toast.dismiss(loadingToastId);
        return false;
      }

      // Handle remaining_amount if provided
      let remainingAmount = parseFloat(loanData.remaining_amount || loanData.amount);
      if (isNaN(remainingAmount)) {
        remainingAmount = amount;
      }

      // Handle next_payment_amount if provided
      let nextPaymentAmount = null;
      if (loanData.next_payment_amount) {
        nextPaymentAmount = parseFloat(loanData.next_payment_amount);
        if (isNaN(nextPaymentAmount)) {
          nextPaymentAmount = null;
        }
      }

      // Create the loan record to update
      const loanRecord = {
        ...loanData,
        amount,
        interest_rate: interestRate,
        remaining_amount: remainingAmount,
        next_payment_amount: nextPaymentAmount,
        updated_at: new Date().toISOString()
      };

      console.log('Submitting loan update to Supabase:', loanRecord);

      const { data, error: updateError } = await supabase
        .from('loans')
        .update(loanRecord)
        .eq('loan_id', loanId)
        .select();

      if (updateError) {
        console.error('Error updating loan:', updateError);
        showErrorToast(toast, `Failed to update loan: ${updateError.message}`);
        toast.dismiss(loadingToastId);
        return false;
      }

      console.log('Loan updated successfully:', data);
      toast.dismiss(loadingToastId);
      showSuccessToast(toast, 'Loan updated successfully');
      
      // Refresh the loans data
      await fetchLoansData();
      return true;
    } catch (error) {
      console.error('Unexpected error updating loan:', error);
      showErrorToast(toast, 'Failed to update loan. Please try again later.');
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
    updateLoan,
    deleteLoan
  };
};
