
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Move } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const MapDialog = ({ 
  showMap, 
  setShowMap, 
  mapSearchQuery, 
  setMapSearchQuery, 
  handleMapSearch, 
  handleKeyPress, 
  handleMapSelection,
  searchInputRef 
}) => {
  const { toast } = useToast();
  const [pinPosition, setPinPosition] = useState(null);
  const [pinAddress, setPinAddress] = useState('');
  const [mapIframe, setMapIframe] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const mapContainerRef = useRef(null);
  
  useEffect(() => {
    // Initialize map iframe when dialog opens
    if (showMap) {
      const iframe = document.getElementById('google-map-iframe');
      setMapIframe(iframe);
      
      // Listen for messages from the iframe (if using postMessage API)
      window.addEventListener('message', handleMapMessage);
      
      return () => {
        window.removeEventListener('message', handleMapMessage);
      };
    }
  }, [showMap]);
  
  const handleMapMessage = (event) => {
    // This would handle messages from the map iframe if using postMessage API
    if (event.data && event.data.type === 'MAP_CLICK') {
      setPinPosition(event.data.position);
      setPinAddress(event.data.address);
    }
  };
  
  const dropPin = () => {
    // Extract coordinates from the map URL
    try {
      const iframe = document.getElementById('google-map-iframe');
      if (iframe && iframe.src) {
        const urlParams = new URL(iframe.src).searchParams;
        const qParam = urlParams.get('q');
        
        // If the q parameter has coordinates
        if (qParam && qParam.includes(',')) {
          const [lat, lng] = qParam.split(',').map(coord => parseFloat(coord.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
            setCoordinates({ lat, lng });
          }
        }
      }
    } catch (error) {
      console.error("Error extracting coordinates:", error);
    }
    
    // Get detailed address using Geocoding API
    const searchLocation = mapSearchQuery || 'Kampala, Uganda';
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchLocation)}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const formattedAddress = result.formatted_address;
          
          // Set the pin position and address
          const position = result.geometry.location;
          setPinPosition(position);
          setPinAddress(formattedAddress);
          
          // Update coordinates
          if (position) {
            setCoordinates({ lat: position.lat, lng: position.lng });
          }
          
          toast({
            title: "Pin Dropped",
            description: `Location: ${formattedAddress}`,
          });
        } else {
          toast({
            title: "Location Not Found",
            description: "Please try a different search term or enable billing for the Google Maps API.",
            variant: "destructive"
          });
        }
      })
      .catch(error => {
        console.error("Geocoding error:", error);
        toast({
          title: "Error",
          description: "Failed to get location details. Make sure Google Maps API billing is enabled.",
          variant: "destructive"
        });
      });
  };
  
  const toggleDragMode = () => {
    setIsDragging(!isDragging);
    
    if (!isDragging) {
      toast({
        title: "Drag Mode Enabled",
        description: "You can now drag the pin to set the exact location.",
      });
    } else {
      // When disabling drag mode, update the address based on the new position
      if (coordinates.lat && coordinates.lng) {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat},${coordinates.lng}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`)
          .then(response => response.json())
          .then(data => {
            if (data.results && data.results.length > 0) {
              const formattedAddress = data.results[0].formatted_address;
              setPinAddress(formattedAddress);
              
              toast({
                title: "Location Updated",
                description: `New location: ${formattedAddress}`,
              });
            }
          })
          .catch(err => console.error("Error getting address from coordinates:", err));
      }
    }
  };
  
  const updateLocationFromDrag = (newLat, newLng) => {
    // Update coordinates
    setCoordinates({ lat: newLat, lng: newLng });
    
    // Update the iframe source to show the new location
    const iframe = document.getElementById('google-map-iframe');
    if (iframe) {
      iframe.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${newLat},${newLng}`;
    }
    
    // Get address from coordinates
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${newLat},${newLng}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const formattedAddress = data.results[0].formatted_address;
          setPinAddress(formattedAddress);
        }
      })
      .catch(err => console.error("Error getting address from coordinates:", err));
  };
  
  const useCurrentView = () => {
    if (pinAddress) {
      // Send both address and coordinates to parent component
      handleMapSelection(pinAddress, coordinates);
    } else if (mapSearchQuery.trim()) {
      // Get address details from search query
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(mapSearchQuery)}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`)
        .then(response => response.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            const formattedAddress = data.results[0].formatted_address;
            const position = data.results[0].geometry.location;
            handleMapSelection(formattedAddress, position);
          } else {
            handleMapSelection(mapSearchQuery, null);
          }
        })
        .catch(() => {
          handleMapSelection(mapSearchQuery, null);
        });
    } else {
      handleMapSelection("Kampala, Uganda", null);
    }
  };

  // Simulated drag functionality (in a real implementation, this would use a proper Maps API)
  const handlePinDrag = (e) => {
    if (isDragging && mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      // Simulate new coordinates based on relative position in the container
      // This is a simplified approximation
      const lat = coordinates.lat ? coordinates.lat + (y - 0.5) * 0.02 : 0;
      const lng = coordinates.lng ? coordinates.lng + (x - 0.5) * 0.02 : 0;
      
      updateLocationFromDrag(lat, lng);
    }
  };

  return (
    <Dialog open={showMap} onOpenChange={setShowMap}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
          <DialogDescription>
            Search for a location, click "Drop Pin Here" to select an address, then use "Toggle Drag Mode" to fine-tune the position.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              ref={searchInputRef}
              className="pl-9" 
              placeholder="Search for a location..." 
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          <Button onClick={handleMapSearch}>Search</Button>
        </div>
        
        <div 
          className="h-[500px] w-full relative" 
          ref={mapContainerRef}
          onMouseMove={isDragging ? handlePinDrag : null}
        >
          <iframe 
            id="google-map-iframe"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Kampala,Uganda" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          
          {pinPosition && (
            <div className="absolute top-2 left-2 bg-white p-2 rounded-md shadow-md max-w-[300px] text-sm">
              <div className="flex items-center gap-2">
                <MapPin className={`h-4 w-4 ${isDragging ? 'text-green-500' : 'text-red-500'}`} />
                <span className="font-medium">
                  {isDragging ? 'Draggable Pin' : 'Dropped Pin'} 
                  {coordinates.lat && coordinates.lng ? ` (${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)})` : ''}
                </span>
              </div>
              <p className="mt-1 text-gray-700 truncate">{pinAddress}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-3">
          <Button variant="outline" onClick={() => setShowMap(false)}>Cancel</Button>
          <div className="flex gap-2">
            {pinPosition && (
              <Button 
                variant="outline" 
                onClick={toggleDragMode}
                className={isDragging ? "bg-green-100" : ""}
              >
                <Move className="h-4 w-4 mr-2" />
                {isDragging ? 'Save Position' : 'Toggle Drag Mode'}
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={useCurrentView}
            >
              Use Current View
            </Button>
            <Button 
              onClick={dropPin}
              className="bg-[#0000a0] hover:bg-[#00008b]"
            >
              Drop Pin Here
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;
