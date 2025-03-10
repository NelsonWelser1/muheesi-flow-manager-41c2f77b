
import React, { useState, useEffect } from 'react';
import { Search, MapPin } from "lucide-react";
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
    // Get detailed address using Geocoding API
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(mapSearchQuery)}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const formattedAddress = result.formatted_address;
          
          // Set the pin position and address
          setPinPosition(result.geometry.location);
          setPinAddress(formattedAddress);
          
          toast({
            title: "Pin Dropped",
            description: `Location: ${formattedAddress}`,
          });
        } else {
          toast({
            title: "Location Not Found",
            description: "Please try a different search term.",
            variant: "destructive"
          });
        }
      })
      .catch(error => {
        console.error("Geocoding error:", error);
        toast({
          title: "Error",
          description: "Failed to get location details. Please try again.",
          variant: "destructive"
        });
      });
  };
  
  const useCurrentView = () => {
    if (mapSearchQuery.trim()) {
      // Get address details from search query
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(mapSearchQuery)}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`)
        .then(response => response.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            const formattedAddress = data.results[0].formatted_address;
            handleMapSelection(formattedAddress);
          } else {
            handleMapSelection(mapSearchQuery);
          }
        })
        .catch(() => {
          handleMapSelection(mapSearchQuery);
        });
    } else {
      handleMapSelection("Kampala, Uganda");
    }
  };

  return (
    <Dialog open={showMap} onOpenChange={setShowMap}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
          <DialogDescription>
            Search for a location, then click "Drop Pin Here" to select an exact address.
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
        
        <div className="h-[500px] w-full relative">
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
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="font-medium">Dropped Pin</span>
              </div>
              <p className="mt-1 text-gray-700 truncate">{pinAddress}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-3">
          <Button variant="outline" onClick={() => setShowMap(false)}>Cancel</Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={useCurrentView}
            >
              Use Current View
            </Button>
            <Button 
              onClick={() => {
                dropPin();
                if (pinAddress) {
                  handleMapSelection(pinAddress);
                } else if (mapSearchQuery.trim()) {
                  handleMapSelection(mapSearchQuery);
                } else {
                  handleMapSelection("Kampala, Uganda");
                }
              }}
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
