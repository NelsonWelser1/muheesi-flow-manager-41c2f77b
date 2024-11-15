import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const AuthenticationForm = ({ onAuthenticate, title }) => {
  const [managerName, setManagerName] = useState('');
  const [pin, setPin] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check for System Administrator or General Manager
    if ((managerName === 'Namanya Nelson' && pin === 'welser55055')) {
      toast({
        title: "Success",
        description: "Authentication successful",
      });
      onAuthenticate(managerName);
      return;
    }

    // Add your other authentication logic here
    // For demo purposes, we'll accept any non-empty values
    if (managerName && pin) {
      toast({
        title: "Success",
        description: "Authentication successful",
      });
      onAuthenticate(managerName);
    } else {
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="managerName">{title}</Label>
            <Input
              id="managerName"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="Enter manager name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pin">PIN</Label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Authenticate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthenticationForm;