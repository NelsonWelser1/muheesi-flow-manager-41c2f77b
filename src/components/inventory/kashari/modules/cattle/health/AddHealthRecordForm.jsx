
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  cattleId: z.string({
    required_error: "Please select a cattle",
  }),
  recordDate: z.date({
    required_error: "Record date is required",
  }),
  recordType: z.enum(["vaccination", "treatment", "examination", "deworming"], {
    required_error: "Please select a record type",
  }),
  description: z.string().min(1, "Description is required"),
  treatment: z.string().optional(),
  administeredBy: z.string().min(1, "Administrator name is required"),
  nextDueDate: z.date().optional(),
  notes: z.string().optional(),
});

const AddHealthRecordForm = ({ onSubmit, isSubmitting, onCancel, cattleData }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recordDate: new Date(),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="border rounded-lg p-6 bg-white shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b pb-4">
            <Stethoscope className="h-5 w-5 text-purple-500" />
            <h2 className="text-xl font-semibold">Add Health Record</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cattle Selection */}
            <FormField
              control={form.control}
              name="cattleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Cattle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cattle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cattleData?.map((cattle) => (
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

            {/* Record Date */}
            <FormField
              control={form.control}
              name="recordDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Record Date</FormLabel>
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
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Record Type */}
            <FormField
              control={form.control}
              name="recordType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
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

            {/* Administered By */}
            <FormField
              control={form.control}
              name="administeredBy"
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

          {/* Treatment/Description Section */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
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

            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment/Medication</FormLabel>
                  <FormControl>
                    <Input placeholder="Medication or treatment provided" {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional: Enter any specific medications or treatments administered
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Next Due Date */}
            <FormField
              control={form.control}
              name="nextDueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Next Due Date</FormLabel>
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
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Optional: Set a follow-up date if needed
                  </FormDescription>
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
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes or observations"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90"
            >
              {isSubmitting ? "Saving..." : "Save Record"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AddHealthRecordForm;

