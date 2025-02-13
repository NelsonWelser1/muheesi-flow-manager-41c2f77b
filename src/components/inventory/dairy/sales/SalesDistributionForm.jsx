
import React from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import QRCodeGenerator from '../qr/QRCodeGenerator';

const PRODUCT_TYPES = ["Cheese", "Yogurt", "Milk", "Butter"];

const SalesDistributionForm = ({ onBack }) => {
  const { register, handleSubmit, reset, watch } = useForm();
  const { toast } = useToast();
  const [showQR, setShowQR] = React.useState(false);
  const formData = watch();

  const handleFormSubmit = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit sales records",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('sales_records')
        .insert([{
          ...data,
          created_by: user.id,
          date_time: new Date().toISOString(),
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sales record saved successfully",
      });
      reset();
    } catch (error) {
      console.error('Error saving sales record:', error);
      toast({
        title: "Error",
        description: "Failed to save sales record",
        variant: "destructive",
      });
    }
  };

  if (showQR) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setShowQR(false)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Form
        </Button>
        <QRCodeGenerator 
          data={formData} 
          title="Sales Distribution"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Sales & Marketing
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Sales & Distribution Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name/ID</Label>
                <Input {...register("customer_name", { required: true })} />
              </div>

              <div className="space-y-2">
                <Label>Product Type</Label>
                <Select onValueChange={(value) => register("product_type").onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_TYPES.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity Sold</Label>
                <Input type="number" {...register("quantity", { required: true, min: 1 })} />
              </div>

              <div className="space-y-2">
                <Label>Price Per Unit</Label>
                <Input type="number" step="0.01" {...register("price_per_unit", { required: true, min: 0 })} />
              </div>

              <div className="space-y-2">
                <Label>Invoice Number</Label>
                <Input {...register("invoice_number", { required: true })} />
              </div>

              <div className="space-y-2">
                <Label>Driver ID</Label>
                <Input {...register("driver_id")} />
              </div>

              <div className="space-y-2">
                <Label>Vehicle ID</Label>
                <Input {...register("vehicle_id")} />
              </div>

              <div className="space-y-2">
                <Label>Destination</Label>
                <Input {...register("destination")} />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">Submit Sales Record</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowQR(true)}
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                Generate QR
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDistributionForm;
