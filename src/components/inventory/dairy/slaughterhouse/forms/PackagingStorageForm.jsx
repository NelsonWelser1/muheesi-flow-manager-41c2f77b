
import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { Search } from "lucide-react";

const PACKAGING_TYPES = [
  "Vacuum-sealed",
  "Pre-packaged",
  "Bulk Package",
  "Custom Package"
];

const PackagingStorageForm = ({ onBack }) => {
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
        packaging_date: new Date(data.packagingDateTime).toISOString(),
        processing_id: data.processingId,
        batch_id: data.batchId,
        packaging_type: data.packagingType,
        quantity_packaged: parseFloat(data.quantityPackaged),
        labeling_details: {
          expiryDate: data.expiryDate,
          nutritionalInfo: data.nutritionalInfo
        },
        cold_storage_id: data.coldStorageId,
        operator_id: user.id
      };

      const { error } = await supabase
        .from('slaughterhouse_packaging')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Packaging record has been saved",
      });
      reset();
    } catch (error) {
      console.error('Error saving packaging record:', error);
      toast({
        title: "Error",
        description: "Failed to save packaging record",
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
          <CardTitle>Meat Packaging & Cold Storage Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="packagingDateTime">Packaging Date & Time</Label>
                <Input
                  id="packagingDateTime"
                  type="datetime-local"
                  {...register('packagingDateTime', { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="processingId">Processing ID</Label>
                <Input
                  id="processingId"
                  type="text"
                  {...register('processingId', { required: true })}
                  placeholder="Enter processing ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batchId">Batch ID</Label>
                <Input
                  id="batchId"
                  type="text"
                  {...register('batchId', { required: true })}
                  placeholder="Enter batch ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="packagingType">Packaging Type</Label>
                <Select onValueChange={(value) => register('packagingType').onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select packaging type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PACKAGING_TYPES.map(type => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantityPackaged">Quantity Packaged (kg)</Label>
                <Input
                  id="quantityPackaged"
                  type="number"
                  step="0.01"
                  {...register('quantityPackaged', { required: true, min: 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  {...register('expiryDate', { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nutritionalInfo">Nutritional Information</Label>
                <Input
                  id="nutritionalInfo"
                  type="text"
                  {...register('nutritionalInfo', { required: true })}
                  placeholder="Enter nutritional information"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coldStorageId">Cold Storage ID</Label>
                <Input
                  id="coldStorageId"
                  type="text"
                  {...register('coldStorageId', { required: true })}
                  placeholder="Enter cold storage ID"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">Submit Record</Button>
          </form>
        </CardContent>
      </Card>

      {/* Records Display */}
      <Card>
        <CardHeader>
          <CardTitle>Packaging Records</CardTitle>
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

export default PackagingStorageForm;
