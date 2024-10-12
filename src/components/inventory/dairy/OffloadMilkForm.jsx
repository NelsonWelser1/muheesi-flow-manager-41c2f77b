import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from '@tanstack/react-query';

const OffloadMilkForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      // This should be replaced with an actual API call
      console.log('Submitting data:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
  });

  const onSubmit = (data) => {
    submitMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="destination">Destination</Label>
        <Select onValueChange={(value) => register('destination').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="processingPlant">Processing Plant/Factory</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="clientDetails">Client Details or New Destination</Label>
        <Input id="clientDetails" {...register('clientDetails')} />
      </div>

      <div>
        <Label htmlFor="shippingDetails">Shipping/Logistics Details</Label>
        <Input id="shippingDetails" {...register('shippingDetails')} />
      </div>

      <div>
        <Label htmlFor="quantityDispatched">Quantity Dispatched (Liters)</Label>
        <Input id="quantityDispatched" type="number" {...register('quantityDispatched', { required: true, min: 0 })} />
      </div>

      <div>
        <Label htmlFor="dispatchDate">Dispatch Date</Label>
        <Input id="dispatchDate" type="datetime-local" {...register('dispatchDate', { required: true })} />
      </div>

      <div>
        <Label htmlFor="cleaningStatus">Milk Tanker Cleaning Status</Label>
        <Select onValueChange={(value) => register('cleaningStatus').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select cleaning status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cleaned">Cleaned</SelectItem>
            <SelectItem value="notCleaned">Not Cleaned</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="generalCheckup">Milk Tanker General Checkup</Label>
        <Select onValueChange={(value) => register('generalCheckup').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select general checkup status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="notCompleted">Not Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="productCategory">Product Category</Label>
        <Select onValueChange={(value) => register('productCategory').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select product category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rawMilk">Raw Milk</SelectItem>
            <SelectItem value="processedMilk">Processed Milk</SelectItem>
            <SelectItem value="skimmedMilk">Skimmed Milk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="productDetails">Additional Product Category Details</Label>
        <Input id="productDetails" {...register('productDetails')} />
      </div>

      <div>
        <Label htmlFor="quantity">Quantity (Liters)</Label>
        <Input id="quantity" type="number" {...register('quantity', { required: true, min: 0 })} />
      </div>

      <div>
        <Label htmlFor="dataEntrantName">Data Entrant Name</Label>
        <Input id="dataEntrantName" {...register('dataEntrantName', { required: true })} />
      </div>

      <div>
        <Label htmlFor="pin">PIN (Personal Identification Number)</Label>
        <Input id="pin" type="password" {...register('pin', { required: true })} />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="receiverAuthentication" {...register('receiverAuthentication')} />
        <Label htmlFor="receiverAuthentication">I authenticate this dispatch</Label>
      </div>

      <Button type="submit" disabled={submitMutation.isLoading}>
        {submitMutation.isLoading ? 'Submitting...' : 'Submit'}
      </Button>

      {submitMutation.isSuccess && <p className="text-green-500">Form submitted successfully!</p>}
      {submitMutation.isError && <p className="text-red-500">An error occurred. Please try again.</p>}
    </form>
  );
};

export default OffloadMilkForm;