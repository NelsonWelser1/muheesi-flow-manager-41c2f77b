
import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { Search } from "lucide-react";

const ANIMAL_TYPES = [
  "Cow",
  "Goat",
  "Pig",
  "Sheep"
];

const HEALTH_INSPECTION_CHECKLIST = [
  "General Health",
  "Vaccination Status",
  "Physical Injuries",
  "Disease Symptoms"
];

const AnimalProcurementForm = ({ onBack }) => {
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit records",
          variant: "destructive",
        });
        return;
      }

      const formattedData = {
        procurement_date: new Date(data.procurementDateTime).toISOString(),
        animal_id: data.animalId,
        animal_type: data.animalType,
        supplier_info: data.supplierInfo,
        weight_before: parseFloat(data.weightBefore),
        health_inspection: data.healthInspection,
        operator_id: user.id
      };

      const { error } = await supabase
        .from('slaughterhouse_procurement')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Animal procurement record has been saved",
      });
      reset();
    } catch (error) {
      console.error('Error saving procurement record:', error);
      toast({
        title: "Error",
        description: "Failed to save procurement record",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={onBack} className="mb-4">
        ← Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Animal Procurement & Reception Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="procurementDateTime">Date & Time</Label>
                <Input
                  id="procurementDateTime"
                  type="datetime-local"
                  {...register('procurementDateTime', { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="animalId">Animal ID</Label>
                <Input
                  id="animalId"
                  type="text"
                  {...register('animalId', { required: true })}
                  placeholder="Enter animal ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="animalType">Type of Animal</Label>
                <Select onValueChange={(value) => register('animalType').onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select animal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANIMAL_TYPES.map(type => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplierInfo">Supplier Information</Label>
                <Input
                  id="supplierInfo"
                  type="text"
                  {...register('supplierInfo', { required: true })}
                  placeholder="Enter supplier details"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weightBefore">Weight Before Processing (kg)</Label>
                <Input
                  id="weightBefore"
                  type="number"
                  step="0.01"
                  {...register('weightBefore', { required: true, min: 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="healthInspection">Health Inspection Results</Label>
                <Select onValueChange={(value) => register('healthInspection').onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inspection result" />
                  </SelectTrigger>
                  <SelectContent>
                    {HEALTH_INSPECTION_CHECKLIST.map(item => (
                      <SelectItem key={item} value={item.toLowerCase()}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full">Submit Record</Button>
          </form>
        </CardContent>
      </Card>

      {/* Records Display */}
      <Card>
        <CardHeader>
          <CardTitle>Procurement Records</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              className="pl-8"
              onChange={(e) => {
                // Implement search functionality
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Implement records display table */}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalProcurementForm;
