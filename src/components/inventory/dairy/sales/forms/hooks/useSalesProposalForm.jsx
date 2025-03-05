
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useProposalsFetching } from './useProposalsFetching';
import { useProductsManagement } from './useProductsManagement';
import { useProposalSubmission } from './useProposalSubmission';

export const useSalesProposalForm = () => {
  // Get form handling from react-hook-form
  const form = useForm({
    defaultValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      proposal_date: new Date().toISOString().split('T')[0],
      validity_period: '30',
      terms_conditions: 'Payment due within 30 days of invoice date.\nPrices are subject to change based on market conditions.\nDelivery will be arranged upon confirmation of order.',
      grand_total: '0'
    }
  });

  // Get proposals fetching functionality
  const { proposals, isLoading, fetchProposals } = useProposalsFetching();

  // Get product management with callback to update form's grand total
  const { products, setProducts, handleProductChange, addProduct, removeProduct } = 
    useProductsManagement((grandTotal) => form.setValue('grand_total', grandTotal));

  // Form reset function to pass to submission hook
  const resetForm = () => {
    form.reset({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      proposal_date: new Date().toISOString().split('T')[0],
      validity_period: '30',
      terms_conditions: 'Payment due within 30 days of invoice date.\nPrices are subject to change based on market conditions.\nDelivery will be arranged upon confirmation of order.',
      grand_total: '0'
    });
    setProducts([{ 
      name: '', 
      category: '', 
      base_price: '', 
      discount: '0', 
      final_price: '0' 
    }]);
  };

  // Get submission functionality
  const { isSubmitting, submitProposal } = useProposalSubmission(resetForm);

  // Handle form submission
  const onSubmit = async (data) => {
    await submitProposal(data, products, fetchProposals);
  };

  // Debug function to log current state
  const debugState = () => {
    console.log('Current form values:', form.getValues());
    console.log('Current products:', products);
    return { form: form.getValues(), products };
  };

  return {
    proposals,
    isLoading,
    isSubmitting,
    form,
    products,
    setProducts,
    handleProductChange,
    addProduct,
    removeProduct,
    onSubmit,
    fetchProposals,
    debugState
  };
};

export default useSalesProposalForm;
