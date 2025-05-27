import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { useProduction } from "@/hooks/useProduction";
import { useMilkReception } from "@/hooks/useMilkReception";
import { supabase } from "@/integrations/supabase/supabase";

const cheeseTypes = [
  'Cheddar',
  'Mozzarella', 
  'Gouda',
  'Parmesan',
  'Brie',
  'Feta',
  'Swiss',
  'Provolone',
  'Monterey Jack',
  'Colby',
  'Other'
];

const starterCultures = [
  'Lactococcus lactis',
  'Lactococcus cremoris',
  'Lactococcus diacetylactis',
  'Streptococcus thermophilus',
  'Lactobacillus delbrueckii subsp. bulgaricus',
  'Lactobacillus helveticus',
  'Propionibacterium freudenreichii',
  'Bifidobacterium',
  'Other'
];

const coagulantTypes = [
  'Animal Rennet',
  'Vegetable Rennet',
  'Microbial Rennet',
  'FPC (Fermentation Produced Chymosin)',
  'Other'
];

const formSchema = z.object({
  batch_id: z.string().min(2, {
    message: "Batch ID must be at least 2 characters.",
  }),
  offload_batch_id: z.string().optional(),
  fromager_identifier: z.string().min(2, {
    message: "Fromager Identifier must be at least 2 characters.",
  }),
  cheese_type: z.string().min(2, {
    message: "Cheese Type must be at least 2 characters.",
  }),
  milk_volume: z.number({
    required_error: "Milk Volume is required.",
  }).min(1, {
    message: "Milk Volume must be greater than 0.",
  }),
  start_time: z.date({
    required_error: "Please select a start time.",
  }),
  estimated_duration: z.number({
    required_error: "Estimated Duration is required.",
  }).min(1, {
    message: "Estimated Duration must be greater than 0.",
  }),
  starter_culture: z.string().min(2, {
    message: "Starter Culture must be at least 2 characters.",
  }),
  starter_quantity: z.number({
    required_error: "Starter Quantity is required.",
  }).min(1, {
    message: "Starter Quantity must be greater than 0.",
  }),
  coagulant_type: z.string().min(2, {
    message: "Coagulant Type must be at least 2 characters.",
  }),
  coagulant_quantity: z.number({
    required_error: "Coagulant Quantity is required.",
  }).min(1, {
    message: "Coagulant Quantity must be greater than 0.",
  }),
  processing_temperature: z.number({
    required_error: "Processing Temperature is required.",
  }).min(1, {
    message: "Processing Temperature must be greater than 0.",
  }),
  processing_time: z.number({
    required_error: "Processing Time is required.",
  }).min(1, {
    message: "Processing Time must be greater than 0.",
  }),
  expected_yield: z.number({
    required_error: "Expected Yield is required.",
  }).min(1, {
    message: "Expected Yield must be greater than 0.",
  }),
  status: z.string().optional(),
  notes: z.string().optional(),
});

const ProductionLineForm = () => {
  const [selectedMarket, setSelectedMarket] = useState("local");
  const [availableOffloads, setAvailableOffloads] = useState([]);
  const [isLoadingOffloads, setIsLoadingOffloads] = useState(false);
  const { toast } = useToast();
  const { addProduction } = useProduction();
  const { data: milkReceptions } = useMilkReception();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batch_id: "",
      offload_batch_id: "",
      fromager_identifier: "",
      cheese_type: "",
      milk_volume: 0,
      start_time: new Date(),
      estimated_duration: 0,
      starter_culture: "",
      starter_quantity: 0,
      coagulant_type: "",
      coagulant_quantity: 0,
      processing_temperature: 0,
      processing_time: 0,
      expected_yield: 0,
      status: "pending",
      notes: ""
    }
  });

  const { handleSubmit } = form;

  useEffect(() => {
    updateAvailableOffloads();
  }, [selectedMarket]);

  const onSubmit = async (values) => {
    try {
      const newProductionData = {
        ...values,
        market: selectedMarket,
        milk_volume: Number(values.milk_volume),
        estimated_duration: Number(values.estimated_duration),
        starter_quantity: Number(values.starter_quantity),
        coagulant_quantity: Number(values.coagulant_quantity),
        processing_temperature: Number(values.processing_temperature),
        processing_time: Number(values.processing_time),
        expected_yield: Number(values.expected_yield),
        created_at: new Date(),
        id: uuidv4()
      };

      await addProduction.mutateAsync(newProductionData);
      form.reset();
      toast({
        title: "Success!",
        description: "New production line record added."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message
      });
    }
  };

  const updateAvailableOffloads = useCallback(async () => {
    if (!selectedMarket) return;

    try {
      setIsLoadingOffloads(true);
      console.log('Fetching offload batches for market:', selectedMarket);
      
      const tableName = selectedMarket === 'local' ? 'production_line_local' : 'production_line_international';
      const { data: offloads, error } = await supabase
        .from(tableName)
        .select('offload_batch_id')
        .not('offload_batch_id', 'is', null);

      if (error) {
        console.error('Error fetching offload batches:', error);
        setAvailableOffloads([]);
        return;
      }

      console.log('Raw offload data:', offloads);
      
      const transformedOffloads = (offloads || []).map(record => ({
        batch_id: record.offload_batch_id,
        offload_batch_id: record.offload_batch_id,
        supplier_name: "Milk Tank", // Default supplier name since it's not in the data
        milk_volume: 0, // Default volume since it's not in the data
        created_at: new Date().toISOString() // Default timestamp
      }));

      console.log('Transformed offloads:', transformedOffloads);
      setAvailableOffloads(transformedOffloads);
    } catch (error) {
      console.error('Error in updateAvailableOffloads:', error);
      setAvailableOffloads([]);
    } finally {
      setIsLoadingOffloads(false);
    }
  }, [selectedMarket]);

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Add Production Line</h2>
      
      {/* Market Selection */}
      <div className="mb-4">
        <Label htmlFor="market">Market</Label>
        <Select value={selectedMarket} onValueChange={setSelectedMarket}>
          <SelectTrigger id="market">
            <SelectValue placeholder="Select Market" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="local">Local</SelectItem>
            <SelectItem value="international">International</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="batch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter batch ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offload_batch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Milk Offload</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingOffloads ? "Loading..." : "Select an offload batch"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableOffloads.length > 0 ? (
                        availableOffloads.map((offload) => (
                          <SelectItem key={offload.batch_id} value={offload.batch_id}>
                            {offload.batch_id} - {offload.supplier_name} ({offload.milk_volume}L)
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-batches" disabled>
                          {isLoadingOffloads ? "Loading batches..." : "No offload batches available"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fromager_identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fromager Identifier</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter fromager identifier" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cheese_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cheese Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cheese type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cheeseTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="milk_volume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Milk Volume (L)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter milk volume"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
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
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DatePicker
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimated_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Duration (hours)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter estimated duration"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="starter_culture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starter Culture</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select starter culture" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {starterCultures.map((culture) => (
                        <SelectItem key={culture} value={culture}>
                          {culture}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="starter_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starter Quantity (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter starter quantity"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coagulant_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coagulant Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select coagulant type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {coagulantTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coagulant_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coagulant Quantity (ml)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter coagulant quantity"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processing_temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processing Temperature (°C)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter processing temperature"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processing_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processing Time (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter processing time"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expected_yield"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Yield (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter expected yield"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional notes"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Add Production Line
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductionLineForm;
