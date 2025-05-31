import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useMilkReception } from '@/hooks/useMilkReception';

const formSchema = z.object({
  batch_id: z.string().min(2, {
    message: "Batch ID must be at least 2 characters.",
  }),
  offload_batch_id: z.string().min(2, {
    message: "Offload Batch ID must be at least 2 characters.",
  }),
  fromager_identifier: z.string().min(2, {
    message: "Fromager Identifier must be at least 2 characters.",
  }),
  cheese_type: z.string().min(2, {
    message: "Cheese Type must be at least 2 characters.",
  }),
  milk_volume: z.number().min(1, {
    message: "Milk Volume must be at least 1 liter.",
  }),
  start_time: z.date(),
  estimated_duration: z.number().min(1, {
    message: "Estimated Duration must be at least 1 hour.",
  }),
  starter_culture: z.string().min(2, {
    message: "Starter Culture must be at least 2 characters.",
  }),
  starter_quantity: z.number().min(1, {
    message: "Starter Quantity must be at least 1 unit.",
  }),
  coagulant_type: z.string().min(2, {
    message: "Coagulant Type must be at least 2 characters.",
  }),
  coagulant_quantity: z.number().min(1, {
    message: "Coagulant Quantity must be at least 1 unit.",
  }),
  processing_temperature: z.number().min(1, {
    message: "Processing Temperature must be at least 1 degree Celsius.",
  }),
  processing_time: z.number().min(1, {
    message: "Processing Time must be at least 1 minute.",
  }),
  expected_yield: z.number().min(1, {
    message: "Expected Yield must be at least 1 unit.",
  }),
  status: z.enum(["pending", "in_progress", "completed", "failed"]),
  notes: z.string().optional(),
});

const ProductionLineForm = () => {
  const [selectedMarket, setSelectedMarket] = useState("local");
  const [availableOffloads, setAvailableOffloads] = useState([]);
  const [isLoadingOffloads, setIsLoadingOffloads] = useState(false);
  const { toast } = useToast();
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

  const updateAvailableOffloads = useCallback(async () => {
    if (!selectedMarket) return;
    
    try {
      setIsLoadingOffloads(true);
      console.log('Fetching milk reception data for offloads');
      
      // Filter milk reception data to get available batches
      const availableBatches = (milkReceptions || [])
        .filter(reception => reception.batch_id && reception.tank_number)
        .map(reception => ({
          batch_id: reception.batch_id,
          offload_batch_id: reception.batch_id,
          supplier_name: reception.supplier_name || 'Unknown Supplier',
          milk_volume: reception.milk_volume || 0,
          tank_number: reception.tank_number,
          created_at: reception.created_at || new Date().toISOString()
        }));

      console.log('Available milk batches:', availableBatches);
      setAvailableOffloads(availableBatches);
      
    } catch (error) {
      console.error('Error fetching milk batches:', error);
      setAvailableOffloads([]);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch milk batches"
      });
    } finally {
      setIsLoadingOffloads(false);
    }
  }, [selectedMarket, milkReceptions, toast]);

  useEffect(() => {
    updateAvailableOffloads();
  }, [updateAvailableOffloads]);

  const onSubmit = (data) => {
    console.log("Form values:", data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 font-mono text-white">
          <code className="break-words">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  };

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
            
            {/* Batch ID Field */}
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

            {/* Select Milk Batch - Fixed */}
            <FormField
              control={form.control}
              name="offload_batch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Milk Batch</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isLoadingOffloads}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingOffloads ? "Loading batches..." : "Select milk batch"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableOffloads.map((offload) => (
                        <SelectItem 
                          key={offload.batch_id} 
                          value={offload.batch_id}
                        >
                          {`${offload.batch_id} - ${offload.supplier_name} (${offload.milk_volume}L)`}
                        </SelectItem>
                      ))}
                      {availableOffloads.length === 0 && !isLoadingOffloads && (
                        <SelectItem value="no-batches" disabled>
                          No milk batches available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fromager Identifier Field */}
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

            {/* Cheese Type Field */}
            <FormField
              control={form.control}
              name="cheese_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cheese Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter cheese type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Milk Volume Field */}
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

            {/* Start Time Field */}
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
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

            {/* Estimated Duration Field */}
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

            {/* Starter Culture Field */}
            <FormField
              control={form.control}
              name="starter_culture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starter Culture</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter starter culture" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Starter Quantity Field */}
            <FormField
              control={form.control}
              name="starter_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starter Quantity</FormLabel>
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

            {/* Coagulant Type Field */}
            <FormField
              control={form.control}
              name="coagulant_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coagulant Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter coagulant type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Coagulant Quantity Field */}
            <FormField
              control={form.control}
              name="coagulant_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coagulant Quantity</FormLabel>
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

            {/* Processing Temperature Field */}
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

            {/* Processing Time Field */}
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

            {/* Expected Yield Field */}
            <FormField
              control={form.control}
              name="expected_yield"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Yield</FormLabel>
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

            {/* Status Field */}
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
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Notes Field */}
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

          {/* Submit Button */}
          <Button type="submit">Add Production Line</Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductionLineForm;
