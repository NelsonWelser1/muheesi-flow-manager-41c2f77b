
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { usePaymentsReceipts } from "@/integrations/supabase/hooks/accounting/payments/usePaymentsReceipts";
import { useToast } from "@/components/ui/use-toast";

export const usePaymentReceiptForm = (setActiveView) => {
  const [paymentNumber, setPaymentNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    reset, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      paymentDate: new Date().toISOString().split('T')[0],
      paymentType: 'received',
      status: 'completed',
      paymentMethod: 'bank_transfer',
      currency: 'UGX'
    }
  });
  
  const { createPayment, generatePaymentNumber } = usePaymentsReceipts();
  const { toast } = useToast();
  const paymentType = watch('paymentType');
  
  // Only generate a payment number once when component mounts OR when payment type changes
  useEffect(() => {
    const newPaymentNumber = generatePaymentNumber(paymentType);
    setPaymentNumber(newPaymentNumber);
    setValue('paymentNumber', newPaymentNumber);
  }, [paymentType, setValue, generatePaymentNumber]);
  
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting payment/receipt data:", data);
      
      // Make sure we have the payment number in the data
      if (!data.paymentNumber) {
        data.paymentNumber = paymentNumber;
      }
      
      const result = await createPayment(data);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `${data.paymentType === 'received' ? 'Receipt' : 'Payment'} recorded successfully`,
        });
        
        // Switch to records view after successful submission
        if (setActiveView) {
          setActiveView('payments-receipts-records');
        }
      } else {
        throw new Error(result.error?.message || "Failed to save payment record");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an error saving your payment record.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    onSubmit,
    paymentNumber,
    isSubmitting
  };
};
