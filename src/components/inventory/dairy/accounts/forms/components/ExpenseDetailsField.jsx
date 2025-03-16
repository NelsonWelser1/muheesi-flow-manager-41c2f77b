
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ExpenseDetailsField = ({ register }) => {
  return (
    <div className="space-y-2">
      <Label>Expense Details</Label>
      <Textarea 
        {...register("expenseDetails")} 
        placeholder="Add details specific to this expense type"
        rows={3}
      />
    </div>
  );
};

export default ExpenseDetailsField;
