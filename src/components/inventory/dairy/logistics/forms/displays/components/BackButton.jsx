
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ onBack }) => {
  return (
    <Button 
      variant="outline" 
      onClick={onBack}
      className="flex items-center gap-2 hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" /> Back
    </Button>
  );
};

export default BackButton;
