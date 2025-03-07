
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

export const usePaymentsReceiptsForm = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      paymentDate: new Date().toISOString().split('T')[0],
      paymentType: 'received',
      status: 'completed',
      paymentMethod: 'bank_transfer'
    }
  });
  
  const { toast } = useToast();
  const paymentType = watch('paymentType');
  
  const generatePaymentNumber = () => {
    const prefix = paymentType === 'received' ? "RCPT" : "PMT";
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomNum}-${timestamp}`;
  };
  
  const onSubmit = (data) => {
    console.log("Payment/Receipt data:", data);
    toast({
      title: "Success",
      description: `${data.paymentType === 'received' ? 'Receipt' : 'Payment'} recorded successfully`,
    });
    // Here you would normally save to database
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    paymentType,
    onSubmit,
    generatePaymentNumber
  };
};
