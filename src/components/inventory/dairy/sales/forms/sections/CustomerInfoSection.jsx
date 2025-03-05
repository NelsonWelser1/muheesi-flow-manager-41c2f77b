
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CustomerInfoSection = ({ register, errors, proposalId, currency, setCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="proposal_id">Proposal ID</Label>
        <Input 
          id="proposal_id" 
          {...register("proposal_id", { required: true })} 
          readOnly 
          className="bg-gray-100"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Currency</Label>
        <Select 
          value={currency}
          onValueChange={setCurrency}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="UGX">UGX (Shilling)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="customer_name">Customer Name</Label>
        <Input 
          id="customer_name" 
          {...register("customer_name", { required: true })} 
        />
        {errors.customer_name && <p className="text-red-500 text-sm">This field is required</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contact_email">Contact Email</Label>
        <Input 
          id="contact_email" 
          type="email"
          {...register("contact_email", { 
            required: true,
            pattern: /^\S+@\S+$/i
          })} 
        />
        {errors.contact_email && <p className="text-red-500 text-sm">Please enter a valid email</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contact_phone">Contact Phone</Label>
        <Input 
          id="contact_phone" 
          {...register("contact_phone", { required: true })} 
        />
        {errors.contact_phone && <p className="text-red-500 text-sm">This field is required</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="validity_period">Validity Period (days)</Label>
        <Input 
          id="validity_period" 
          type="number"
          min="1"
          defaultValue="30"
          {...register("validity_period", { 
            required: true,
            valueAsNumber: true,
            min: 1
          })} 
        />
        {errors.validity_period && <p className="text-red-500 text-sm">Please enter a valid number of days</p>}
      </div>
    </div>
  );
};

export default CustomerInfoSection;
