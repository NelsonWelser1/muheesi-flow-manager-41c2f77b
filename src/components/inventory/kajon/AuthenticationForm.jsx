
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const AuthenticationForm = ({ onAuthenticate, title, selectedLocation }) => {
  const [managerName, setManagerName] = useState('');
  const [pin, setPin] = useState('');
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset errors
    const newErrors = {};
    
    // Validate both fields
    if (!managerName.trim()) {
      newErrors.managerName = 'Please enter your name';
    }
    
    if (!pin.trim()) {
      newErrors.pin = 'Please enter your PIN';
    } else if (pin.trim().length < 4) {
      newErrors.pin = 'PIN must be at least 4 characters';
    }
    
    // If there are errors, display them and stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // In a real app, you would validate credentials here
    // For demo purposes, we're just checking if both fields are provided
    
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
        Please enter your credentials to continue managing inventory at {selectedLocation}.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="managerName">{title || "Manager Name"}</Label>
          <Input
            id="managerName"
            value={managerName}
            onChange={(e) => {
              setManagerName(e.target.value);
              setErrors({...errors, managerName: ''});
            }}
            placeholder="Enter your name"
            className={errors.managerName ? "border-red-500" : ""}
          />
          {errors.managerName && <p className="text-sm text-red-500 mt-1">{errors.managerName}</p>}
        </div>
        
        <div>
          <Label htmlFor="pin">Security PIN</Label>
          <Input
            id="pin"
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setErrors({...errors, pin: ''});
            }}
            placeholder="Enter your PIN"
            className={errors.pin ? "border-red-500" : ""}
          />
          {errors.pin && <p className="text-sm text-red-500 mt-1">{errors.pin}</p>}
        </div>
        
        <Button type="submit" className="w-full">
          Authenticate
        </Button>
      </form>
    </div>
  );
};

export default AuthenticationForm;
