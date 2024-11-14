import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Users, Warehouse, Database } from "lucide-react";
import { useAddKAJONCoffee } from '@/integrations/supabase/hooks/useKAJONCoffee';

const StockUpdateForm = ({ currentUser }) => {
  const { toast } = useToast();
  const addCoffeeInventory = useAddKAJONCoffee();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCoffeeInventory.mutateAsync({
        manager: currentUser?.name || '',
        location: e.target.location.value,
        coffee_type: e.target.coffeeType.value,
        grade: e.target.qualityGrade.value,
        source: e.target.outGrowerName.value,
        humidity: parseFloat(e.target.moistureContent.value),
        quantity: parseFloat(e.target.quantity.value),
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

  const subCounties = [
    'Kazo Town council', 'Buremba Town council', 'Kazo Sub county',
    'Buremba Sub county', 'Kanoni Sub county', 'Engari Sub county',
    'Kyampangara Sub county', 'Nkungu Sub county', 'Rwemikoma Sub county',
    'Burunga Sub county', 'Migina Sub county'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Kazo Sub-County</Label>
            <Select name="location">
              <SelectTrigger>
                <SelectValue placeholder="Select sub-county" />
              </SelectTrigger>
              <SelectContent>
                {subCounties.map(county => (
                  <SelectItem key={county} value={county}>{county}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Coffee Supervisor</Label>
            <Input name="supervisor" placeholder="Enter supervisor name" />
          </div>

          <div>
            <Label>Out-Grower Name</Label>
            <Input name="outGrowerName" placeholder="Enter out-grower name" />
          </div>

          <div>
            <Label>Number of Out-Growers</Label>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <Input name="outGrowersCount" type="number" placeholder="Enter number of out-growers" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Available Facilities</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Warehouse className="h-4 w-4" />
                <span>7 Coffee Stores</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4" />
                <span>2 Data Centers (Managed by Anatory and Eliab)</span>
              </div>
            </div>
          </div>

          <div>
            <Label>Quality Metrics</Label>
            <div className="space-y-4">
              <div>
                <Label>Moisture Content (%)</Label>
                <Input name="moistureContent" type="number" placeholder="Enter moisture content" />
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
                <Label>Quality Grade</Label>
                <Select name="qualityGrade">
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bugisu_aa">Bugisu AA</SelectItem>
                    <SelectItem value="bugisu_a">Bugisu A</SelectItem>
                    <SelectItem value="bugisu_pb">Bugisu PB</SelectItem>
                    <SelectItem value="bugisu_b">Bugisu B</SelectItem>
                    <SelectItem value="drugar">DRUGAR</SelectItem>
                    <SelectItem value="parchment">Parchment Arabica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Quantity (kg)</Label>
                <Input name="quantity" type="number" placeholder="Enter quantity" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full bg-navy-900">
        Submit Store Update
      </Button>
    </form>
  );
};

export default StockUpdateForm;