
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCattleHealthRecords } from '@/hooks/useCattleHealthRecords';
import { Loader2 } from 'lucide-react';

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

const HealthRecordForm = ({ onSuccess, onCancel, cattleData = [], initialValues = null }) => {
  const { addHealthRecord, updateHealthRecord } = useCattleHealthRecords();
  
  // Initialize form with default values or edit values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      record_date: new Date().toISOString().split('T')[0],
      record_type: "",
      description: "",
      treatment: "",
      administered_by: "",
      next_due_date: "",
      notes: "",
    },
  });

  const isEditing = !!initialValues?.id;
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateHealthRecord.mutateAsync({
          id: initialValues.id,
          ...data
        });
      } else {
        await addHealthRecord.mutateAsync(data);
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Cattle Selection */}
          <FormField
            control={form.control}
            name="cattle_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cattle <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cattle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cattleData.map(cattle => (
                      <SelectItem key={cattle.id} value={cattle.id}>
                        {cattle.tag_number} - {cattle.name || 'Unnamed'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Record Date */}
          <FormField
            control={form.control}
            name="record_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Record Date <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Record Type */}
          <FormField
            control={form.control}
            name="record_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Record Type <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
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

          {/* Next Due Date */}
          <FormField
            control={form.control}
            name="next_due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Treatment */}
          <FormField
            control={form.control}
            name="treatment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treatment</FormLabel>
                <FormControl>
                  <Input placeholder="Enter treatment details" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Administered By */}
          <FormField
            control={form.control}
            name="administered_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Administered By</FormLabel>
                <FormControl>
                  <Input placeholder="Name of vet or administrator" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the health record" className="min-h-[80px]" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes" className="min-h-[80px]" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Record' : 'Save Record'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HealthRecordForm;
