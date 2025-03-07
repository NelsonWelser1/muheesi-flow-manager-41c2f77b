
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SalesOrderFormFields = ({ register, errors, setValue, watch }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Customer Name</Label>
          <Input {...register("customerName", { required: "Customer name is required" })} />
          {errors.customerName && (
            <p className="text-sm text-red-500">{errors.customerName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Order Date</Label>
          <Input type="date" {...register("orderDate", { required: "Order date is required" })} />
          {errors.orderDate && (
            <p className="text-sm text-red-500">{errors.orderDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Product</Label>
          <Select onValueChange={(value) => setValue("product", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cheese">Cheese</SelectItem>
              <SelectItem value="yogurt">Yogurt</SelectItem>
              <SelectItem value="milk">Fresh Milk</SelectItem>
              <SelectItem value="processed_milk">Processed Milk</SelectItem>
            </SelectContent>
          </Select>
          <Input type="hidden" {...register("product", { required: "Product is required" })} />
          {errors.product && (
            <p className="text-sm text-red-500">{errors.product.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input 
            type="number" 
            {...register("quantity", { 
              required: "Quantity is required",
              min: { value: 1, message: "Quantity must be at least 1" }
            })} 
          />
          {errors.quantity && (
            <p className="text-sm text-red-500">{errors.quantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Unit Price (UGX)</Label>
          <Input 
            type="number" 
            {...register("unitPrice", { 
              required: "Unit price is required",
              min: { value: 0, message: "Price cannot be negative" }
            })} 
          />
          {errors.unitPrice && (
            <p className="text-sm text-red-500">{errors.unitPrice.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Discount (%)</Label>
          <Input 
            type="number" 
            {...register("discount", { 
              min: { value: 0, message: "Discount cannot be negative" },
              max: { value: 100, message: "Discount cannot exceed 100%" }
            })} 
          />
          {errors.discount && (
            <p className="text-sm text-red-500">{errors.discount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Payment Status</Label>
          <Select 
            defaultValue="pending"
            onValueChange={(value) => setValue("paymentStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partially_paid">Partially Paid</SelectItem>
            </SelectContent>
          </Select>
          <Input type="hidden" {...register("paymentStatus")} />
        </div>

        <div className="space-y-2">
          <Label>Sales Representative</Label>
          <Input {...register("salesRep")} />
        </div>

        <div className="space-y-2">
          <Label>Delivery Required?</Label>
          <Select 
            defaultValue="no"
            onValueChange={(value) => setValue("deliveryRequired", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
          <Input type="hidden" {...register("deliveryRequired")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Input {...register("notes")} />
      </div>
    </>
  );
};

export default SalesOrderFormFields;
