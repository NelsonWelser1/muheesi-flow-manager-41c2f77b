
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const TermsConditionsSection = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="terms_conditions"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Terms & Conditions</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Enter terms and conditions"
              className="min-h-[150px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TermsConditionsSection;
