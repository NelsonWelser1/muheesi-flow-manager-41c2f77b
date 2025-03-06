
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useDeliveries } from "../hooks/useDeliveries";
import { Eye, LogIn, AlertCircle } from "lucide-react";
import DeliveryRecordsDisplay from "./displays/DeliveryRecordsDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseAuth } from '@/integrations/supabase';
import { SupabaseAuthUI } from '@/integrations/supabase';
import { Alert, AlertDescription } from "@/components/ui/alert";

const DELIVERY_STATUSES = ["Pending", "In Transit", "Delivered", "Delayed"];

const DeliveryManagementForm = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors: formErrors } } = useForm();
  const { toast } = useToast();
  const [showRecords, setShowRecords] = useState(false);
  const { createDelivery, validationErrors, setValidationErrors } = useDeliveries();
  const { isLoggedIn } = useSupabaseAuth();
  const [serverErrors, setServerErrors] = useState({});

  const onSubmit = async (data) => {
    console.log('Form data before submission:', data);
    setServerErrors({});
    
    try {
      const { success, validationErrors: serverValidationErrors } = await createDelivery({
        ...data,
      });

      if (serverValidationErrors) {
        setServerErrors(serverValidationErrors);
      }

      if (success) {
        toast({
          title: "Success",
          description: "Delivery record saved successfully",
        });
        reset();
        setValidationErrors({});
        setServerErrors({});
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

  // Combine client-side and server-side validation errors
  const getFieldError = (fieldName) => {
    return formErrors[fieldName]?.message || serverErrors[fieldName] || validationErrors[fieldName];
  };

  // Display error message for a field if it exists
  const renderFieldError = (fieldName) => {
    const error = getFieldError(fieldName);
    if (!error) return null;
    
    return (
      <div className="text-red-500 text-xs mt-1 flex items-center">
        <AlertCircle className="h-3 w-3 mr-1" />
        <span>{error}</span>
      </div>
    );
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
        {Object.keys(serverErrors).length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Please fix the validation errors below before submitting.
            </AlertDescription>
          </Alert>
        )}
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Delivery ID</Label>
            <Input 
              {...register("delivery_id", { 
                required: "Delivery ID is required" 
              })} 
              className={getFieldError("delivery_id") ? "border-red-500" : ""}
            />
            {renderFieldError("delivery_id")}
          </div>

          <div className="space-y-2">
            <Label>Order ID</Label>
            <Input 
              {...register("order_id", { 
                required: "Order ID is required" 
              })} 
              className={getFieldError("order_id") ? "border-red-500" : ""}
            />
            {renderFieldError("order_id")}
          </div>

          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input 
              {...register("customer_name", { 
                required: "Customer name is required" 
              })} 
              className={getFieldError("customer_name") ? "border-red-500" : ""}
            />
            {renderFieldError("customer_name")}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              onValueChange={(value) => setValue("status", value)}
              {...register("status", { required: "Status is required" })}
            >
              <SelectTrigger className={getFieldError("status") ? "border-red-500" : ""}>
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
            {renderFieldError("status")}
          </div>

          <div className="space-y-2">
            <Label>Pickup Location</Label>
            <Input 
              {...register("pickup_location", { 
                required: "Pickup location is required" 
              })} 
              className={getFieldError("pickup_location") ? "border-red-500" : ""}
            />
            {renderFieldError("pickup_location")}
          </div>

          <div className="space-y-2">
            <Label>Delivery Location</Label>
            <Input 
              {...register("delivery_location", { 
                required: "Delivery location is required" 
              })} 
              className={getFieldError("delivery_location") ? "border-red-500" : ""}
            />
            {renderFieldError("delivery_location")}
          </div>

          <div className="space-y-2">
            <Label>Scheduled Pickup Time</Label>
            <Input 
              type="datetime-local" 
              {...register("scheduled_pickup_time", { 
                required: "Scheduled pickup time is required" 
              })} 
              className={getFieldError("scheduled_pickup_time") ? "border-red-500" : ""}
            />
            {renderFieldError("scheduled_pickup_time")}
          </div>

          <div className="space-y-2">
            <Label>Scheduled Delivery Time</Label>
            <Input 
              type="datetime-local" 
              {...register("scheduled_delivery_time", { 
                required: "Scheduled delivery time is required",
                validate: value => {
                  const pickupTime = new Date(document.querySelector('[name="scheduled_pickup_time"]').value);
                  const deliveryTime = new Date(value);
                  return pickupTime <= deliveryTime || "Delivery time must be after pickup time";
                }
              })} 
              className={getFieldError("scheduled_delivery_time") ? "border-red-500" : ""}
            />
            {renderFieldError("scheduled_delivery_time")}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Comments/Notes</Label>
          <Textarea {...register("comments")} />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="w-full">Submit Delivery Record</Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              reset();
              setValidationErrors({});
              setServerErrors({});
            }}
          >
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryManagementForm;
