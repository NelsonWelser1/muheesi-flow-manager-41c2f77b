
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ExpenseDetailsField = ({ register, errors }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="expenseDetails">Expense Details</Label>
      <Input
        id="expenseDetails"
        {...register("expenseDetails")}
        placeholder="Enter expense details"
        className="w-full"
      />
      {errors?.expenseDetails && (
        <p className="text-sm text-red-500">{errors.expenseDetails.message}</p>
      )}
    </div>
  );
};

export default ExpenseDetailsField;
