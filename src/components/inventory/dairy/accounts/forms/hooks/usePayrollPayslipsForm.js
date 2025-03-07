
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

export const usePayrollPayslipsForm = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      paymentDate: new Date().toISOString().split('T')[0],
      salaryPeriod: 'monthly',
      paymentStatus: 'pending',
      currency: 'UGX'
    }
  });
  
  const { toast } = useToast();
  
  const generatePayslipNumber = () => {
    const prefix = "PAY";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomNum}-${timestamp}`;
  };
  
  const onSubmit = (data) => {
    // Add calculated net salary to the data
    const totalDeductions = parseFloat(data.taxAmount || 0) + 
                          parseFloat(data.nssfAmount || 0) + 
                          parseFloat(data.loanDeduction || 0) + 
                          parseFloat(data.otherDeductions || 0);
    const netSalary = parseFloat(data.basicSalary || 0) - totalDeductions;
    data.netSalary = netSalary;
    
    console.log("Payroll data:", data);
    toast({
      title: "Success",
      description: "Payroll record created successfully",
    });
    // Here you would normally save to database
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    onSubmit,
    generatePayslipNumber
  };
};
