
import React from 'react';
import { Move } from "lucide-react";
import { Button } from "@/components/ui/button";

const MapActionButtons = ({ 
  setShowMap, 
  pinPosition, 
  isDragging, 
  toggleDragMode, 
  useCurrentView, 
  dropPin 
}) => {
  return (
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
  );
};

export default MapActionButtons;
