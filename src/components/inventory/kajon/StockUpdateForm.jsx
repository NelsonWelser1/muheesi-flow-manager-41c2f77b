import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import LocationField from './form-fields/LocationField';
import CoffeeTypeField from './form-fields/CoffeeTypeField';
import PriceField from './form-fields/PriceField';
import QuantityField from './form-fields/QuantityField';

const WAREHOUSE_LOCATIONS = [
  "Kampala Store",
  "JBER",
  "Mbarara Warehouse",
  "Kakyinga Factory",
  "Kazo - Kanoni Warehouse",
  "Kazo Coffee"
];

const COFFEE_GRADES = {
  robusta: [
    "FAQ",
    "Screen 18",
    "Screen 15",
    "Screen 12",
    "Organic Robusta"
  ],
  arabica: [
    "Bugisu AA",
    "Bugisu A",
    "Bugisu PB",
    "Bugisu B",
    "DRUGAR",
    "Parchment Arabica"
  ]
};

const StockUpdateForm = ({ 
  currentUser, 
  verificationStep, 
  pin, 
  onPinChange, 
  onBack 
}) => {
  const [selectedCoffeeType, setSelectedCoffeeType] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [showNewLocation, setShowNewLocation] = useState(false);

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
        WAREHOUSE_LOCATIONS={WAREHOUSE_LOCATIONS}
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

      <PriceField />
      
      <QuantityField />

      <div>
        <Label htmlFor="action">Stock Update Action</Label>
        <Select id="action" required>
          <SelectTrigger>
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="add">Add Stock</SelectItem>
            <SelectItem value="remove">Remove Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default StockUpdateForm;