
import React from 'react';
import { Users, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";

const ViewModeToggle = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setViewMode('list')}
        className={viewMode === 'list' ? 'bg-blue-100' : ''}
      >
        <Users className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setViewMode('grid')}
        className={viewMode === 'grid' ? 'bg-blue-100' : ''}
      >
        <Grid className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewModeToggle;
