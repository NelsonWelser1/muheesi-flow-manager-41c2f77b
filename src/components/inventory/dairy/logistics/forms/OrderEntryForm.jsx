import React from 'react';
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useOrderEntries } from "@/hooks/useOrderEntries";

const PRIORITIES = ["High", "Normal", "Low"];
const ORDER_STATUSES = ["Pending", "Confirmed", "Cancelled", "In Progress"];

const OrderEntryForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      order_status: "Pending",
      delivery_priority: "Normal"
    }
  });

  const { toast } = useToast();
  const { addOrder, isLoading } = useOrderEntries();

  const onSubmit = async (data) => {
    try {
      console.log("Form data before submission:", data);

      const result = await addOrder(data);
      if (result.success) {
        // Clear the form after successful submission
        reset({
          order_id: '',
          customer_name: '',
          order_date_time: '',
          delivery_priority: 'Normal',
          order_status: 'Pending',
          order_details: ''
        });

        toast({
          title: "Success",
          description: "Order saved successfully"
        });
      }
    } catch (error) {
      console.error('Error saving order:', error);
      toast({
        title: "Error",
        description: "Failed to save order: " + error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="order_id">Order ID</Label>
          <Input
            id="order_id"
            {...register("order_id", { required: "Order ID is required" })}
          />
          {errors.order_id && (
            <p className="text-sm text-red-500">{errors.order_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer_name">Customer Name</Label>
          <Input
            id="customer_name"
            {...register("customer_name", { required: "Customer name is required" })}
          />
          {errors.customer_name && (
            <p className="text-sm text-red-500">{errors.customer_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="order_date_time">Order Date & Time</Label>
          <Input
            id="order_date_time"
            type="datetime-local"
            {...register("order_date_time", { required: "Order date & time is required" })}
          />
          {errors.order_date_time && (
            <p className="text-sm text-red-500">{errors.order_date_time.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery_priority">Delivery Priority</Label>
          <Controller
            name="delivery_priority"
            control={control}
            rules={{ required: "Delivery priority is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="delivery_priority">
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
            )}
          />
          {errors.delivery_priority && (
            <p className="text-sm text-red-500">{errors.delivery_priority.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="order_status">Order Status</Label>
          <Controller
            name="order_status"
            control={control}
            rules={{ required: "Order status is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="order_status">
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
            )}
          />
          {errors.order_status && (
            <p className="text-sm text-red-500">{errors.order_status.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order_details">Order Details</Label>
        <Textarea
          id="order_details"
          {...register("order_details", { required: "Order details are required" })}
        />
        {errors.order_details && (
          <p className="text-sm text-red-500">{errors.order_details.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Order'}
        </Button>
      </div>
    </form>
  );
};

export default OrderEntryForm;
