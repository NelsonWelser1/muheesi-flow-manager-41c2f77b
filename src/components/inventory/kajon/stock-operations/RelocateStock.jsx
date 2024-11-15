import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateKAJONCoffee } from '@/integrations/supabase/hooks/useKAJONCoffee';
import AuthenticationForm from '../AuthenticationForm';

const COFFEE_GRADES = {
  arabica: [
    'Arabica Coffee: Bugisu AA1',
    'Arabica Coffee: Bugisu A1',
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

const RelocateStock = ({ isKazo }) => {
  const [selectedCoffeeType, setSelectedCoffeeType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [managerName, setManagerName] = useState('');
  const { toast } = useToast();
  const updateCoffeeMutation = useUpdateKAJONCoffee();

  const handleAuthentication = (name) => {
    setManagerName(name);
    setIsAuthenticated(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      await updateCoffeeMutation.mutateAsync({
        ...data,
        manager: managerName,
        sourceLocation: selectedLocation,
        destinationLocation,
        type: 'relocation',
        status: 'pending'
      });

      toast({
        title: "Success",
        description: "Stock relocation request sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send relocation request",
        variant: "destructive",
      });
    }
  };

  if (!selectedLocation) {
    return (
      <div className="space-y-4">
        <Label>Select Source Location</Label>
        <Select onValueChange={setSelectedLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {isKazo ? (
              <>
                <SelectItem value="Kanoni-Mbogo">Kanoni - Mbogo Store</SelectItem>
                <SelectItem value="Kanoni-Rwakahaya">Kanoni - Rwakahaya Store</SelectItem>
                <SelectItem value="Engari-Kaichumu">Engari - Kaichumu Store</SelectItem>
                <SelectItem value="Engari-Kyengando">Engari - Kyengando Store</SelectItem>
                <SelectItem value="Migina">Migina Store</SelectItem>
                <SelectItem value="Kagarama">Kagarama Store</SelectItem>
                <SelectItem value="Kyampangara">Kyampangara Store</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="Kampala">Kampala Store</SelectItem>
                <SelectItem value="JBER">JBER</SelectItem>
                <SelectItem value="Mbarara">Mbarara Warehouse</SelectItem>
                <SelectItem value="Kakyinga">Kakyinga Factory</SelectItem>
                <SelectItem value="Kazo-Kanoni">Kazo - Kanoni Warehouse</SelectItem>
                <SelectItem value="Kazo">Kazo Coffee</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthenticationForm 
        onAuthenticate={handleAuthentication}
        title={isKazo ? "Store Manager Name" : "Warehouse Manager Name"}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Manager Name</Label>
          <Input name="manager" value={managerName} readOnly />
        </div>

        <div>
          <Label>Source Location</Label>
          <Input name="sourceLocation" value={selectedLocation} readOnly />
        </div>

        <div>
          <Label>Destination Location</Label>
          <Select 
            name="destinationLocation" 
            onValueChange={setDestinationLocation}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {isKazo ? (
                <>
                  <SelectItem value="Kanoni-Mbogo">Kanoni - Mbogo Store</SelectItem>
                  <SelectItem value="Kanoni-Rwakahaya">Kanoni - Rwakahaya Store</SelectItem>
                  <SelectItem value="Engari-Kaichumu">Engari - Kaichumu Store</SelectItem>
                  <SelectItem value="Engari-Kyengando">Engari - Kyengando Store</SelectItem>
                  <SelectItem value="Migina">Migina Store</SelectItem>
                  <SelectItem value="Kagarama">Kagarama Store</SelectItem>
                  <SelectItem value="Kyampangara">Kyampangara Store</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="Kampala">Kampala Store</SelectItem>
                  <SelectItem value="JBER">JBER</SelectItem>
                  <SelectItem value="Mbarara">Mbarara Warehouse</SelectItem>
                  <SelectItem value="Kakyinga">Kakyinga Factory</SelectItem>
                  <SelectItem value="Kazo-Kanoni">Kazo - Kanoni Warehouse</SelectItem>
                  <SelectItem value="Kazo">Kazo Coffee</SelectItem>
                </>
              )}
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
          <Label>Quality Grade</Label>
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

        <div>
          <Label>Reason for Relocation</Label>
          <Input name="reason" placeholder="Enter reason for relocation" required />
        </div>
      </div>

      <Button type="submit" className="w-full">Submit Relocation Request</Button>
    </form>
  );
};

export default RelocateStock;