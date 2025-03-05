
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { format } from 'date-fns';

export const useProposalSubmission = (
  reset, 
  selectedProducts, 
  setSelectedProducts, 
  calculateGrandTotal, 
  setValue
) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Handle form submission
  const onSubmit = async (data) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Prepare data for submission
      const proposal = {
        proposal_id: data.proposal_id,
        customer_name: data.customer_name,
        customer_email: data.contact_email,
        customer_phone: data.contact_phone,
        proposal_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        validity_period: parseInt(data.validity_period),
        terms_conditions: data.terms_conditions,
        products: selectedProducts,
        grand_total: calculateGrandTotal(),
        status: 'draft',
        created_by: user?.id || null
      };
      
      console.log('Submitting proposal:', proposal);
      
      // Insert into sales_proposals table
      const { error } = await supabase
        .from('sales_proposals')
        .insert([proposal]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Sales proposal saved successfully",
      });
      
      // Reset form and state
      reset();
      setSelectedProducts([]);
      
      // Generate new proposal ID
      const timestamp = format(new Date(), 'yyyyMMddHHmmss');
      const uniqueId = `PROP-${timestamp}-${Math.floor(Math.random() * 1000)}`;
      setValue('proposal_id', uniqueId);
      
    } catch (error) {
      console.error('Error saving proposal:', error);
      toast({
        title: "Error",
        description: "Failed to save proposal: " + error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    onSubmit
  };
};

export default useProposalSubmission;
