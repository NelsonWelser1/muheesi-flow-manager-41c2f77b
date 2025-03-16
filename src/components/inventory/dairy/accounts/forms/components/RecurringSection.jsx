
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Check } from "lucide-react";

const RecurringFrequencies = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

const RecurringSection = ({ isRecurring, handleRecurringToggle, setValue, register }) => {
  return (
    <div className="border rounded-md p-4 mt-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id="recurring" 
            checked={isRecurring}
            onCheckedChange={handleRecurringToggle}
          />
          <Label htmlFor="recurring" className="cursor-pointer flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Set as Recurring
          </Label>
        </div>
        
        {isRecurring && (
          <div className="text-xs text-green-600 flex items-center gap-1">
            <Check className="h-3 w-3" /> Recurring Enabled
          </div>
        )}
      </div>
      
      {isRecurring && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select onValueChange={(value) => setValue("recurringFrequency", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {RecurringFrequencies.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="hidden" {...register("recurringFrequency")} />
          </div>
          
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input 
              type="date" 
              {...register("recurringEndDate")}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringSection;
