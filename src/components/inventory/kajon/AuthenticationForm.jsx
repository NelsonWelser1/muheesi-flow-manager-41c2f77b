
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const AuthenticationForm = ({ onAuthenticate, title, selectedLocation }) => {
  const [managerName, setManagerName] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!managerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    // In a real app, you would validate credentials here
    // For demo purposes, we're just checking if a name was provided
    
    onAuthenticate(managerName, selectedLocation);
    
    toast({
      title: 'Authentication Successful',
      description: `Welcome, ${managerName}!`,
    });
  };

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto my-8 bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4">Authentication Required</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Please enter your name to continue managing inventory at {selectedLocation}.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="managerName">{title || "Manager Name"}</Label>
          <Input
            id="managerName"
            value={managerName}
            onChange={(e) => {
              setManagerName(e.target.value);
              setError('');
            }}
            placeholder="Enter your name"
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
        
        <Button type="submit" className="w-full">
          Authenticate
        </Button>
      </form>
    </div>
  );
};

export default AuthenticationForm;
