
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const DeductionsSection = ({ register, errors }) => {
  return (
    <div className="border p-4 rounded-lg space-y-4">
      <h3 className="font-medium">Deductions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tax Amount</Label>
          <Input type="number" step="0.01" defaultValue="0" {...register("taxAmount", {
            min: {
              value: 0,
              message: "Amount cannot be negative"
            }
          })} />
          {errors.taxAmount && <p className="text-sm text-red-500">{errors.taxAmount.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>NSSF Amount</Label>
          <Input type="number" step="0.01" defaultValue="0" {...register("nssfAmount", {
            min: {
              value: 0,
              message: "Amount cannot be negative"
            }
          })} />
          {errors.nssfAmount && <p className="text-sm text-red-500">{errors.nssfAmount.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Loan Deduction</Label>
          <Input type="number" step="0.01" defaultValue="0" {...register("loanDeduction", {
            min: {
              value: 0,
              message: "Amount cannot be negative"
            }
          })} />
          {errors.loanDeduction && <p className="text-sm text-red-500">{errors.loanDeduction.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Other Deductions</Label>
          <Input type="number" step="0.01" defaultValue="0" {...register("otherDeductions", {
            min: {
              value: 0,
              message: "Amount cannot be negative"
            }
          })} />
          {errors.otherDeductions && <p className="text-sm text-red-500">{errors.otherDeductions.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default DeductionsSection;
