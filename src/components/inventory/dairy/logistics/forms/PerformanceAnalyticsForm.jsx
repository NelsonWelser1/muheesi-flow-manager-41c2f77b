
import React from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";

const DELAY_REASONS = ["Traffic", "Weather", "Operational", "Other"];
const RATINGS = [1, 2, 3, 4, 5];

const PerformanceAnalyticsForm = () => {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const { toast } = useToast();
  const actionRequired = watch("action_required", false);

  const onSubmit = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit performance records",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('logistics_delivery_performance')
        .insert([{
          ...data,
          operator_id: user.id,
          performance_rating: parseInt(data.performance_rating),
          delivery_time: parseInt(data.delivery_time),
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Performance record saved successfully",
      });
      reset();
    } catch (error) {
      console.error('Error saving performance record:', error);
      toast({
        title: "Error",
        description: "Failed to save performance record",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Delivery ID</Label>
          <Input {...register("delivery_id", { required: true })} />
        </div>

        <div className="space-y-2">
          <Label>Performance Rating</Label>
          <Select onValueChange={(value) => setValue("performance_rating", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              {RATINGS.map((rating) => (
                <SelectItem key={rating} value={rating}>
                  {rating} Star{rating !== 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Delivery Time (minutes)</Label>
          <Input type="number" {...register("delivery_time", { required: true, min: 0 })} />
        </div>

        <div className="space-y-2">
          <Label>Delay Reason (if applicable)</Label>
          <Select onValueChange={(value) => setValue("delay_reason", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              {DELAY_REASONS.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="action_required"
            onCheckedChange={(checked) => setValue("action_required", checked)}
          />
          <Label htmlFor="action_required">Action Required</Label>
        </div>
        {actionRequired && (
          <Input
            placeholder="Specify required action"
            {...register("action_details")}
          />
        )}
      </div>

      <div className="space-y-2">
        <Label>Comments/Performance Feedback</Label>
        <Textarea {...register("comments")} />
      </div>

      <Button type="submit" className="w-full">Submit Performance Record</Button>
    </form>
  );
};

export default PerformanceAnalyticsForm;
