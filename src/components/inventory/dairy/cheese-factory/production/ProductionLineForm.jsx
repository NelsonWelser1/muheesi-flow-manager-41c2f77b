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
import { supabase } from "@/integrations/supabase";

const cheeseTypes = [
  "Cheddar",
  "Gouda",
  "Mozzarella",
  "Parmesan",
  "Brie",
  "Feta",
  " সুইস",
  "Blue Cheese",
  "Provolone",
  "Monterey Jack"
];

const starterCultures = [
  "Lactococcus lactis",
  "Lactococcus cremoris",
  "Lactococcus diacetylactis",
  "Streptococcus thermophilus",
  "Lactobacillus delbrueckii subsp. bulgaricus",
  "Lactobacillus helveticus",
  "Propionibacterium freudenreichii",
  "Bifidobacterium animalis",
  "Leuconostoc mesenteroides",
  "Pediococcus acidilactici"
];

const coagulantTypes = [
  "Animal Rennet",
  "Vegetable Rennet",
  "Microbial Rennet",
  "Fungal Rennet",
  "Fermentation-Produced Chymosin (FPC)",
  "Acid Coagulation",
  "Heat Coagulation",
  "Calcium Chloride",
  "Citric Acid",
  "Vinegar"
];

const formSchema = z.object({
  batch_id: z.string().min(2, {
    message: "Batch ID must be at least 2 characters.",
  }),
  offload_batch_id: z.string().min(2, {
    message: "Offload Batch ID must be selected.",
  }),
  fromager_identifier: z.string().optional(),
  cheese_type: z.string().min(2, {
    message: "Cheese type must be at least 2 characters.",
  }),
  milk_volume: z.number().min(1, {
    message: "Milk volume must be greater than 0.",
  }),
  start_time: z.date(),
  estimated_duration: z.number().min(1, {
    message: "Estimated duration must be greater than 0.",
  }),
  starter_culture: z.string().min(2, {
    message: "Starter culture must be at least 2 characters.",
  }),
  starter_quantity: z.number().min(1, {
    message: "Starter quantity must be greater than 0.",
  }),
  coagulant_type: z.string().min(2, {
    message: "Coagulant type must be at least 2 characters.",
  }),
  coagulant_quantity: z.number().min(1, {
    message: "Coagulant quantity must be greater than 0.",
  }),
  processing_temperature: z.number().min(1, {
    message: "Processing temperature must be greater than 0.",
  }),
  processing_time: z.number().min(1, {
    message: "Processing time must be greater than 0.",
  }),
  expected_yield: z.number().min(1, {
    message: "Expected yield must be greater than 0.",
  }),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  notes: z.string().optional(),
});

const ProductionLineForm = () => {
  const [selectedMarket, setSelectedMarket] = useState('local');
  const [availableOffloads, setAvailableOffloads] = useState([]);
  const [isLoadingOffloads, setIsLoadingOffloads] = useState(false);
  const { toast } = useToast();
  const { addProduction } = useProduction();
  const { data: milkReceptions } = useMilkReception();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batch_id: '',
      offload_batch_id: '',
      fromager_identifier: '',
      cheese_type: '',
      milk_volume: 0,
      start_time: new Date(),
      estimated_duration: 0,
      starter_culture: '',
      starter_quantity: 0,
      coagulant_type: '',
      coagulant_quantity: 0,
      processing_temperature: 0,
      processing_time: 0,
      expected_yield: 0,
      status: 'pending',
      notes: '',
    },
  });

  const { handleSubmit } = form;

  const updateAvailableOffloads = useCallback(async () => {
    if (!selectedMarket) return;
    
    try {
      setIsLoadingOffloads(true);
      console.log('Fetching offload batches for market:', selectedMarket);
      
      // Fetch offload batches from milk reception data
      const offloadData = milkReceptions?.filter(record => 
        record.batch_id && record.batch_id.trim() !== ''
      ) || [];
      
      console.log('Available offload batches:', offloadData);
      
      // Transform the data to match expected format
      const transformedOffloads = offloadData.map(record => ({
        batch_id: record.batch_id,
        offload_batch_id: record.batch_id,
        supplier_name: record.supplier_name || 'Unknown Supplier',
        milk_volume: record.milk_volume || 0,
        created_at: record.created_at || new Date().toISOString()
      }));
      
      console.log('Transformed offloads:', transformedOffloads);
      setAvailableOffloads(transformedOffloads);
      
    } catch (error) {
      console.error('Error in updateAvailableOffloads:', error);
      setAvailableOffloads([]);
    } finally {
      setIsLoadingOffloads(false);
    }
  }, [selectedMarket, milkReceptions]);

  useEffect(() => {
    updateAvailableOffloads();
  }, [updateAvailableOffloads]);

  const onSubmit = async (data) => {
    console.log("Production data:", data);
    try {
      const productionData = {
        ...data,
        id: uuidv4(),
        start_time: data.start_time.toISOString(),
      };
      
      await addProduction.mutateAsync(productionData);
      toast({
        title: "Success",
        description: "Production line added successfully!",
      });
      form.reset();
    } catch (error) {
      console.error("Error adding production line:", error);
      toast({
        title: "Error",
        description: "Failed to add production line. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Add Production Line</h2>
        <p className="text-gray-500">Fill in the details below to add a new production line.</p>
      </div>

      <div className="mb-4">
        <Label htmlFor="market" className="block text-sm font-medium text-gray-700">
          Market
        </Label>
        <Select value={selectedMarket} onValueChange={setSelectedMarket}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select market" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="local">Local</SelectItem>
            <SelectItem value="export">Export</SelectItem>
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
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoadingOffloads}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingOffloads ? "Loading offloads..." : "Select an offload batch"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableOffloads.length === 0 ? (
                        <SelectItem value="no-offloads" disabled>
                          No offload batches available
                        </SelectItem>
                      ) : (
                        availableOffloads.map((offload) => (
                          <SelectItem key={offload.batch_id} value={offload.batch_id}>
                            {offload.batch_id} - {offload.supplier_name} ({offload.milk_volume}L)
                          </SelectItem>
                        ))
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
                        <SelectValue placeholder="Select a cheese type" />
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
                <FormItem className="flex flex-col">
                  <FormLabel>Start Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DatePicker
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={false}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the start date and time for the production line.
                  </FormDescription>
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
                        <SelectValue placeholder="Select a starter culture" />
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
                  <FormLabel>Starter Quantity (grams)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter starter quantity"
                      {...field}
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
                        <SelectValue placeholder="Select a coagulant type" />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
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
