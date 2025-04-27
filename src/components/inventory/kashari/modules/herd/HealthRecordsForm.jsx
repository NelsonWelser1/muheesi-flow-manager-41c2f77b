
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope, Save } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

// Form validation schema 
const formSchema = z.object({
  cattle_id: z.string({
    required_error: "Cattle is required",
  }),
  record_date: z.string({
    required_error: "Record date is required",
  }),
  record_type: z.string({
    required_error: "Record type is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }).min(3, {
    message: "Description must be at least 3 characters",
  }),
  treatment: z.string().optional(),
  administered_by: z.string().optional(),
  next_due_date: z.string().optional(),
  notes: z.string().optional(),
});

const HealthRecordsForm = () => {
  const { toast } = useToast();
  const { addHealthRecord, refetch } = useHealthRecords();
  const [cattleData, setCattleData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchCattleData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('cattle_inventory')
          .select('id, tag_number, name');
        
        if (error) {
          console.error("Error fetching cattle data:", error);
          throw error;
        }
        
        setCattleData(data || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load cattle data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCattleData();
  }, [toast]);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      record_date: new Date().toISOString().split('T')[0],
      record_type: "",
      description: "",
      treatment: "",
      administered_by: "",
      next_due_date: "",
      notes: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Form data being submitted:", data);
      
      // Ensure all data is properly formatted
      const formattedData = {
        ...data,
        cattle_id: data.cattle_id, // Ensure we have a valid cattle_id
        record_date: data.record_date, // Ensure we have a valid date
        // Make sure optional fields are handled correctly
        treatment: data.treatment || null,
        administered_by: data.administered_by || null,
        next_due_date: data.next_due_date || null,
        notes: data.notes || null
      };
      
      await addHealthRecord.mutateAsync(formattedData);
      
      // Reset form after successful submission
      form.reset({
        record_date: new Date().toISOString().split('T')[0],
        record_type: "",
        description: "",
        treatment: "",
        administered_by: "",
        next_due_date: "",
        notes: "",
      });
      
      // Refresh the data
      refetch();
      
      toast({
        title: "Success",
        description: "Health record added successfully",
      });
    } catch (error) {
      console.error("Error adding health record:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add health record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-purple-500" />
          Add Health Record
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cattle_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Cattle <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cattle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cattleData.map((cattle) => (
                          <SelectItem key={cattle.id} value={cattle.id}>
                            {cattle.tag_number} - {cattle.name || "Unnamed"}
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
                name="record_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Record Date <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="record_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Record Type <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select record type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vaccination">Vaccination</SelectItem>
                        <SelectItem value="treatment">Treatment</SelectItem>
                        <SelectItem value="examination">Examination</SelectItem>
                        <SelectItem value="deworming">Deworming</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="administered_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Administered By</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Name of vet or caretaker"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the treatment, vaccination or examination"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="treatment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment/Medication</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Medication or treatment provided"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="next_due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                      placeholder="Additional notes or observations"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting || isLoading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Record"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default HealthRecordsForm;
