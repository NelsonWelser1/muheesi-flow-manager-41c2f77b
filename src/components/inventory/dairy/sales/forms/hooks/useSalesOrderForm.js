
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

export const useSalesOrderForm = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      orderDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'pending',
      deliveryRequired: 'no'
    }
  });
  
  const { toast } = useToast();
  
  const onSubmit = (data) => {
    console.log("Sales order data:", data);
    toast({
      title: "Success",
      description: "Sales order created successfully",
    });
    // Here you would normally save to database
  };

  return {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    onSubmit
  };
};
