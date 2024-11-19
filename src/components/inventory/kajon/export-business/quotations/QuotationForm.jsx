import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAddQuotation } from '@/integrations/supabase/hooks/useQuotations';

const QuotationForm = () => {
  const { register, handleSubmit, setValue } = useForm();
  const { toast } = useToast();
  const addQuotation = useAddQuotation();

  const calculateProfitability = (data) => {
    // Calculate total revenue based on screen grades and prices
    const totalRevenue = (
      (data.screen_18_percent * 4.5) + 
      (data.screen_15_percent * 4.0) + 
      (data.screen_12_percent * 3.5)
    ) * data.num_containers * 19200; // 19.2MT per container

    // Calculate total costs
    const totalCosts = 
      parseFloat(data.transport_cost) + 
      parseFloat(data.ocean_freight) + 
      parseFloat(data.port_charges);

    return {
      total_revenue: totalRevenue,
      total_costs: totalCosts,
      net_profit: totalRevenue - totalCosts
    };
  };

  const onSubmit = async (data) => {
    console.log('Form data:', data);
    const profitability = calculateProfitability(data);
    
    try {
      await addQuotation.mutateAsync({
        ...data,
        ...profitability,
        sourcing_costs: JSON.stringify({
          screen_18: data.screen_18_cost,
          screen_15: data.screen_15_cost,
          screen_12: data.screen_12_cost,
        }),
      });

      toast({
        title: "Success",
        description: "Quotation has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating quotation:', error);
      toast({
        title: "Error",
        description: "Failed to create quotation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Destination</Label>
          <Select onValueChange={(value) => setValue('destination', value)}>
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
          <Select onValueChange={(value) => setValue('incoterm', value)}>
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
          <Input type="number" {...register('num_containers')} />
        </div>

        <div className="space-y-2">
          <Label>Screen 18 (%)</Label>
          <Input type="number" step="0.1" {...register('screen_18_percent')} />
        </div>

        <div className="space-y-2">
          <Label>Screen 15 (%)</Label>
          <Input type="number" step="0.1" {...register('screen_15_percent')} />
        </div>

        <div className="space-y-2">
          <Label>Screen 12 (%)</Label>
          <Input type="number" step="0.1" {...register('screen_12_percent')} />
        </div>

        <div className="space-y-2">
          <Label>Transport Cost (USD)</Label>
          <Input type="number" step="0.01" {...register('transport_cost')} />
        </div>

        <div className="space-y-2">
          <Label>Ocean Freight (USD)</Label>
          <Input type="number" step="0.01" {...register('ocean_freight')} />
        </div>

        <div className="space-y-2">
          <Label>Port Charges (USD)</Label>
          <Input type="number" step="0.01" {...register('port_charges')} />
        </div>

        <div className="space-y-2">
          <Label>Notes</Label>
          <Input {...register('notes')} />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={addQuotation.isPending}
      >
        {addQuotation.isPending ? "Creating..." : "Generate Quotation"}
      </Button>
    </form>
  );
};

export default QuotationForm;