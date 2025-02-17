
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ValidationError = ({ error, onSwitchTank }) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{error.title}</AlertTitle>
      <AlertDescription className="mt-2">
        {error.description}
        {error.suggestedTank && (
          <div className="mt-2">
            <Button
              variant="outline"
              onClick={() => onSwitchTank(error.suggestedTank)}
            >
              Switch to {error.suggestedTank}
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};
