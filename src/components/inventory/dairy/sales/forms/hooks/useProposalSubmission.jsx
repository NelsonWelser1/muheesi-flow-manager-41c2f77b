
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useProposalSubmission = (resetFormFunc) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Handle form submission
  const submitProposal = async (formData, products, fetchProposals) => {
    console.log('Form data to submit:', { formData, products });
    
    // Validate products
    if (products.some(product => !product.name || !product.base_price)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required product fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a unique proposal ID
      const proposalId = `PRO-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Get current user (will be null if no auth)
      const { data: userData } = await supabase.auth.getUser();
      
      // Prepare data for submission
      const formattedData = {
        proposal_id: proposalId,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email || null,
        customer_phone: formData.customer_phone || null,
        proposal_date: formData.proposal_date,
        validity_period: parseInt(formData.validity_period),
        terms_conditions: formData.terms_conditions,
        products: products,
        grand_total: parseFloat(formData.grand_total),
        status: 'draft',
        created_by: userData?.user?.id || null
      };

      console.log('Submitting to Supabase:', formattedData);

      // Insert into Supabase
      const { error } = await supabase
        .from('sales_proposals')
        .insert([formattedData]);

      if (error) throw error;

      console.log('Sales proposal created successfully');
      toast({
        title: "Success",
        description: "Sales proposal created successfully"
      });

      // Reset form and fetch updated data
      if (resetFormFunc) {
        resetFormFunc();
      }
      
      // Refresh proposals list if callback provided
      if (fetchProposals) {
        fetchProposals();
      }
    } catch (error) {
      console.error('Error creating sales proposal:', error);
      toast({
        title: "Error",
        description: "Failed to create sales proposal: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitProposal
  };
};

export default useProposalSubmission;
