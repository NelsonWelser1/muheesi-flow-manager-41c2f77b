
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CalendarIcon, Beef, Scale, Users } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBukomeroFattening } from '@/hooks/useBukomeroFattening';

const AddCattleForm = ({ onSuccess }) => {
  const { toast } = useToast();
  const { addFatteningProgram } = useBukomeroFattening();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [batchMode, setBatchMode] = useState(false);

  // Define form validation schema
  const formSchema = z.object({
    tag_number: z.string().min(1, "Tag number is required"),
    name: z.string().optional(),
    breed: z.string({ required_error: "Please select a breed" }),
    cattle_type: z.string({ required_error: "Please select a cattle type" }),
    date_of_birth: z.string().optional(),
    entry_date: z.string({ required_error: "Entry date is required" }),
    entry_weight: z.coerce
      .number({ required_error: "Entry weight is required" })
      .positive("Entry weight must be greater than 0"),
    current_weight: z.coerce
      .number({ required_error: "Current weight is required" })
      .positive("Current weight must be greater than 0"),
    target_weight: z.coerce
      .number({ required_error: "Target weight is required" })
      .positive("Target weight must be greater than 0"),
    feeding_regime: z.string({ required_error: "Please select a feeding regime" }),
    batch_count: z.coerce
      .number()
      .min(1, "Batch count must be at least 1")
      .optional(),
    notes: z.string().optional()
  });

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tag_number: "",
      name: "",
      breed: "ankole",
      cattle_type: "steer",
      date_of_birth: "",
      entry_date: format(new Date(), 'yyyy-MM-dd'),
      entry_weight: "",
      current_weight: "",
      target_weight: "",
      feeding_regime: "standard",
      batch_count: 1,
      notes: ""
    }
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    
    try {
      // Prepare data to match API requirements
      const cattleData = {
        ...values,
        status: "active",
        entry_date: values.entry_date || format(new Date(), 'yyyy-MM-dd'),
        farm_id: "bukomero"
      };
      
      console.log("Submitting cattle data:", cattleData);
      const result = await addFatteningProgram(cattleData);
      
      if (result) {
        toast({
          title: "Success",
          description: batchMode ? 
            `${values.batch_count} cattle added to fattening program successfully` :
            "Cattle added to fattening program successfully",
        });
        
        // Reset form
        form.reset({
          tag_number: "",
          name: "",
          breed: "ankole",
          cattle_type: "steer",
          date_of_birth: "",
          entry_date: format(new Date(), 'yyyy-MM-dd'),
          entry_weight: "",
          current_weight: "",
          target_weight: "",
          feeding_regime: "standard",
          batch_count: 1,
          notes: ""
        });
        
        // Trigger any parent component callback if provided
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error adding cattle:", error);
      toast({
        title: "Error",
        description: "Failed to add cattle to fattening program: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-green-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-green-800 flex items-center gap-2">
            <Beef className="h-5 w-5 text-green-700" />
            Add Cattle to Fattening Program
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="batch-mode" className="text-sm text-green-700">Batch Entry</Label>
            <input 
              id="batch-mode" 
              type="checkbox" 
              checked={batchMode} 
              onChange={() => setBatchMode(!batchMode)}
              className="rounded border-green-300 text-green-600 focus:ring-green-500"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tag Number */}
              <FormField
                control={form.control}
                name="tag_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Tag Number *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter cattle tag number" 
                        className="border-green-200 focus:border-green-300 focus:ring-green-200"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {batchMode && "For batch entries, sequential numbers will be added to this base tag"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter cattle name (optional)" 
                        className="border-green-200 focus:border-green-300 focus:ring-green-200"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {batchMode && "For batch entries, sequential numbers will be added to this base name"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cattle Type */}
              <FormField
                control={form.control}
                name="cattle_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Cattle Type *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-green-200 focus:ring-green-200">
                          <SelectValue placeholder="Select cattle type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bull">Bull (Breeder)</SelectItem>
                        <SelectItem value="cow">Cow (Mother)</SelectItem>
                        <SelectItem value="heifer_calf">Heifer-Calf</SelectItem>
                        <SelectItem value="bull_calf">Bull-Calf</SelectItem>
                        <SelectItem value="heifer">Heifer</SelectItem>
                        <SelectItem value="steer">Steer (Castrated Male)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Breed */}
              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Breed *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-green-200 focus:ring-green-200">
                          <SelectValue placeholder="Select cattle breed" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ankole">Ankole Longhorn</SelectItem>
                        <SelectItem value="boran">Boran</SelectItem>
                        <SelectItem value="friesian">Friesian</SelectItem>
                        <SelectItem value="jersey">Jersey</SelectItem>
                        <SelectItem value="hereford">Hereford</SelectItem>
                        <SelectItem value="aberdeen">Aberdeen</SelectItem>
                        <SelectItem value="angus">Angus</SelectItem>
                        <SelectItem value="charolais">Charolais</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Date of Birth</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="date" 
                          className="border-green-200 focus:border-green-300 focus:ring-green-200"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Entry Date */}
              <FormField
                control={form.control}
                name="entry_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Entry Date *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="date" 
                          className="border-green-200 focus:border-green-300 focus:ring-green-200"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Date the cattle entered the fattening program
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Entry Weight */}
              <FormField
                control={form.control}
                name="entry_weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Entry Weight (kg) *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number"
                          step="0.1"
                          placeholder="Enter weight in kg" 
                          className="border-green-200 focus:border-green-300 focus:ring-green-200"
                          {...field} 
                        />
                        <Scale className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Current Weight */}
              <FormField
                control={form.control}
                name="current_weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Current Weight (kg) *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number"
                          step="0.1"
                          placeholder="Enter weight in kg" 
                          className="border-green-200 focus:border-green-300 focus:ring-green-200"
                          {...field} 
                        />
                        <Scale className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      If same as entry weight, enter the same value
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target Weight */}
              <FormField
                control={form.control}
                name="target_weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Target Weight (kg) *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number"
                          step="0.1"
                          placeholder="Enter target weight in kg" 
                          className="border-green-200 focus:border-green-300 focus:ring-green-200"
                          {...field} 
                        />
                        <Scale className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Feeding Regime - Updated to match database constraint */}
              <FormField
                control={form.control}
                name="feeding_regime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Feeding Regime *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-green-200 focus:ring-green-200">
                          <SelectValue placeholder="Select feeding regime" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="intensive">Intensive (High-grain)</SelectItem>
                        <SelectItem value="semi_intensive">Semi-Intensive (Mixed)</SelectItem>
                        <SelectItem value="pasture_based">Pasture-Based</SelectItem>
                        <SelectItem value="silage_based">Silage-Based</SelectItem>
                        <SelectItem value="pasture_silage">Pasture-Silage Based</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="specialized">Specialized</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      The feeding approach used for this cattle
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Batch Count - Only show when batch mode is enabled */}
              {batchMode && (
                <FormField
                  control={form.control}
                  name="batch_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-green-700">Number of Cattle in Batch *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Enter number of cattle" 
                            className="border-green-200 focus:border-green-300 focus:ring-green-200"
                            {...field} 
                          />
                          <Users className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Sequential tag numbers will be generated for each animal in the batch
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700">Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter additional notes about this cattle" 
                      className="border-green-200 focus:border-green-300 focus:ring-green-200"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
                    {batchMode ? 'Adding Batch...' : 'Adding...'}
                  </>
                ) : (
                  batchMode ? 'Add Batch to Fattening Program' : 'Add to Fattening Program'
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 mb-1">Important Information</h4>
              <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                <li>Daily weight gain is automatically calculated based on entry date and weights</li>
                <li>Expected completion date will be estimated based on growth rate</li>
                <li>Regular weight updates are essential for accurate projections</li>
                {batchMode && <li>Batch entries will receive sequential tag numbers based on the provided tag number</li>}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddCattleForm;
