
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useDeliveries } from "../hooks/useDeliveries";
import { Eye, LogIn } from "lucide-react";
import DeliveryRecordsDisplay from "./displays/DeliveryRecordsDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseAuth } from '@/integrations/supabase';
import { SupabaseAuthUI } from '@/integrations/supabase';

const DELIVERY_STATUSES = ["Pending", "In Transit", "Delivered", "Delayed"];

const DeliveryManagementForm = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { toast } = useToast();
  const [showRecords, setShowRecords] = useState(false);
  const { createDelivery } = useDeliveries();
  const { isLoggedIn } = useSupabaseAuth();

  const onSubmit = async (data) => {
    console.log('Form data before submission:', data);
    try {
      const { success } = await createDelivery({
        ...data,
      });

      if (success) {
        toast({
          title: "Success",
          description: "Delivery record saved successfully",
        });
        reset();
      }
    } catch (error) {
      console.error('Error saving delivery record:', error);
      toast({
        title: "Error",
        description: "Failed to save delivery record",
        variant: "destructive",
      });
    }
  };

  // Debug function to log the current form values
  const debugForm = () => {
    const values = {};
    Object.keys(register).forEach(key => {
      values[key] = register[key].value;
    });
    console.log('Current form values:', values);
  };

  if (showRecords) {
    return <DeliveryRecordsDisplay onBack={() => setShowRecords(false)} />;
  }

  // Show login form if user is not authenticated
  if (!isLoggedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              You must be logged in to manage delivery records. Please sign in or create an account to continue.
            </p>
            <div className="p-4 border rounded-md">
              <SupabaseAuthUI />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Manage Deliveries</h2>
        <Button 
          variant="outline" 
          onClick={() => setShowRecords(true)}
          className="flex items-center gap-1"
        >
          <Eye className="h-4 w-4" /> View Records
        </Button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Delivery ID</Label>
            <Input {...register("delivery_id", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label>Order ID</Label>
            <Input {...register("order_id", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input {...register("customer_name", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select onValueChange={(value) => setValue("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {DELIVERY_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Pickup Location</Label>
            <Input {...register("pickup_location", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label>Delivery Location</Label>
            <Input {...register("delivery_location", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label>Scheduled Pickup Time</Label>
            <Input type="datetime-local" {...register("scheduled_pickup_time", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label>Scheduled Delivery Time</Label>
            <Input type="datetime-local" {...register("scheduled_delivery_time", { required: true })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Comments/Notes</Label>
          <Textarea {...register("comments")} />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="w-full">Submit Delivery Record</Button>
          <Button type="button" variant="outline" onClick={debugForm}>Debug Form</Button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryManagementForm;
