import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from '@tanstack/react-query';

const ReceiveMilkForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [sourceAddress, setSourceAddress] = useState('');

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

  const handleSourceChange = (value) => {
    setSourceAddress(value === 'kyalimaFarm' ? 'Kyalima Farm, Plot 123, Farmville' : '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="coolerLocation">Receiver Cooler Location</Label>
        <Input id="coolerLocation" {...register('coolerLocation', { required: true })} />
        {errors.coolerLocation && <span className="text-red-500">This field is required</span>}
      </div>

      <div>
        <Label htmlFor="productType">Product Type</Label>
        <Select onValueChange={(value) => register('productType').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select product type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rawMilk">Raw Milk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="batchNumber">Batch/Lot Number</Label>
        <Input id="batchNumber" {...register('batchNumber', { required: true })} />
      </div>

      <div>
        <Label htmlFor="source">Source</Label>
        <Select onValueChange={handleSourceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kyalimaFarm">Kyalima Farm</SelectItem>
            <SelectItem value="anotherFarm">Another Farm</SelectItem>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="collectionCenter">Collection Center</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="sourceAddress">Source Location/Address</Label>
        <Input id="sourceAddress" value={sourceAddress} onChange={(e) => setSourceAddress(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="supplierContact">Farm or Supplier Contact Details</Label>
        <Input id="supplierContact" {...register('supplierContact')} />
      </div>

      <div>
        <Label htmlFor="quantity">Quantity Received</Label>
        <Input id="quantity" type="number" {...register('quantity', { required: true, min: 0 })} />
        <span className="ml-2">liters</span>
      </div>

      <div>
        <Label htmlFor="receptionDate">Reception Date</Label>
        <Input id="receptionDate" type="datetime-local" {...register('receptionDate', { required: true })} />
      </div>

      <div>
        <Label htmlFor="condition">Condition/Quality</Label>
        <Select onValueChange={(value) => register('condition').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="poor">Poor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="tpc">Total Plate Count (TPC) (cfu/ml)</Label>
        <Input id="tpc" type="number" {...register('tpc', { min: 0 })} />
      </div>

      <div>
        <Label htmlFor="scc">Somatic Cell Count (SCC) (cells/ml)</Label>
        <Input id="scc" type="number" {...register('scc', { min: 0 })} />
      </div>

      <div>
        <Label htmlFor="fatContent">Fat Content (%)</Label>
        <Input id="fatContent" type="number" step="0.1" {...register('fatContent', { min: 0, max: 100 })} />
      </div>

      <div>
        <Label htmlFor="proteinContent">Protein Content (%)</Label>
        <Input id="proteinContent" type="number" step="0.1" {...register('proteinContent', { min: 0, max: 100 })} />
      </div>

      <div>
        <Label htmlFor="lactoseContent">Lactose Content (%)</Label>
        <Input id="lactoseContent" type="number" step="0.1" {...register('lactoseContent', { min: 0, max: 100 })} />
      </div>

      <div>
        <Label htmlFor="destination">Destination (Storage Unit/Cooler Number)</Label>
        <Select onValueChange={(value) => register('destination').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cooler1">Cooler 1</SelectItem>
            <SelectItem value="cooler2">Cooler 2</SelectItem>
            <SelectItem value="cooler3">Cooler 3</SelectItem>
            <SelectItem value="cooler4">Cooler 4</SelectItem>
            <SelectItem value="cooler5">Cooler 5</SelectItem>
            <SelectItem value="cooler6">Cooler 6</SelectItem>
          </SelectContent>
        </Select>
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
        <Label htmlFor="entrantName">Entrant Name</Label>
        <Input id="entrantName" {...register('entrantName', { required: true })} />
      </div>

      <div>
        <Label htmlFor="entrantPIN">Entrant PIN (Personal Identification Number)</Label>
        <Input id="entrantPIN" type="password" {...register('entrantPIN', { required: true })} />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="receiverAuthentication" {...register('receiverAuthentication')} />
        <Label htmlFor="receiverAuthentication">I authenticate this reception</Label>
      </div>

      <Button type="submit" disabled={submitMutation.isLoading}>
        {submitMutation.isLoading ? 'Submitting...' : 'Submit'}
      </Button>

      {submitMutation.isSuccess && <p className="text-green-500">Form submitted successfully!</p>}
      {submitMutation.isError && <p className="text-red-500">An error occurred. Please try again.</p>}
    </form>
  );
};

export default ReceiveMilkForm;