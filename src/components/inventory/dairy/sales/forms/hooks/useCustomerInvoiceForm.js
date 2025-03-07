
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const useCustomerInvoiceForm = () => {
  const [invoiceStatus, setInvoiceStatus] = useState('pending');
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      paymentStatus: 'pending',
      paymentTerms: 'bank_transfer'
    }
  });
  
  const { toast } = useToast();
  
  const generateInvoiceNumber = () => {
    // Simple invoice number generation logic
    const prefix = "INV";
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomNum}-${timestamp}`;
  };
  
  const onSubmit = (data) => {
    console.log("Invoice data:", data);
    setInvoiceStatus('processing');
    
    // Simulate processing delay
    setTimeout(() => {
      setInvoiceStatus('completed');
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
    }, 1500);
    
    // Here you would normally save to database
  };

  return {
    register,
    handleSubmit,
    setValue,
    errors,
    onSubmit,
    generateInvoiceNumber,
    invoiceStatus,
    setInvoiceStatus
  };
};
