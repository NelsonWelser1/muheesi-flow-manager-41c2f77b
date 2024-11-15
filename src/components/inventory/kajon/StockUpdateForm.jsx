import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAddKAJONCoffee } from '@/integrations/supabase/hooks/useKAJONCoffee';
import AuthenticationForm from './AuthenticationForm';

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

const WAREHOUSE_LOCATIONS = [
  "Kampala Store",
  "JBER",
  "Mbarara Warehouse",
  "Kakyinga Factory",
  "Kazo - Kanoni Warehouse",
  "Kazo Coffee"
];

const StockUpdateForm = () => {
  const { toast } = useToast();
  const addCoffeeInventory = useAddKAJONCoffee();
  const [selectedCoffeeType, setSelectedCoffeeType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [managerName, setManagerName] = useState('');

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleAuthentication = (name) => {
    setManagerName(name);
    setIsAuthenticated(true);
    toast({
      title: "Success",
      description: "Authentication successful",
    });
  };

  if (!selectedLocation) {
    return (
      <div className="space-y-4">
        <Label>Select Store Location</Label>
        <Select onValueChange={handleLocationSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {WAREHOUSE_LOCATIONS.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthenticationForm 
        onAuthenticate={handleAuthentication}
        title="Warehouse Manager Name"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Store/Warehouse Manager</Label>
            <Input name="manager" value={managerName} readOnly />
          </div>

          <div>
            <Label>Stock Location</Label>
            <Select name="location" value={selectedLocation} required>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {WAREHOUSE_LOCATIONS.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Coffee Type</Label>
            <Select 
              name="coffeeType" 
              onValueChange={setSelectedCoffeeType}
              required
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
            <Label>Bean Grade</Label>
            <Select name="qualityGrade" disabled={!selectedCoffeeType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {selectedCoffeeType && COFFEE_GRADES[selectedCoffeeType].map((grade) => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Source of Coffee (Origin)</Label>
            <Input name="source" placeholder="Enter farm or location name" required />
          </div>

          <div>
            <Label>Coffee Bean Humidity (%)</Label>
            <Input name="humidity" type="number" step="0.1" placeholder="Enter moisture content" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Buying Price</Label>
              <Input name="buyingPrice" type="number" placeholder="Enter price" required />
            </div>
            <div>
              <Label>Currency</Label>
              <Select name="currency" defaultValue="UGX">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UGX">UGX</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quantity</Label>
              <Input name="quantity" type="number" placeholder="Enter quantity" required />
            </div>
            <div>
              <Label>Unit</Label>
              <Select name="unit" defaultValue="kg">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="tons">Tons</SelectItem>
                  <SelectItem value="bags">Bags</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full bg-navy-900">
        Update Stock
      </Button>
    </form>
  );
};

export default StockUpdateForm;
