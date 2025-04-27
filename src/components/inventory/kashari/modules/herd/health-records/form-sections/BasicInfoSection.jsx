
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const BasicInfoSection = ({ form, cattleData }) => {
  return (
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
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoSection;
