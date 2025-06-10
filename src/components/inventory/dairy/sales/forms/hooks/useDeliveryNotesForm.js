
import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useDeliveryNotes } from '@/integrations/supabase/hooks/sales/useDeliveryNotes';
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const useDeliveryNotesForm = () => {
  const { toast } = useToast();
  const { createDeliveryNote, fetchDeliveryNotes } = useDeliveryNotes();
  const [showNoteList, setShowNoteList] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [deliveryData, setDeliveryData] = useState(null);
  const [deliveredItems, setDeliveredItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const searchInputRef = useRef(null);

  const refreshDeliveryNotes = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Refreshing",
      description: "Fetching latest delivery notes...",
    });
  };

  const addDeliveredItem = (newItem) => {
    setDeliveredItems([...deliveredItems, newItem]);
    
    toast({
      title: "Item Added",
      description: `${newItem.quantity} ${newItem.unit} of ${newItem.name} added to delivery note`,
    });
  };

  const removeDeliveredItem = (index) => {
    const updatedItems = deliveredItems.filter((_, i) => i !== index);
    setDeliveredItems(updatedItems);
    
    toast({
      title: "Item Removed",
      description: "Item removed from delivery note",
    });
  };

  const validateAndSubmit = async (data) => {
    if (deliveredItems.length === 0) {
      toast({
        title: "Missing Items",
        description: "Please add at least one item to the delivery note",
        variant: "destructive"
      });
      return false;
    }
    
    // Prepare data for submission
    const finalData = {
      ...data,
      deliveredItems: deliveredItems,
    };
    
    console.log("Delivery note data to be submitted:", finalData);

    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      const { success, data: savedData, error } = await createDeliveryNote(finalData);
      
      if (success) {
        setDeliveryData(savedData);
        setDeliveredItems([]); // Clear items after successful submission
        toast({
          title: "Success",
          description: "Delivery note created and saved to database",
        });
        return true;
      } else {
        console.error("Error saving delivery note:", error);
        toast({
          title: "Error",
          description: "Failed to save delivery note to database",
          variant: "destructive"
        });
        return false;
      }
    } catch (err) {
      console.error("Unexpected error during submission:", err);
      toast({
        title: "Unexpected Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load delivery notes from database
  const loadDeliveryNotes = async () => {
    try {
      await fetchDeliveryNotes();
      console.log("Delivery notes loaded from database");
    } catch (err) {
      console.error("Error loading delivery notes:", err);
    }
  };

  return {
    showNoteList,
    setShowNoteList,
    showQRCode,
    setShowQRCode,
    deliveryData,
    deliveredItems,
    isSubmitting,
    refreshTrigger,
    refreshDeliveryNotes,
    addDeliveredItem,
    removeDeliveredItem,
    validateAndSubmit,
    loadDeliveryNotes
  };
};
