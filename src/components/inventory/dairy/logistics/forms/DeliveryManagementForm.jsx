
import React from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";

const DELIVERY_STATUSES = ["Pending", "In Transit", "Delivered", "Delayed"];

const DeliveryManagementForm = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit delivery records",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('logistics_delivery_management')
        .insert([{
          ...data,
          operator_id: user.id,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery record saved successfully",
      });
      reset();
    } catch (error) {
      console.error('Error saving delivery record:', error);
      toast({
        title: "Error",
        description: "Failed to save delivery record",
        variant: "destructive",
      });
    }
  };

  return (
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

      <Button type="submit" className="w-full">Submit Delivery Record</Button>
    </form>
  );
};

export default DeliveryManagementForm;
