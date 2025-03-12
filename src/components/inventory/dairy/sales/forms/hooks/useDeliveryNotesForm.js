
import { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useDeliveryNotesForm = () => {
  const { toast } = useToast();
  const [showNoteList, setShowNoteList] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [deliveryData, setDeliveryData] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [deliveredItems, setDeliveredItems] = useState([]);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [coordinates, setCoordinates] = useState(null);
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

  const validateAndSubmit = (data, onSuccess) => {
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
    
    console.log("Delivery note data:", finalData);
    setDeliveryData(finalData);
    
    toast({
      title: "Success",
      description: "Delivery note created successfully",
    });

    if (onSuccess) {
      onSuccess(finalData);
    }

    return true;
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
    getGeolocation,
    handleMapSelection,
    handleMapSearch,
    handleKeyPress,
    addDeliveredItem,
    removeDeliveredItem,
    validateAndSubmit
  };
};
