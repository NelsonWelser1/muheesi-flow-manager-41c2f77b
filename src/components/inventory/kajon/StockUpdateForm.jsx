import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CoffeeTypeField from './form-fields/CoffeeTypeField';
import PriceQuantityFields from './form-fields/PriceQuantityFields';

const StockUpdateForm = ({ 
  action,
  onSubmit,
  onBack,
  verificationStep, 
  pin, 
  onPinChange 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      coffeeType: e.target.coffeeType.value,
      source: e.target.source.value,
      humidity: e.target.humidity.value,
      buyingPrice: e.target.buyingPrice.value,
      quantity: e.target.quantity.value,
      unit: e.target.unit.value,
    };
    onSubmit(formData);
  };

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <CoffeeTypeField />
      
      <div>
        <Label htmlFor="source">Source of Coffee</Label>
        <Input id="source" placeholder="Enter farm or location name" required />
      </div>
      
      <div>
        <Label htmlFor="humidity">Coffee Bean Humidity (%)</Label>
        <Input id="humidity" type="number" step="0.1" min="0" max="100" required />
      </div>
      
      <PriceQuantityFields />
      
      <div className="flex gap-2">
        <Button type="submit">
          Continue to Verification
        </Button>
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </form>
  );
};

export default StockUpdateForm;