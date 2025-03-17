
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const ExpenseTypeField = ({ setValue, register, errors }) => {
  return (
    <div className="space-y-2">
      <Label>Expense Type</Label>
      <Select 
        defaultValue=""
        onValueChange={(value) => setValue("expenseType", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select expense type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rent">Rent</SelectItem>
          <SelectItem value="utilities">Utilities</SelectItem>
          <SelectItem value="raw_materials">Raw Materials</SelectItem>
          <SelectItem value="salaries">Salaries</SelectItem>
          <SelectItem value="equipment">Equipment</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      <Input 
        type="hidden" 
        {...register("expenseType", { required: "Expense type is required" })} 
      />
      {errors.expenseType && (
        <p className="text-sm text-red-500">{errors.expenseType.message}</p>
      )}
    </div>
  );
};

export default ExpenseTypeField;
