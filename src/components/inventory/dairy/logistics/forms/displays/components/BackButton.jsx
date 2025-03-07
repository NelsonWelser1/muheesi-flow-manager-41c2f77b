
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const BackButton = ({ onBack, fallbackPath = '/manage-inventory/logistics' }) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleBack} 
      className="flex items-center gap-2 hover:bg-gray-100"
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Back</span>
    </Button>
  );
};

export default BackButton;
