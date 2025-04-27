
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Stethoscope, Save } from "lucide-react";
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import BasicInfoSection from './health-records/form-sections/BasicInfoSection';
import RecordDetailsSection from './health-records/form-sections/RecordDetailsSection';
import TreatmentSection from './health-records/form-sections/TreatmentSection';
import AdditionalDetailsSection from './health-records/form-sections/AdditionalDetailsSection';

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
        
        if (error) throw error;
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
      
      const formattedData = {
        ...data,
        cattle_id: data.cattle_id,
        record_date: data.record_date,
        treatment: data.treatment || null,
        administered_by: data.administered_by || null,
        next_due_date: data.next_due_date || null,
        notes: data.notes || null
      };
      
      await addHealthRecord.mutateAsync(formattedData);
      
      form.reset({
        record_date: new Date().toISOString().split('T')[0],
        record_type: "",
        description: "",
        treatment: "",
        administered_by: "",
        next_due_date: "",
        notes: "",
      });
      
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
            <BasicInfoSection form={form} cattleData={cattleData} />
            <RecordDetailsSection form={form} />
            <TreatmentSection form={form} />
            <AdditionalDetailsSection form={form} />

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
