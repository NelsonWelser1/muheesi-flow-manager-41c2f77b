
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const DeliveryNotesFormFields = ({ register, errors, setValue }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sales Order Reference</Label>
          <Input {...register("orderReference", { required: "Order reference is required" })} />
          {errors.orderReference && (
            <p className="text-sm text-red-500">{errors.orderReference.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Delivery Date</Label>
          <Input type="date" {...register("deliveryDate", { required: "Delivery date is required" })} />
          {errors.deliveryDate && (
            <p className="text-sm text-red-500">{errors.deliveryDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Receiver Name</Label>
          <Input {...register("receiverName", { required: "Receiver name is required" })} />
          {errors.receiverName && (
            <p className="text-sm text-red-500">{errors.receiverName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Receiver Contact</Label>
          <Input {...register("receiverContact", { required: "Receiver contact is required" })} />
          {errors.receiverContact && (
            <p className="text-sm text-red-500">{errors.receiverContact.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Delivery Location</Label>
          <Input {...register("deliveryLocation", { required: "Delivery location is required" })} />
          {errors.deliveryLocation && (
            <p className="text-sm text-red-500">{errors.deliveryLocation.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Delivery Person/Driver</Label>
          <Input {...register("deliveryPerson")} />
        </div>

        <div className="space-y-2">
          <Label>Delivery Status</Label>
          <Select 
            defaultValue="pending"
            onValueChange={(value) => setValue("deliveryStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
          <Input type="hidden" {...register("deliveryStatus")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Delivered Items</Label>
        <div className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Item name" {...register("itemName")} />
            <Input type="number" placeholder="Quantity" {...register("itemQuantity")} />
            <Input placeholder="Unit" {...register("itemUnit")} />
            <Button type="button" variant="outline">Add Item</Button>
          </div>
        </div>
      </div>

      <div className="space-y-2 border p-4 rounded-lg">
        <Label>Digital Signature</Label>
        <div className="h-20 border border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
          <p className="text-gray-400">Signature capture field will appear here</p>
        </div>
      </div>
    </>
  );
};

export default DeliveryNotesFormFields;
