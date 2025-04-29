import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, FlaskConical } from "lucide-react";

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

const AddHealthRecordForm = ({ onCancel, onSuccess, cattleData = [] }) => {
  const { toast } = useToast();
  const { addHealthRecord } = useHealthRecords();

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
      console.log("Form data being submitted:", data);
      await addHealthRecord.mutateAsync(data);
      form.reset();
      if (onSuccess) onSuccess();
      else if (onCancel) onCancel();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add health record",
        variant: "destructive",
      });
    }
  };

  const handleAutoSubmit = () => {
    // Fill form with test data
    form.setValue("cattle_id", cattleData[0]?.id || "");
    form.setValue("record_type", "vaccination");
    form.setValue("description", "Routine vaccination");
    form.setValue("treatment", "FMD Vaccine");
    form.setValue("administered_by", "Dr. Veterinarian");
    form.setValue("next_due_date", new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]);
    form.setValue("notes", "No adverse reactions observed");
  };

  return (
    <div className="space-y-6">
      {onCancel && (
        <Button 
          variant="ghost" 
          onClick={onCancel} 
          className="flex items-center gap-1 p-0 h-auto mb-2"
        >
          <ArrowLeft size={16} /> Back to Health Records
        </Button>
      )}

      <div className="flex items-center gap-2 mb-2">
        <FlaskConical size={20} className="text-purple-500" />
        <h2 className="text-xl font-semibold">Add Health Record</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="cattle_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Cattle <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            
            <FormField
              control={form.control}
              name="record_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Date <span className="text-red-500">*</span></FormLabel>
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
            name="record_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Record Type <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the treatment, vaccination or examination" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment/Medication</FormLabel>
                  <FormControl>
                    <Input placeholder="Medication or treatment provided" {...field} />
                  </FormControl>
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
                    <Input placeholder="Name of vet or caretaker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes or observations"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAutoSubmit} 
              className="flex items-center gap-1"
            >
              Test Auto-Submit
            </Button>
            
            <div className="space-x-2">
              <Button 
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={addHealthRecord.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {addHealthRecord.isPending ? "Saving..." : "Save Record"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddHealthRecordForm;
