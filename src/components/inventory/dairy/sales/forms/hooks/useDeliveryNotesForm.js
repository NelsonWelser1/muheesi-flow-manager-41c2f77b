
import { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useDeliveryNotes } from '@/integrations/supabase/hooks/sales/useDeliveryNotes';

export const useDeliveryNotesForm = () => {
  const { toast } = useToast();
  const { createDeliveryNote, fetchDeliveryNotes } = useDeliveryNotes();
  const [showNoteList, setShowNoteList] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [deliveryData, setDeliveryData] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [deliveredItems, setDeliveredItems] = useState([]);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchInputRef = useRef(null);
  
  const getGeolocation = () => {
    setShowMap(true);
  };

  const handleMapSelection = (address, coords) => {
    setCoordinates(coords);
    setShowMap(false);
    
    toast({
      title: "Location Added",
      description: `Address captured: ${address}`,
    });

    return address;
  };

  const handleMapSearch = () => {
    if (mapSearchQuery.trim()) {
      const mapElement = document.getElementById('google-map-iframe');
      if (mapElement) {
        const encodedQuery = encodeURIComponent(mapSearchQuery);
        mapElement.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedQuery}`;
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleMapSearch();
    }
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
    
    const finalData = {
      ...data,
      deliveredItems: deliveredItems,
      coordinates: coordinates
    };
    
    console.log("Delivery note data to be submitted:", finalData);

    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      const { success, data: savedData, error } = await createDeliveryNote(finalData);
      
      if (success) {
        setDeliveryData(savedData);
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

  // Function for debugging - can be attached to a button
  const debugFormData = (data) => {
    console.log("Current form data:", {
      formData: data,
      deliveredItems,
      coordinates
    });
    
    toast({
      title: "Debug Info",
      description: "Form data printed to console",
    });
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
    showMap,
    setShowMap,
    deliveredItems,
    mapSearchQuery,
    setMapSearchQuery,
    coordinates,
    searchInputRef,
    isSubmitting,
    getGeolocation,
    handleMapSelection,
    handleMapSearch,
    handleKeyPress,
    addDeliveredItem,
    removeDeliveredItem,
    validateAndSubmit,
    debugFormData,
    loadDeliveryNotes
  };
};
