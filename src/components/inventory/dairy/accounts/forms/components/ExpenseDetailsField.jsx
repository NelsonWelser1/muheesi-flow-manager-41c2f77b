
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ExpenseDetailsField = ({ register }) => {
  return (
    <div>
      <Label htmlFor="expenseDetails">Expense Details</Label>
      <Input
        id="expenseDetails"
        {...register("expenseDetails")}
        placeholder="Enter expense details"
      />
    </div>
  );
};

export default ExpenseDetailsField;
