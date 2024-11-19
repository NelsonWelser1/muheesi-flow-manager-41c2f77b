import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const QuotationForm = () => {
  const { register, handleSubmit } = useForm();
  const { toast } = useToast();

  const onSubmit = (data) => {
    console.log('Quotation data:', data);
    toast({
      title: "Quotation Created",
      description: "The quotation has been successfully saved.",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Destination</Label>
          <Select onValueChange={(value) => register('destination').onChange(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tianjin">Tianjin</SelectItem>
              <SelectItem value="mersin">Mersin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Incoterm</Label>
          <Select onValueChange={(value) => register('incoterm').onChange(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select incoterm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fot">FOT Kampala</SelectItem>
              <SelectItem value="fob">FOB Mombasa</SelectItem>
              <SelectItem value="cif">CIF Tianjin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Number of Containers</Label>
          <Input type="number" {...register('containers')} />
        </div>

        <div className="space-y-2">
          <Label>Screen 18 (%)</Label>
          <Input type="number" {...register('screen18')} />
        </div>

        <div className="space-y-2">
          <Label>Screen 15 (%)</Label>
          <Input type="number" {...register('screen15')} />
        </div>

        <div className="space-y-2">
          <Label>Screen 12 (%)</Label>
          <Input type="number" {...register('screen12')} />
        </div>

        <div className="space-y-2">
          <Label>Notes</Label>
          <Input {...register('notes')} />
        </div>
      </div>

      <Button type="submit" className="w-full">Generate Quotation</Button>
    </form>
  );
};

export default QuotationForm;