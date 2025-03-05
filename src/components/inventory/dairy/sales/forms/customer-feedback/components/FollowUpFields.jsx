
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FollowUpFields = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="follow_up_required"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Follow-up Required</FormLabel>
              <p className="text-sm text-muted-foreground">
                Check if this feedback requires follow-up
              </p>
            </div>
          </FormItem>
        )}
      />

      {form.watch('follow_up_required') && (
        <FormField
          control={form.control}
          name="follow_up_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Follow-up Status</FormLabel>
              <Select 
                defaultValue={field.value} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="not_required">Not Required</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default FollowUpFields;
