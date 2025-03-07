
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

const DELIVERY_STATUSES = ["Pending", "In Transit", "Delivered", "Delayed"];

const DeliveryFormFields = ({ register, setValue, getFieldError }) => {
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

  return (
    <>
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
    </>
  );
};

export default DeliveryFormFields;
