import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAddCoffeeInventory } from '@/integrations/supabase/hooks/useInventoryData';

const COFFEE_GRADES = {
  arabica: [
    "Bugisu AA",
    "Bugisu A",
    "Bugisu PB",
    "Bugisu B",
    "DRUGAR",
    "Parchment Arabica"
  ],
  robusta: [
    "FAQ",
    "Screen 18",
    "Screen 15",
    "Screen 12",
    "Organic Robusta"
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
  const [selectedGrade, setSelectedGrade] = useState('');
  const [quantity, setQuantity] = useState('');
  const { toast } = useToast();
  const addCoffeeInventory = useAddCoffeeInventory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCoffeeInventory.mutateAsync({
        coffee_type: selectedCoffeeType,
        grade: selectedGrade,
        quantity: parseInt(quantity),
        location: currentUser.location,
        updated_by: currentUser.name
      });
      
      toast({
        title: "Success",
        description: "Stock updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
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
      <div>
        <Label htmlFor="coffeeType">Coffee Type</Label>
        <Select 
          value={selectedCoffeeType} 
          onValueChange={(value) => {
            setSelectedCoffeeType(value);
            setSelectedGrade('');
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select coffee type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="arabica">Arabica Coffee</SelectItem>
            <SelectItem value="robusta">Robusta Coffee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="grade">Quality Grade</Label>
        <Select 
          value={selectedGrade}
          onValueChange={setSelectedGrade}
          disabled={!selectedCoffeeType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select grade" />
          </SelectTrigger>
          <SelectContent>
            {selectedCoffeeType && COFFEE_GRADES[selectedCoffeeType].map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="quantity">Quantity (kg)</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
          required
        />
      </div>

      <Button 
        type="submit" 
        disabled={!selectedCoffeeType || !selectedGrade || !quantity}
      >
        Update Stock
      </Button>
    </form>
  );
};

export default StockUpdateForm;