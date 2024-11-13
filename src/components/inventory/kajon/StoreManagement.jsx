import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Warehouse, Database } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAddKAJONCoffee } from '@/integrations/supabase/hooks/useKAJONCoffee';

const StoreManagement = ({ subCounties, coffeeTypes, qualityGrades }) => {
  const { toast } = useToast();
  const addCoffeeMutation = useAddKAJONCoffee();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await addCoffeeMutation.mutateAsync({
        subCounty: formData.get('subCounty'),
        supervisor: formData.get('supervisor'),
        outGrowerName: formData.get('outGrowerName'),
        outGrowersCount: formData.get('outGrowersCount'),
        moistureContent: formData.get('moistureContent'),
        coffeeType: formData.get('coffeeType'),
        qualityGrade: formData.get('qualityGrade'),
        quantity: formData.get('quantity'),
      });

      toast({
        title: "Success",
        description: "Store data updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update store data",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Kazo Sub-County</Label>
            <Select name="subCounty">
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
                  {coffeeTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
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
                  {qualityGrades.Arabica.map(grade => (
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
      </div>

      <Button type="submit" className="w-full">Submit Store Update</Button>
    </form>
  );
};

export default StoreManagement;