
import React from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import useDeliveryManagement from '@/hooks/useDeliveryManagement';

const DELIVERY_STATUSES = ["Pending", "In Transit", "Delivered", "Delayed"];

const DeliveryManagementForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      status: "Pending" // Set default status
    }
  });
  const { toast } = useToast();
  const { addDelivery, isLoading } = useDeliveryManagement();

  const onSubmit = async data => {
    try {
      // Debug: Log form data to console
      console.log("Form data before submission:", data);

      // Submit the data to Supabase
      await addDelivery(data);

      // Reset the form after successful submission
      reset();
      toast({
        title: "Success",
        description: "Delivery record saved successfully"
      });
    } catch (error) {
      console.error('Error saving delivery record:', error);
      toast({
        title: "Error",
        description: "Failed to save delivery record: " + error.message,
        variant: "destructive"
      });
    }
  };

  // Example onClick handler for debugging (can be attached to any element)
  const handleDebugClick = () => {
    const formValues = {
      delivery_id: document.getElementById('delivery_id').value,
      order_id: document.getElementById('order_id').value,
      customer_name: document.getElementById('customer_name').value,
      status: document.querySelector('[id="status"]').textContent || 'Pending',
      // Add more fields as needed
    };
    console.log("Current form values:", formValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="delivery_id">Delivery ID</Label>
          <Input id="delivery_id" {...register("delivery_id", {
            required: "Delivery ID is required"
          })} />
          {errors.delivery_id && <p className="text-sm text-red-500">{errors.delivery_id.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="order_id">Order ID</Label>
          <Input id="order_id" {...register("order_id", {
            required: "Order ID is required"
          })} />
          {errors.order_id && <p className="text-sm text-red-500">{errors.order_id.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer_name">Customer Name</Label>
          <Input id="customer_name" {...register("customer_name", {
            required: "Customer name is required"
          })} />
          {errors.customer_name && <p className="text-sm text-red-500">{errors.customer_name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            onValueChange={value => setValue("status", value)} 
            defaultValue="Pending"
            {...register("status", { required: "Status is required" })}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {DELIVERY_STATUSES.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pickup_location">Pickup Location</Label>
          <Input id="pickup_location" {...register("pickup_location", {
            required: "Pickup location is required"
          })} />
          {errors.pickup_location && <p className="text-sm text-red-500">{errors.pickup_location.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery_location">Delivery Location</Label>
          <Input id="delivery_location" {...register("delivery_location", {
            required: "Delivery location is required"
          })} />
          {errors.delivery_location && <p className="text-sm text-red-500">{errors.delivery_location.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="scheduled_pickup_time">Scheduled Pickup Time</Label>
          <Input id="scheduled_pickup_time" type="datetime-local" {...register("scheduled_pickup_time", {
            required: "Scheduled pickup time is required"
          })} />
          {errors.scheduled_pickup_time && <p className="text-sm text-red-500">{errors.scheduled_pickup_time.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="scheduled_delivery_time">Scheduled Delivery Time</Label>
          <Input id="scheduled_delivery_time" type="datetime-local" {...register("scheduled_delivery_time", {
            required: "Scheduled delivery time is required"
          })} />
          {errors.scheduled_delivery_time && <p className="text-sm text-red-500">{errors.scheduled_delivery_time.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="actual_pickup_time">Actual Pickup Time (Optional)</Label>
          <Input id="actual_pickup_time" type="datetime-local" {...register("actual_pickup_time")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="actual_delivery_time">Actual Delivery Time (Optional)</Label>
          <Input id="actual_delivery_time" type="datetime-local" {...register("actual_delivery_time")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comments/Notes</Label>
        <Textarea id="comments" {...register("comments")} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Delivery Record'}
        </Button>
        
        <Button type="button" variant="outline" onClick={handleDebugClick}>
          Debug Form
        </Button>
      </div>
    </form>
  );
};

export default DeliveryManagementForm;
