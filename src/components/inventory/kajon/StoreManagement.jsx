import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Warehouse, Database } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAddKAJONCoffee } from '@/integrations/supabase/hooks/useKAJONCoffee';

const StoreManagement = ({ selectedStore }) => {
  const { toast } = useToast();
  const addCoffeeMutation = useAddKAJONCoffee();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await addCoffeeMutation.mutateAsync({
        store: selectedStore,
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
            <Label>Available Facilities</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Warehouse className="h-4 w-4" />
                <span>Selected Store: {selectedStore || 'Please select a store'}</span>
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

      <Button type="submit" className="w-full">Submit Store Update</Button>
    </form>
  );
};

export default StoreManagement;