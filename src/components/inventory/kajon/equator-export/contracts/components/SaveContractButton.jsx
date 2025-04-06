
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "@/components/ui/notifications";
import { useCoffeeExportContract } from '@/integrations/supabase/hooks/useCoffeeExportContract';
import { v4 as uuidv4 } from 'uuid';

const SaveContractButton = ({ formData, onSuccess }) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();
  const { saveContract } = useCoffeeExportContract();

  const handleSaveContract = async () => {
    try {
      console.log("Attempting to save contract with data:", formData);
      setIsSaving(true);
      
      // Validate required fields
      if (!formData.contract_number) {
        showErrorToast(toast, "Contract number is required");
        setIsSaving(false);
        return;
      }
      
      if (!formData.contract_date) {
        showErrorToast(toast, "Contract date is required");
        setIsSaving(false);
        return;
      }
      
      if (!formData.seller_name) {
        showErrorToast(toast, "Seller name is required");
        setIsSaving(false);
        return;
      }
      
      if (!formData.buyer_name) {
        showErrorToast(toast, "Buyer name is required");
        setIsSaving(false);
        return;
      }
      
      // Create a loading toast
      const loadingToastId = showLoadingToast(toast, "Saving contract...");
      
      // Format products for database storage
      const processedProducts = formData.products.map(product => {
        // Ensure each product has a unique ID
        if (!product.id) {
          return { ...product, id: `product-${uuidv4()}` };
        }
        return product;
      });
      
      // Prepare contract data for saving
      const contractToSave = {
        ...formData,
        products: processedProducts,
        submission_id: uuidv4() // Use submission_id instead of submitted_flag
      };
      
      console.log("Saving contract with processed data:", contractToSave);
      
      // Save to Supabase using the useCoffeeExportContract hook
      const { success, error, data } = await saveContract(contractToSave);
      
      // Dismiss the loading toast
      dismissToast(loadingToastId);
      
      if (success) {
        console.log("Contract saved successfully:", data);
        showSuccessToast(toast, "Contract saved successfully");
        
        // Call the onSuccess callback if provided
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(data);
        }
      } else {
        console.error("Error saving contract:", error);
        showErrorToast(toast, `Error saving contract: ${error.message || error}`);
      }
    } catch (err) {
      console.error("Exception in handleSaveContract:", err);
      showErrorToast(toast, `An unexpected error occurred: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleSaveContract}
      disabled={isSaving}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          Save Contract
        </>
      )}
    </Button>
  );
};

export default SaveContractButton;
