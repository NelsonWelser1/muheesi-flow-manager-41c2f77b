
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const AuthenticationForm = ({ onAuthenticate, title }) => {
  const [managerName, setManagerName] = useState('');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailVerification, setIsEmailVerification] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Initial check for System Administrator
    if (managerName === 'Namanya Nelson' && pin === 'Welsar55055') {
      // Verify email matches the one in JSON data
      if (email === 'nelsonwelser1@gmail.com') {
        // Store login details in localStorage
        const loginDetails = {
          userId: '0af319fd-05ce-4687-bf8e-74a14e6ab126',
          username: managerName,
          loginTime: new Date().toISOString(),
          role: 'System Administrator',
          email: email,
          lastSignIn: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(loginDetails));
        
        toast({
          title: "Success",
          description: "Authentication successful as System Administrator",
        });
        onAuthenticate(managerName);
        return;
      } else {
        setIsEmailVerification(true);
        toast({
          title: "Verification Required",
          description: "Please enter your registered email address for verification",
        });
        return;
      }
    }

    // Authentication failed
    toast({
      title: "Error",
      description: "Invalid credentials. Please try again.",
      variant: "destructive",
    });
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
          {isEmailVerification && (
            <div className="space-y-2">
              <Label htmlFor="email">Email Verification</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
              />
            </div>
          )}
          <Button type="submit" className="w-full">
            {isEmailVerification ? "Verify & Authenticate" : "Authenticate"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthenticationForm;

