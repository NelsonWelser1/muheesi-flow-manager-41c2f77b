import React from 'react';
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

const StockUpdateForm = ({ currentUser }) => {
  const { toast } = useToast();
  const addCoffeeInventory = useAddCoffeeInventory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCoffeeInventory.mutateAsync({
        manager: currentUser?.name || '',
        location: e.target.location.value,
        coffee_type: e.target.coffeeType.value,
        grade: e.target.beanGrade.value,
        source: e.target.source.value,
        humidity: parseFloat(e.target.humidity.value),
        price: parseFloat(e.target.price.value),
        quantity: parseFloat(e.target.quantity.value),
        unit: e.target.unit.value,
        currency: e.target.currency.value
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Store/Warehouse Manager</Label>
          <Input value={currentUser?.name || ''} disabled />
        </div>

        <div>
          <Label>Stock Location</Label>
          <Select name="location">
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {currentUser?.authorizedLocations?.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="link" className="mt-1 h-auto p-0 text-sm">
            Add new location
          </Button>
        </div>

        <div>
          <Label>Coffee Type</Label>
          <Select name="coffeeType">
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
          <Select name="beanGrade">
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(COFFEE_GRADES).flat().map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Source of Coffee</Label>
          <Input 
            name="source"
            placeholder="Enter farm or location name" 
          />
        </div>

        <div>
          <Label>Coffee Bean Humidity (%)</Label>
          <Input 
            name="humidity"
            type="number" 
            step="0.1"
            min="0"
            max="100"
          />
        </div>

        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-4">
            <Label>Buying Price</Label>
            <Input 
              name="price"
              type="number"
              min="0"
              placeholder="Enter price"
            />
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

        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-4">
            <Label>Quantity with Unit</Label>
            <Input 
              name="quantity"
              type="number"
              min="0"
              placeholder="Enter quantity"
            />
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

      <Button type="submit" className="w-full">
        Update Stock
      </Button>
    </form>
  );
};

export default StockUpdateForm;