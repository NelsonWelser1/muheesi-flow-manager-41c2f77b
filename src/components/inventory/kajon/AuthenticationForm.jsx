
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Supervisor data with their corresponding locations and PINs
const SUPERVISORS = [
  { name: "Annatory Bikwatsibwa mukama", location: "Kanoni-Mbogo", pin: "12345Field" },
  { name: "Eliab Twesigye", location: "Engari-Kaichumu", pin: "67890Farms" },
  { name: "Master Nankunda silver", location: "Engari-Kyengando", pin: "34567Crops" },
  { name: "Bamuhimbitse Henry Kashagire", location: "Migina", pin: "81234Grain" },
  { name: "Gerald Ssoka", location: "Kyampangara", pin: "23451Harvest" },
  { name: "Namanya Justus", location: "Nkungu", pin: "98765Plows" },
  { name: "Mweteise Justus", location: "Buremba", pin: "76543Rural" },
  { name: "Barugahare Steven", location: "Kazo Town council", pin: "45678Weeds" },
  { name: "Rev Katebarirwe Geoffrey", location: "Kazo Town council", pin: "34512Soily" },
  { name: "Alex Muwawu", location: "Burunga", pin: "12354Grows" },
  { name: "Kenneth", location: "Rwemikoma", pin: "54321Seeds" },
  // Adding system administrators who can access all locations
  { name: "Namanya Nelson", location: "ALL", pin: "welser55055" }
];

const AuthenticationForm = ({ onAuthenticate, title, selectedLocation }) => {
  const [managerName, setManagerName] = useState('');
  const [pin, setPin] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const { toast } = useToast();

  // Normalize a string for comparison (remove case sensitivity and extra spaces)
  const normalizeString = (str) => {
    return str.toLowerCase().trim();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check for system administrator
    const isSystemAdmin = SUPERVISORS.some(
      admin => normalizeString(admin.name) === normalizeString("Namanya Nelson") && 
              admin.pin === "welser55055" && 
              normalizeString(pin) === normalizeString("welser55055")
    );

    if (isSystemAdmin && normalizeString(managerName) === normalizeString("Namanya Nelson")) {
      toast({
        title: "Success",
        description: "System Administrator authentication successful",
      });
      onAuthenticate(managerName, selectedLocation);
      return;
    }

    // Check if supervisor exists and has access to the selected location
    const authorizedSupervisor = SUPERVISORS.find(supervisor => {
      return normalizeString(supervisor.name) === normalizeString(managerName) && 
             supervisor.pin === pin &&
             (supervisor.location === selectedLocation || supervisor.location === "ALL");
    });

    if (authorizedSupervisor) {
      toast({
        title: "Success",
        description: "Authentication successful",
      });
      onAuthenticate(managerName, selectedLocation);
    } else {
      // Check if supervisor exists but entered wrong PIN
      const supervisorExists = SUPERVISORS.find(
        supervisor => normalizeString(supervisor.name) === normalizeString(managerName) &&
                      (supervisor.location === selectedLocation || supervisor.location === "ALL")
      );

      if (supervisorExists) {
        toast({
          title: "Error",
          description: "Invalid PIN. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "You are not authorized to access this location.",
          variant: "destructive",
        });
      }
    }
  };

  const handleChangePin = (e) => {
    e.preventDefault();
    
    // Find the supervisor
    const supervisorIndex = SUPERVISORS.findIndex(
      supervisor => normalizeString(supervisor.name) === normalizeString(managerName) && 
                    supervisor.pin === pin &&
                    (supervisor.location === selectedLocation || supervisor.location === "ALL")
    );

    if (supervisorIndex === -1) {
      toast({
        title: "Error",
        description: "Current credentials are incorrect.",
        variant: "destructive",
      });
      return;
    }

    if (newPin !== confirmNewPin) {
      toast({
        title: "Error",
        description: "New PINs do not match.",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would update the database
    // For this demo, we'll update the local array
    SUPERVISORS[supervisorIndex].pin = newPin;

    toast({
      title: "Success",
      description: "PIN updated successfully. Please log in with your new PIN.",
    });

    // Reset form and state
    setIsChangingPin(false);
    setPin('');
    setNewPin('');
    setConfirmNewPin('');
  };

  if (isChangingPin) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <form onSubmit={handleChangePin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="managerName">Supervisor Name</Label>
              <Input
                id="managerName"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="Enter supervisor name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPin">Current PIN</Label>
              <Input
                id="currentPin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter current PIN"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPin">New PIN</Label>
              <Input
                id="newPin"
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Enter new PIN"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPin">Confirm New PIN</Label>
              <Input
                id="confirmNewPin"
                type="password"
                value={confirmNewPin}
                onChange={(e) => setConfirmNewPin(e.target.value)}
                placeholder="Confirm new PIN"
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Update PIN
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsChangingPin(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="managerName">{title} for {selectedLocation}</Label>
            <Input
              id="managerName"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="Enter supervisor name"
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
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => setIsChangingPin(true)}
          >
            Change PIN
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthenticationForm;
