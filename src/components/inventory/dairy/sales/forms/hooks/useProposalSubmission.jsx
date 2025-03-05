
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useProposalSubmission = (reset, products, currency = 'UGX') => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateProducts = (products) => {
    return products.every(product => 
      product.name && 
      product.category && 
      product.base_price !== '' && 
      product.base_price !== null
    );
  };

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data);
    console.log("Products at submission:", products);
    console.log("Current currency:", currency);
    
    setIsSubmitting(true);
    
    // Validate all required product fields are filled
    if (!validateProducts(products)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required product fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Calculate grand total
      const grandTotal = products.reduce((sum, product) => {
        return sum + (parseFloat(product.final_price) || 0);
      }, 0).toFixed(2);
      
      console.log("Calculated grand total:", grandTotal);
      
      // Create proposal object with form data and products
      const proposalData = {
        ...data,
        products: products,
        currency: currency,
        grand_total: grandTotal,
        created_at: new Date().toISOString(),
        status: 'pending'
      };
      
      console.log("Submitting proposal:", proposalData);
      
      // Here you would typically save the data to your database
      // For example with Supabase:
      // const { data: savedProposal, error } = await supabase
      //   .from('sales_proposals')
      //   .insert([proposalData]);
      
      // Simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Success!",
        description: "Sales proposal created successfully",
      });
      
      // Reset form
      reset();
      
      // You might also want to redirect the user
      // navigate('/sales/proposals');
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your sales proposal",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    onSubmit
  };
};

export default useProposalSubmission;
