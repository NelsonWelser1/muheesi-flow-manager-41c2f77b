
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { getAddressFromCoordinates, getCoordinatesFromAddress } from './mapUtils';

const useMapInteraction = (showMap, setShowMap, searchInputRef, handleMapSelection) => {
  const { toast } = useToast();
  const [pinPosition, setPinPosition] = useState(null);
  const [pinAddress, setPinAddress] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [mapIframe, setMapIframe] = useState(null);

  useEffect(() => {
    if (showMap) {
      const iframe = document.getElementById('google-map-iframe');
      setMapIframe(iframe);
      
      window.addEventListener('message', handleMapMessage);
      
      if (searchInputRef && searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current.focus();
        }, 300);
      }
      
      return () => {
        window.removeEventListener('message', handleMapMessage);
      };
    }
  }, [showMap, searchInputRef]);

  const handleMapMessage = (event) => {
    if (event.data && event.data.type === 'MAP_CLICK') {
      setPinPosition(event.data.position);
      setPinAddress(event.data.address);
    }
  };

  const dropPin = async () => {
    try {
      // Extract coordinates from the map URL
      const iframe = document.getElementById('google-map-iframe');
      if (iframe && iframe.src) {
        const urlParams = new URL(iframe.src).searchParams;
        const qParam = urlParams.get('q');
        
        if (qParam && qParam.includes(',')) {
          const [lat, lng] = qParam.split(',').map(coord => parseFloat(coord.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
            setCoordinates({ lat, lng });
          }
        }
      }
      
      // Get detailed address using Geocoding API
      const searchLocation = document.getElementById('google-map-iframe').src.split('q=')[1];
      const locationData = await getCoordinatesFromAddress(searchLocation);
      
      if (locationData) {
        const position = locationData.position;
        setPinPosition(position);
        setPinAddress(locationData.address);
        
        // Update coordinates
        if (position) {
          setCoordinates({ lat: position.lat, lng: position.lng });
        }
        
        toast({
          title: "Pin Dropped",
          description: `Location: ${locationData.address}`,
        });
      } else {
        toast({
          title: "Location Not Found",
          description: "Please try a different search term or enable billing for the Google Maps API.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error dropping pin:", error);
      toast({
        title: "Error",
        description: "Failed to get location details. Make sure Google Maps API billing is enabled.",
        variant: "destructive"
      });
    }
  };

  const toggleDragMode = async () => {
    setIsDragging(!isDragging);
    
    if (!isDragging) {
      toast({
        title: "Drag Mode Enabled",
        description: "You can now drag the pin to set the exact location.",
      });
    } else {
      // When disabling drag mode, update the address based on the new position
      if (coordinates.lat && coordinates.lng) {
        const address = await getAddressFromCoordinates(coordinates.lat, coordinates.lng);
        if (address) {
          setPinAddress(address);
          
          toast({
            title: "Location Updated",
            description: `New location: ${address}`,
          });
        }
      }
    }
  };

  const updateLocationFromDrag = async (newLat, newLng) => {
    // Update coordinates
    setCoordinates({ lat: newLat, lng: newLng });
    
    // Update the iframe source to show the new location
    const iframe = document.getElementById('google-map-iframe');
    if (iframe) {
      iframe.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${newLat},${newLng}`;
    }
    
    // Get address from coordinates
    const address = await getAddressFromCoordinates(newLat, newLng);
    if (address) {
      setPinAddress(address);
    }
  };

  const useCurrentView = async () => {
    if (pinAddress) {
      // Send both address and coordinates to parent component
      handleMapSelection(pinAddress, coordinates);
    } else {
      // Get current iframe URL
      const iframe = document.getElementById('google-map-iframe');
      if (iframe && iframe.src) {
        const urlParams = new URL(iframe.src).searchParams;
        const qParam = urlParams.get('q');
        
        // Try to get the location details from the current map view
        const locationData = await getCoordinatesFromAddress(qParam);
        if (locationData) {
          handleMapSelection(locationData.address, locationData.position);
        } else {
          handleMapSelection(qParam || "Kampala, Uganda", null);
        }
      } else {
        handleMapSelection("Kampala, Uganda", null);
      }
    }
  };

  const handlePinDrag = (e, mapContainerRef) => {
    if (isDragging && mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      // Simulate new coordinates based on relative position in the container
      const lat = coordinates.lat ? coordinates.lat + (y - 0.5) * 0.02 : 0;
      const lng = coordinates.lng ? coordinates.lng + (x - 0.5) * 0.02 : 0;
      
      updateLocationFromDrag(lat, lng);
    }
  };

  return {
    pinPosition,
    pinAddress,
    isDragging,
    coordinates,
    toggleDragMode,
    useCurrentView,
    dropPin,
    handlePinDrag
  };
};

export default useMapInteraction;
