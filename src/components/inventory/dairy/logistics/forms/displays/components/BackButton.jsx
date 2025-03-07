
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ onBack }) => {
  return (
    <Button 
      variant="outline" 
      onClick={onBack}
      className="flex items-center gap-2"
    >
      <ArrowLeft className="h-4 w-4" /> Back
    </Button>
  );
};

export default BackButton;
