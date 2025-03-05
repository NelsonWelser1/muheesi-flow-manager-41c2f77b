
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const TermsSection = ({ register }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="terms_conditions">Terms & Conditions</Label>
      <Textarea 
        id="terms_conditions" 
        {...register("terms_conditions")} 
        rows={5}
        placeholder="Enter the terms and conditions for this proposal..."
        defaultValue="Payment due within 30 days of invoice date.
Prices are subject to change based on market conditions.
Delivery will be arranged upon confirmation of order."
      />
    </div>
  );
};

export default TermsSection;
