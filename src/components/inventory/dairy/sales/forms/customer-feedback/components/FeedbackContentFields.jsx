
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const FeedbackContentFields = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="feedback_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Feedback</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Please enter customer feedback"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="improvement_suggestions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Improvement Suggestions</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter any suggestions for improvement"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default FeedbackContentFields;
