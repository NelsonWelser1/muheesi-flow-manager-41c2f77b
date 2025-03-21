
import React from 'react';
import { Button } from "@/components/ui/button";

export const LoadingState = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export const ErrorState = ({ error, refreshData }) => {
  return (
    <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
      <h3 className="font-bold mb-2">Error loading report data</h3>
      <p>{error.message || "An unknown error occurred"}</p>
      <Button 
        variant="outline" 
        className="mt-2" 
        onClick={refreshData}
      >
        Retry
      </Button>
    </div>
  );
};
