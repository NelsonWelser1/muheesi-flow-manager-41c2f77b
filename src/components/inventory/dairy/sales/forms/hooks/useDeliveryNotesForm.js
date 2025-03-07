
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

export const useDeliveryNotesForm = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryStatus: 'pending'
    }
  });
  
  const { toast } = useToast();
  
  const onSubmit = (data) => {
    console.log("Delivery note data:", data);
    toast({
      title: "Success",
      description: "Delivery note created successfully",
    });
    // Here you would normally save to database
  };

  return {
    register,
    handleSubmit,
    setValue,
    errors,
    onSubmit
  };
};
