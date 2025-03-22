
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Warehouse } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAddKAJONCoffee } from '@/integrations/supabase/hooks/useKAJONCoffee';
import AuthenticationForm from './AuthenticationForm';
import StoreSelector from './StoreSelector';

const COFFEE_GRADES = {
  arabica: [
    'Arabica Coffee: Bugisu AA',
    'Arabica Coffee: Bugisu A',
    'Arabica Coffee: Bugisu PB',
    'Arabica Coffee: Bugisu B',
    'Arabica Coffee: DRUGAR',
    'Arabica Coffee: Parchment Arabica'
  ],
  robusta: [
    'Robusta Coffee: FAQ',
    'Robusta Coffee: Screen 18',
    'Robusta Coffee: Screen 15',
    'Robusta Coffee: Screen 12',
    'Robusta Coffee: Organic Robusta'
  ]
};

const StoreManagement = ({ selectedStore }) => {
  const { toast } = useToast();
  const addCoffeeMutation = useAddKAJONCoffee();
  const [selectedCoffeeType, setSelectedCoffeeType] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [managerName, setManagerName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(selectedStore || '');

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleAuthentication = (name, location) => {
    setManagerName(name);
    setIsAuthenticated(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    toast({
      title: "Success",
      description: "Stock updated successfully",
    });
  };

  if (!selectedLocation) {
    return <StoreSelector onLocationSelect={handleLocationSelect} />;
  }

  if (!isAuthenticated) {
    return (
      <AuthenticationForm 
        onAuthenticate={handleAuthentication}
        title="Store Manager Name"
        selectedLocation={selectedLocation}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Store Manager</Label>
            <Input name="manager" value={managerName} readOnly />
          </div>

          <div>
            <Label>Store Location</Label>
            <Input name="location" value={selectedLocation} readOnly />
          </div>

          <div>
            <Label>Coffee Type</Label>
            <Select 
              name="coffeeType" 
              onValueChange={(value) => {
                setSelectedCoffeeType(value);
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
            <Label>Quality Grade</Label>
            <Select name="qualityGrade" disabled={!selectedCoffeeType}>
              <SelectTrigger>
                <SelectValue placeholder="Select quality grade" />
              </SelectTrigger>
              <SelectContent>
                {selectedCoffeeType && COFFEE_GRADES[selectedCoffeeType].map((grade) => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Quantity (kg)</Label>
            <Input name="quantity" type="number" placeholder="Enter quantity" />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">Submit Store Update</Button>
    </form>
  );
};

export default StoreManagement;
