
import { useForm } from "react-hook-form";
import { useProposalInitialization } from "./useProposalInitialization";
import { useProductSelection } from "./useProductSelection";
import { useProposalSubmission } from "./useProposalSubmission";
import { useProductsManagement } from "./useProductsManagement";

export const useSalesProposalForm = () => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  
  // Initialize the proposal with a unique ID
  const { proposalId } = useProposalInitialization(setValue);
  
  // Products management with automatic grand total calculation
  const {
    products,
    setProducts,
    handleProductChange,
    addProduct,
    removeProduct,
    updateGrandTotal,
    currency,
    setCurrency,
    cycleCurrency,
    currencies
  } = useProductsManagement();
  
  // Form submission
  const { isSubmitting, onSubmit } = useProposalSubmission(reset, products, currency);

  // Debug function
  const debugState = () => {
    console.log("Current state:", {
      products,
      currency,
      grandTotal: updateGrandTotal()
    });
    
    return {
      products,
      currency,
      grandTotal: updateGrandTotal()
    };
  };

  return {
    form: { register, handleSubmit, formState: { errors } },
    products,
    setProducts,
    handleProductChange,
    addProduct,
    removeProduct,
    onSubmit,
    isSubmitting,
    debugState,
    currency,
    setCurrency,
    cycleCurrency,
    currencies
  };
};

export default useSalesProposalForm;
