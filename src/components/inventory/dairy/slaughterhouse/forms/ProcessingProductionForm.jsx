import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { Search } from "lucide-react";

const MEAT_QUALITY_GRADES = [
  "Premium",
  "Choice",
  "Select",
  "Standard"
];

const VALUE_ADDED_PRODUCTS = [
  "Sausages",
  "Minced Meat",
  "Chops",
  "Special Cuts",
  "Marinated Products"
];

const PROCESSING_TECHNIQUES = [
  "Grinding",
  "Marination",
  "Casing",
  "Specialty Cutting",
  "Smoking",
  "Curing"
];

const ProcessingProductionForm = ({ onBack }) => {
  const { register: registerBasic, handleSubmit: handleSubmitBasic, reset: resetBasic } = useForm();
  const { register: registerValue, handleSubmit: handleSubmitValue, reset: resetValue } = useForm();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");

  const onSubmitBasic = async (data) => {
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
      resetBasic();
    } catch (error) {
      console.error('Error saving processing record:', error);
      toast({
        title: "Error",
        description: "Failed to save processing record",
        variant: "destructive",
      });
    }
  };

  const onSubmitValue = async (data) => {
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
        batch_id: `VA-${Date.now()}`,
        product_type: data.productType,
        ingredients: data.ingredients,
        processing_techniques: data.processingTechniques,
        timestamp: new Date().toISOString(),
        operator_id: user.id,
        raw_input_quantity: parseFloat(data.rawInputQuantity),
        final_output_quantity: parseFloat(data.finalOutputQuantity),
        trimmings_quantity: parseFloat(data.trimmingsQuantity),
        trimmings_notes: data.trimmingsNotes
      };

      const { error } = await supabase
        .from('slaughterhouse_value_addition')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Value addition record has been saved",
      });
      resetValue();
    } catch (error) {
      console.error('Error saving value addition record:', error);
      toast({
        title: "Error",
        description: "Failed to save value addition record",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={onBack} className="mb-4">
        ← Back to Dashboard
      </Button>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="basic">Basic Processing</TabsTrigger>
          <TabsTrigger value="value">Value Addition</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Meat Processing Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitBasic(onSubmitBasic)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batchId">Batch ID</Label>
                    <Input
                      id="batchId"
                      type="text"
                      {...registerBasic('batchId', { required: true })}
                      placeholder="Enter batch ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processingDateTime">Processing Date & Time</Label>
                    <Input
                      id="processingDateTime"
                      type="datetime-local"
                      {...registerBasic('processingDateTime', { required: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="procurementId">Procurement ID</Label>
                    <Input
                      id="procurementId"
                      type="text"
                      {...registerBasic('procurementId', { required: true })}
                      placeholder="Enter procurement ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weightBefore">Weight Before Processing (kg)</Label>
                    <Input
                      id="weightBefore"
                      type="number"
                      step="0.01"
                      {...registerBasic('weightBefore', { required: true, min: 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weightAfter">Weight After Processing (kg)</Label>
                    <Input
                      id="weightAfter"
                      type="number"
                      step="0.01"
                      {...registerBasic('weightAfter', { required: true, min: 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meatQualityGrade">Meat Quality Grade</Label>
                    <Select onValueChange={(value) => registerBasic('meatQualityGrade').onChange({ target: { value } })}>
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
        </TabsContent>

        <TabsContent value="value">
          <Card>
            <CardHeader>
              <CardTitle>Value Addition & Specialized Products Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitValue(onSubmitValue)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productType">Type of Value-Added Product</Label>
                    <Select onValueChange={(value) => registerValue('productType').onChange({ target: { value } })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        {VALUE_ADDED_PRODUCTS.map(type => (
                          <SelectItem key={type} value={type.toLowerCase()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processingTechniques">Processing Techniques</Label>
                    <Select onValueChange={(value) => registerValue('processingTechniques').onChange({ target: { value } })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select technique" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROCESSING_TECHNIQUES.map(technique => (
                          <SelectItem key={technique} value={technique.toLowerCase()}>
                            {technique}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="ingredients">Ingredients & Additives</Label>
                    <Textarea
                      id="ingredients"
                      {...registerValue('ingredients', { required: true })}
                      placeholder="List ingredients, spices, preservatives, etc."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rawInputQuantity">Raw Meat Input (kg)</Label>
                    <Input
                      id="rawInputQuantity"
                      type="number"
                      step="0.01"
                      {...registerValue('rawInputQuantity', { required: true, min: 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="finalOutputQuantity">Final Product Output (kg)</Label>
                    <Input
                      id="finalOutputQuantity"
                      type="number"
                      step="0.01"
                      {...registerValue('finalOutputQuantity', { required: true, min: 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trimmingsQuantity">Trimmings & By-products (kg)</Label>
                    <Input
                      id="trimmingsQuantity"
                      type="number"
                      step="0.01"
                      {...registerValue('trimmingsQuantity', { required: true, min: 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trimmingsNotes">Trimmings Notes</Label>
                    <Input
                      id="trimmingsNotes"
                      type="text"
                      {...registerValue('trimmingsNotes')}
                      placeholder="Enter notes about trimmings and by-products"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">Submit Value Addition Record</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
