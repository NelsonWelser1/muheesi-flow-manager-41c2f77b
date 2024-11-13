import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, Warehouse, Database, Users } from 'lucide-react';
import { useAddKAJONCoffee } from '@/integrations/supabase/hooks/useKAJONCoffee';
import { useToast } from "@/components/ui/use-toast";

const StoreManagement = () => {
  const { toast } = useToast();
  const [selectedCoffeeType, setSelectedCoffeeType] = useState('');
  const addCoffeeMutation = useAddKAJONCoffee();

  const subCounties = [
    'Kazo Town council', 'Buremba Town council', 'Kazo Sub county',
    'Buremba Sub county', 'Kanoni Sub county', 'Engari Sub county',
    'Kyampangara Sub county', 'Nkungu Sub county', 'Rwemikoma Sub county',
    'Burunga Sub county', 'Migina Sub county'
  ];

  const coffeeTypes = ['Arabica', 'Robusta'];
  
  const qualityGrades = {
    Arabica: [
      { name: 'Bugisu AA', quantity: '1500kg' },
      { name: 'Bugisu A', quantity: '1300kg' },
      { name: 'Bugisu PB', quantity: '1100kg' },
      { name: 'Bugisu B', quantity: '900kg' },
      { name: 'DRUGAR', quantity: '700kg' },
      { name: 'Parchment Arabica', quantity: '600kg' }
    ],
    Robusta: [
      { name: 'FAQ', quantity: '2000kg' },
      { name: 'Screen 18', quantity: '1500kg' },
      { name: 'Screen 15', quantity: '1200kg' },
      { name: 'Screen 12', quantity: '1000kg' },
      { name: 'Organic Robusta', quantity: '800kg' }
    ]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      subCounty: formData.get('subCounty'),
      supervisor: formData.get('supervisor'),
      outGrowerName: formData.get('outGrowerName'),
      outGrowers: formData.get('outGrowers'),
      coffeeType: formData.get('coffeeType'),
      qualityGrade: formData.get('qualityGrade'),
      quantity: formData.get('quantity'),
      moisture: formData.get('moisture')
    };

    try {
      await addCoffeeMutation.mutateAsync(data);
      toast({
        title: "Success",
        description: "Coffee stock updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update coffee stock",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="subCounty">Kazo Sub-County</Label>
            <Select name="subCounty">
              <SelectTrigger>
                <SelectValue placeholder="Select sub-county" />
              </SelectTrigger>
              <SelectContent>
                {subCounties.map(county => (
                  <SelectItem key={county} value={county}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {county}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="supervisor">Coffee Supervisor</Label>
            <Input id="supervisor" name="supervisor" placeholder="Enter supervisor name" />
          </div>

          <div>
            <Label htmlFor="outGrowerName">Out-Grower Name</Label>
            <Input id="outGrowerName" name="outGrowerName" placeholder="Enter out-grower name" />
          </div>

          <div>
            <Label htmlFor="outGrowers">Number of Out-Growers</Label>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <Input id="outGrowers" name="outGrowers" type="number" placeholder="Enter number of out-growers" />
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
            <div className="space-y-3 mt-2">
              <div>
                <Label htmlFor="moisture">Moisture Content (%)</Label>
                <Input id="moisture" name="moisture" type="number" placeholder="Enter moisture content" />
              </div>
              
              <div>
                <Label htmlFor="coffeeType">Coffee Type</Label>
                <Select name="coffeeType" onValueChange={setSelectedCoffeeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select coffee type" />
                  </SelectTrigger>
                  <SelectContent>
                    {coffeeTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="qualityGrade">Quality Grade</Label>
                <Select name="qualityGrade" disabled={!selectedCoffeeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCoffeeType && qualityGrades[selectedCoffeeType].map(grade => (
                      <SelectItem key={grade.name} value={grade.name}>
                        {`${selectedCoffeeType} Coffee: ${grade.name} (${grade.quantity})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input id="quantity" name="quantity" type="number" placeholder="Enter quantity" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">Submit Store Update</Button>
    </form>
  );
};

export default StoreManagement;