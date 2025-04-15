
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form validation schema
const formSchema = z.object({
  cattleId: z.string({
    required_error: "Cattle is required",
  }),
  recordDate: z.string({
    required_error: "Record date is required",
  }),
  recordType: z.string({
    required_error: "Record type is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }).min(3, {
    message: "Description must be at least 3 characters",
  }),
  treatment: z.string().optional(),
  administeredBy: z.string().optional(),
  nextDueDate: z.string().optional(),
  notes: z.string().optional(),
});

const AddHealthRecordForm = ({ onSubmit, isSubmitting, onCancel, cattleData = [] }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cattleId: "",
      recordDate: new Date().toISOString().split('T')[0],
      recordType: "",
      description: "",
      treatment: "",
      administeredBy: "",
      nextDueDate: "",
      notes: "",
    },
  });

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="cattleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cattle *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={cattleData.length === 0}
                >
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
            name="recordDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Record Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recordType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Record Type *</FormLabel>
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
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="treatment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treatment</FormLabel>
                <FormControl>
                  <Input placeholder="Enter treatment details (if applicable)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="administeredBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Administered By</FormLabel>
                <FormControl>
                  <Input placeholder="Enter person who administered" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nextDueDate"
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
                <Textarea placeholder="Additional notes or observations" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Record"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddHealthRecordForm;
