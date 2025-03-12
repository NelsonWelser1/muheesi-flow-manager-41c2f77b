
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import MapSearchBar from './map/MapSearchBar';
import MapContainer from './map/MapContainer';
import MapActionButtons from './map/MapActionButtons';
import useMapInteraction from './map/useMapInteraction';

const MapDialog = ({ 
  showMap, 
  setShowMap, 
  handleMapSelection
}) => {
  const searchInputRef = useRef(null);
  
  const {
    pinPosition,
    pinAddress,
    isDragging,
    coordinates,
    mapSearchQuery,
    setMapSearchQuery,
    handleMapSearch,
    handleKeyPress,
    dropPin,
    toggleDragMode,
    useCurrentView,
    handlePinDrag
  } = useMapInteraction(showMap, setShowMap, searchInputRef, handleMapSelection);

  return (
    <Dialog open={showMap} onOpenChange={setShowMap}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
          <DialogDescription>
            Search for a location, click "Drop Pin Here" to select an address, then use "Toggle Drag Mode" to fine-tune the position.
          </DialogDescription>
        </DialogHeader>
        
        <MapSearchBar 
          searchInputRef={searchInputRef}
          mapSearchQuery={mapSearchQuery}
          setMapSearchQuery={setMapSearchQuery}
          handleKeyPress={handleKeyPress}
          handleMapSearch={handleMapSearch}
        />
        
        <MapContainer 
          isDragging={isDragging}
          handlePinDrag={handlePinDrag}
          pinPosition={pinPosition}
          pinAddress={pinAddress}
          coordinates={coordinates}
        />
        
        <MapActionButtons 
          setShowMap={setShowMap}
          pinPosition={pinPosition}
          isDragging={isDragging}
          toggleDragMode={toggleDragMode}
          useCurrentView={useCurrentView}
          dropPin={dropPin}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;
