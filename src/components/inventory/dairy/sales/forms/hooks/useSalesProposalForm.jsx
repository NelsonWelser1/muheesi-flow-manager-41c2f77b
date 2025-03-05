
import { useForm } from "react-hook-form";
import { useProposalInitialization } from "./useProposalInitialization";
import { useProductSelection } from "./useProductSelection";
import { useProposalSubmission } from "./useProposalSubmission";

export const useSalesProposalForm = () => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  
  // Initialize the proposal with a unique ID
  const { proposalId, currency, setCurrency } = useProposalInitialization(setValue);
  
  // Product selection and management
  const { 
    loading, 
    products, 
    selectedProducts, 
    setSelectedProducts,
    handleProductSelect, 
    handlePriceChange, 
    handleAddProduct, 
    removeProduct, 
    calculateGrandTotal, 
    formatCurrency, 
    parseCurrency 
  } = useProductSelection(setValue, watch, currency);
  
  // Form submission
  const { submitting, onSubmit } = useProposalSubmission(
    reset, 
    selectedProducts, 
    setSelectedProducts, 
    calculateGrandTotal, 
    setValue
  );

  return {
    register,
    handleSubmit,
    errors,
    loading,
    submitting,
    products,
    selectedProducts,
    currency,
    setCurrency,
    proposalId,
    handleProductSelect,
    handlePriceChange,
    handleAddProduct,
    removeProduct,
    onSubmit,
    calculateGrandTotal,
    formatCurrency,
    setValue,
    watch,
  };
};

export default useSalesProposalForm;
