
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const ValidationAlert = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription>
        Please fix the validation errors below before submitting.
      </AlertDescription>
    </Alert>
  );
};

export default ValidationAlert;
