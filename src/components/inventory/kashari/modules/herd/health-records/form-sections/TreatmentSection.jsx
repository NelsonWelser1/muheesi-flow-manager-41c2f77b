
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const TreatmentSection = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  );
};

export default TreatmentSection;
