import { useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/hooks/use-toast';
import { showSuccessToast, showErrorToast } from '@/components/ui/notifications';

export const useLoanData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Add a new loan to the database
  const addLoan = async (loanData) => {
    if (!loanData) {
      showErrorToast(toast, "No loan data provided");
      return null;
    }

    setIsSubmitting(true);
    console.log("Submitting loan data:", loanData);

    try {
      // Format the data for Supabase
      const formattedLoan = {
        loan_id: loanData.loanId,
        institution: loanData.institution,
        start_date: loanData.startDate,
        due_date: loanData.dueDate,
        amount: parseFloat(loanData.amount.replace(/[^0-9.]/g, '')),
        interest_rate: parseFloat(loanData.interestRate),
        payment_frequency: loanData.paymentFrequency,
        purpose: loanData.purpose,
        collateral: loanData.collateral || null,
        contact_person: loanData.contact || null,
        notes: loanData.notes || null,
        status: 'active',
        created_at: new Date().toISOString()
      };

      console.log("Formatted loan data for Supabase:", formattedLoan);

      // Insert into the loans table
      const { data, error } = await supabase
        .from('loans')
        .insert([formattedLoan])
        .select();

      if (error) {
        console.error('Error adding loan:', error.message);
        showErrorToast(toast, `Failed to add loan: ${error.message}`);
        return null;
      }

      console.log("Loan added successfully:", data);
      showSuccessToast(toast, "Loan successfully added");
      return data[0];
    } catch (error) {
      console.error('Exception adding loan:', error.message);
      showErrorToast(toast, `Error: ${error.message}`);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch loans from the database
  const fetchLoans = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Format the data for display
      const formattedData = data.map(loan => ({
        id: loan.id,
        loanId: loan.loan_id,
        institution: loan.institution,
        startDate: loan.start_date,
        dueDate: loan.due_date,
        amount: `UGX ${loan.amount.toLocaleString()}`,
        remainingAmount: `UGX ${(loan.amount * 0.65).toLocaleString()}`, // Mock calculation
        nextPayment: calculateNextPayment(loan.start_date, loan.payment_frequency),
        nextPaymentAmount: `UGX ${calculateMonthlyPayment(loan.amount, loan.interest_rate, loan.due_date).toLocaleString()}`,
        status: loan.status,
        interestRate: `${loan.interest_rate}%`,
        paymentFrequency: loan.payment_frequency,
        purpose: loan.purpose,
        collateral: loan.collateral,
        contact: loan.contact_person
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching loans:', error.message);
      showErrorToast(toast, `Failed to fetch loans: ${error.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate next payment date based on frequency and start date
  const calculateNextPayment = (startDate, frequency) => {
    const today = new Date();
    const start = new Date(startDate);
    let nextDate = new Date(start);
    
    // Calculate next payment based on frequency
    switch(frequency) {
      case 'monthly':
        while (nextDate <= today) {
          nextDate.setMonth(nextDate.getMonth() + 1);
        }
        break;
      case 'quarterly':
        while (nextDate <= today) {
          nextDate.setMonth(nextDate.getMonth() + 3);
        }
        break;
      case 'biannual':
        while (nextDate <= today) {
          nextDate.setMonth(nextDate.getMonth() + 6);
        }
        break;
      case 'annual':
        while (nextDate <= today) {
          nextDate.setFullYear(nextDate.getFullYear() + 1);
        }
        break;
      default:
        return 'N/A';
    }
    
    return nextDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Helper function to calculate monthly payment
  const calculateMonthlyPayment = (principal, rate, dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const monthsRemaining = (due.getFullYear() - today.getFullYear()) * 12 + (due.getMonth() - today.getMonth());
    
    if (monthsRemaining <= 0) return 0;
    
    const monthlyRate = rate / 100 / 12;
    const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, monthsRemaining) / (Math.pow(1 + monthlyRate, monthsRemaining) - 1);
    
    return Math.round(payment);
  };

  return {
    isLoading,
    isSubmitting,
    addLoan,
    fetchLoans
  };
};
