
import React from 'react';
import { MapPin, Navigation } from "lucide-react";

const MapPinDisplay = ({ pinPosition, pinAddress, coordinates, isDragging }) => {
  if (!pinPosition) return null;
  
  return (
    <>
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

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <Navigation className={`h-8 w-8 ${isDragging ? 'text-green-500' : 'text-red-500'} animate-bounce`} />
      </div>
    </>
  );
};

export default MapPinDisplay;
