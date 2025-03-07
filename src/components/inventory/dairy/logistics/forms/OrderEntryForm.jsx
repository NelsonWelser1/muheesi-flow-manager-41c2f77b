
import React from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";

const PRIORITIES = ["High", "Normal", "Low"];
const ORDER_STATUSES = ["Pending", "Confirmed", "Cancelled", "In Progress"];

const OrderEntryForm = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit orders",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('logistics_order_entries')
        .insert([{
          ...data,
          operator_id: user.id,
          order_details: JSON.stringify(data.order_details),
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order saved successfully",
      });
      reset();
    } catch (error) {
      console.error('Error saving order:', error);
      toast({
        title: "Error",
        description: "Failed to save order",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Order ID</Label>
          <Input {...register("order_id", { required: true })} />
        </div>

        <div className="space-y-2">
          <Label>Customer Name</Label>
          <Input {...register("customer_name", { required: true })} />
        </div>

        <div className="space-y-2">
          <Label>Order Date & Time</Label>
          <Input type="datetime-local" {...register("order_date_time", { required: true })} />
        </div>

        <div className="space-y-2">
          <Label>Delivery Priority</Label>
          <Select onValueChange={(value) => setValue("delivery_priority", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Order Status</Label>
          <Select onValueChange={(value) => setValue("order_status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Order Details</Label>
        <Textarea {...register("order_details", { required: true })} />
      </div>

      <Button type="submit" className="w-full">Submit Order</Button>
    </form>
  );
};

export default OrderEntryForm;
