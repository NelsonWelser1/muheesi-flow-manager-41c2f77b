import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from '@tanstack/react-query';

const OffloadMilkForm = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const [isProcessingPlant, setIsProcessingPlant] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      console.log('Submitting data:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
  });

  const onSubmit = (data) => {
    submitMutation.mutate(data);
  };

  const destination = watch('destination');

  useEffect(() => {
    setIsProcessingPlant(destination === 'processingPlant');
  }, [destination]);

  // Auto-fill function
  const handleDestinationChange = (value) => {
    if (value === 'processingPlant') {
      setValue('clientDetails', 'Processing Plant A, 123 Factory Road');
    } else if (value === 'client') {
      setValue('clientDetails', '');
      setValue('shippingDetails', 'Standard Shipping, 1-2 days');
      setValue('tankerInfo', 'Tanker 001, John Doe');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="destination">Destination</Label>
        <Select onValueChange={(value) => {
          register('destination').onChange({ target: { value } });
          handleDestinationChange(value);
        }}>
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

      {!isProcessingPlant && (
        <>
          <div>
            <Label htmlFor="shippingDetails">Shipping/Logistics Details</Label>
            <Input id="shippingDetails" {...register('shippingDetails')} />
          </div>

          <div>
            <Label htmlFor="tankerInfo">Milk Tanker Number and Driver Name</Label>
            <Input id="tankerInfo" {...register('tankerInfo')} />
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
        </>
      )}

      <div>
        <Label htmlFor="quantityDispatched">Quantity Dispatched (Liters)</Label>
        <Input id="quantityDispatched" type="number" {...register('quantityDispatched', { required: true, min: 0 })} />
      </div>

      <div>
        <Label htmlFor="dispatchDate">Dispatch Date</Label>
        <Input id="dispatchDate" type="datetime-local" {...register('dispatchDate', { required: true })} />
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
        <Label htmlFor="entrantName">Entrant Name</Label>
        <Input id="entrantName" {...register('entrantName', { required: true })} />
      </div>

      <div>
        <Label htmlFor="entrantPIN">Entrant PIN (Personal Identification Number)</Label>
        <Input id="entrantPIN" type="password" {...register('entrantPIN', { required: true })} />
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

      <Button type="button" onClick={() => console.log('Print daily report')}>
        Print Daily Report
      </Button>

    </form>
  );
};

export default OffloadMilkForm;
