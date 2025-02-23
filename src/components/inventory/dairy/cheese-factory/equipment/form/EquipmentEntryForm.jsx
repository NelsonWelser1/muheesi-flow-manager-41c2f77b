import React from 'react';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const EquipmentEntryForm = () => {
  const [date, setDate] = useState();
  const queryClient = useQueryClient();
  
  const form = useForm({
    defaultValues: {
      classification: "",
      name: "",
      type: "",
      model: "",
      useDescription: "",
      purchaseDate: "",
      purchaseCondition: "",
      currentCondition: "",
      serialNumber: "",
      manufacturer: "",
      notes: ""
    }
  });

  const { mutate: saveEquipment, isLoading } = useMutation({
    mutationFn: async (formData) => {
      console.log('Saving equipment with data:', formData);
      
      const { data, error } = await supabase
        .from('equipment')
        .insert([{
          classification: formData.classification,
          equipment_name: formData.name,
          type: formData.type,
          model: formData.model,
          use_description: formData.useDescription,
          purchase_date: formData.purchaseDate,
          purchase_condition: formData.purchaseCondition,
          current_condition: formData.currentCondition,
          serial_number: formData.serialNumber,
          manufacturer: formData.manufacturer,
          notes: formData.notes
        }])
        .select();

      if (error) {
        console.error('Error saving equipment:', error);
        throw error;
      }

      console.log('Equipment saved successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Equipment saved and cache invalidated');
      queryClient.invalidateQueries(['equipment']);
      form.reset();
    }
  });

  const onSubmit = (data) => {
    console.log('Form submitted with data:', data);
    saveEquipment(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-semibold mb-6">Add New Equipment</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Classification */}
            <FormField
              control={form.control}
              name="classification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classification</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select classification" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="machine">Machine</SelectItem>
                      <SelectItem value="tool">Tool</SelectItem>
                      <SelectItem value="gadget">Gadget</SelectItem>
                      <SelectItem value="spare_part">Spare Part</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Equipment Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter equipment name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Equipment Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter equipment type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Model */}
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter model number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Serial Number */}
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter serial number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Manufacturer */}
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter manufacturer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purchase Date */}
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Purchase Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purchase Condition */}
            <FormField
              control={form.control}
              name="purchaseCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Condition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition at purchase" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="brand_new">Brand New</SelectItem>
                      <SelectItem value="reconditioned">Reconditioned</SelectItem>
                      <SelectItem value="out_of_shape">Out of Shape</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Equipment Use */}
          <FormField
            control={form.control}
            name="useDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment Use</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the equipment's use and purpose" 
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Current Condition & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currentCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Condition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select current condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional notes or comments" 
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Equipment'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EquipmentEntryForm;
