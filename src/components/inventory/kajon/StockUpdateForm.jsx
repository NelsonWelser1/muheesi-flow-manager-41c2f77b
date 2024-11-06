import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import LocationField from './form-fields/LocationField';
import CoffeeTypeField from './form-fields/CoffeeTypeField';
import PriceQuantityFields from './form-fields/PriceQuantityFields';

const StockUpdateForm = ({ 
  currentUser, 
  verificationStep, 
  pin, 
  onPinChange, 
  onBack,
  actionType 
}) => {
  const [selectedCoffeeType, setSelectedCoffeeType] = React.useState('');
  const [newLocation, setNewLocation] = React.useState('');
  const [showNewLocation, setShowNewLocation] = React.useState(false);

  if (verificationStep) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="pin">Enter PIN for Verification</Label>
          <Input
            id="pin"
            type="password"
            value={pin}
            onChange={(e) => onPinChange(e.target.value)}
            placeholder="Enter your PIN"
            required
          />
        </div>
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <>
      <div>
        <Label htmlFor="manager">Store/Warehouse Manager</Label>
        <Input id="manager" value={currentUser.name} disabled />
      </div>
      
      <LocationField 
        showNewLocation={showNewLocation}
        setShowNewLocation={setShowNewLocation}
        newLocation={newLocation}
        setNewLocation={setNewLocation}
        actionType={actionType}
      />
      
      <CoffeeTypeField 
        selectedCoffeeType={selectedCoffeeType}
        setSelectedCoffeeType={setSelectedCoffeeType}
      />
      
      <div>
        <Label htmlFor="source">Source of Coffee</Label>
        <Input id="source" placeholder="Enter farm or location name" required />
      </div>
      
      <div>
        <Label htmlFor="humidity">Coffee Bean Humidity (%)</Label>
        <Input id="humidity" type="number" step="0.1" min="0" max="100" required />
      </div>
      
      <PriceQuantityFields />
    </>
  );
};

export default StockUpdateForm;