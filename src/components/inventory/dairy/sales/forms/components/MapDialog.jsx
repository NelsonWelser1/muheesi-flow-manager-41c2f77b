
import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  return (
    <Dialog open={showMap} onOpenChange={setShowMap}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
          <DialogDescription>
            Search for a location or drop a pin on the map to select an address.
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
        
        <div className="h-[500px] w-full">
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
        </div>
        <div className="flex justify-between mt-3">
          <Button variant="outline" onClick={() => setShowMap(false)}>Cancel</Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                if (mapSearchQuery.trim()) {
                  handleMapSelection(mapSearchQuery);
                } else {
                  handleMapSelection("Kampala, Uganda");
                }
              }}
            >
              Use Current View
            </Button>
            <Button onClick={() => handleMapSelection(mapSearchQuery || "Kampala, Uganda")}>
              Drop Pin Here
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;
