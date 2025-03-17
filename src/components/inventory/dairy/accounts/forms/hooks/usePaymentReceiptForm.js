
import { useForm } from "react-hook-form";
import { usePaymentsReceipts } from "@/integrations/supabase/hooks/accounting/payments/usePaymentsReceipts";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export const usePaymentReceiptForm = () => {
  const [paymentNumber, setPaymentNumber] = useState("");
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
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
  
  useEffect(() => {
    // Generate and set a new payment number whenever payment type changes
    const newPaymentNumber = generatePaymentNumber(paymentType);
    setPaymentNumber(newPaymentNumber);
    setValue('paymentNumber', newPaymentNumber);
  }, [paymentType, setValue, generatePaymentNumber]);
  
  const onSubmit = async (data) => {
    try {
      console.log("Payment/Receipt data:", data);
      
      const result = await createPayment(data);
      
      if (result.success) {
        // Reset form to default values
        reset({
          paymentDate: new Date().toISOString().split('T')[0],
          paymentType: 'received',
          status: 'completed',
          paymentMethod: 'bank_transfer',
          currency: 'UGX'
        });
        
        // Generate and set new payment number
        const newPaymentNumber = generatePaymentNumber('received');
        setPaymentNumber(newPaymentNumber);
        setValue('paymentNumber', newPaymentNumber);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an error saving your payment record.",
        variant: "destructive"
      });
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    onSubmit,
    paymentNumber
  };
};
