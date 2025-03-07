
import React from 'react';
import { Button } from "@/components/ui/button";

const FormActions = ({ onReset }) => {
  return (
    <div className="flex gap-2">
      <Button type="submit" className="w-full">Submit Delivery Record</Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onReset}
      >
        Reset Form
      </Button>
    </div>
  );
};

export default FormActions;
