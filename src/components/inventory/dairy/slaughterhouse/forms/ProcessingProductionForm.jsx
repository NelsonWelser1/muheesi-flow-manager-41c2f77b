
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

const MEAT_QUALITY_GRADES = [
  "Premium",
  "Choice",
  "Select",
  "Standard"
];

const ProcessingProductionForm = ({ onBack }) => {
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
        batch_id: data.batchId,
        processing_date: new Date(data.processingDateTime).toISOString(),
        procurement_id: data.procurementId,
        weight_before: parseFloat(data.weightBefore),
        weight_after: parseFloat(data.weightAfter),
        meat_quality_grade: data.meatQualityGrade,
        operator_id: user.id
      };

      const { error } = await supabase
        .from('slaughterhouse_processing')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Processing record has been saved",
      });
      reset();
    } catch (error) {
      console.error('Error saving processing record:', error);
      toast({
        title: "Error",
        description: "Failed to save processing record",
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
          <CardTitle>Processing & Meat Production Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="processingDateTime">Processing Date & Time</Label>
                <Input
                  id="processingDateTime"
                  type="datetime-local"
                  {...register('processingDateTime', { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="procurementId">Procurement ID</Label>
                <Input
                  id="procurementId"
                  type="text"
                  {...register('procurementId', { required: true })}
                  placeholder="Enter procurement ID"
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
                <Label htmlFor="weightAfter">Weight After Processing (kg)</Label>
                <Input
                  id="weightAfter"
                  type="number"
                  step="0.01"
                  {...register('weightAfter', { required: true, min: 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meatQualityGrade">Meat Quality Grade</Label>
                <Select onValueChange={(value) => register('meatQualityGrade').onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEAT_QUALITY_GRADES.map(grade => (
                      <SelectItem key={grade} value={grade.toLowerCase()}>
                        {grade}
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
          <CardTitle>Processing Records</CardTitle>
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

export default ProcessingProductionForm;
