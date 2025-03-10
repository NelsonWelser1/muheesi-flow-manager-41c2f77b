
import React from 'react';
import { Label } from "@/components/ui/label";

const FormField = ({ 
  label, 
  error, 
  children, 
  className = "space-y-2" 
}) => {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FormField;
