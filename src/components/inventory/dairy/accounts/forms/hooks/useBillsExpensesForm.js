
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

export const useBillsExpensesForm = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      billDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      status: 'pending',
      paymentMethod: 'bank_transfer',
      currency: 'UGX'
    }
  });
  
  const { toast } = useToast();
  
  const generateBillNumber = () => {
    const prefix = "BILL";
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomNum}-${timestamp}`;
  };
  
  const onSubmit = (data) => {
    console.log("Bill/Expense data:", data);
    toast({
      title: "Success",
      description: "Bill/Expense recorded successfully",
    });
    // Here you would normally save to database
  };

  return {
    register,
    handleSubmit,
    setValue,
    errors,
    onSubmit,
    generateBillNumber
  };
};
