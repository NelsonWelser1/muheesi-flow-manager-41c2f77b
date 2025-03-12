
import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MapSearchBar = ({ 
  searchInputRef, 
  mapSearchQuery, 
  setMapSearchQuery, 
  handleKeyPress, 
  handleMapSearch 
}) => {
  return (
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
  );
};

export default MapSearchBar;
