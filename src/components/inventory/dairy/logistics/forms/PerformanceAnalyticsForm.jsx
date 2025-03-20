import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { usePerformanceAnalytics } from "@/hooks/usePerformanceAnalytics";
const DELAY_REASONS = ["Traffic", "Weather", "Operational", "Other"];
const RATINGS = [1, 2, 3, 4, 5];
const PerformanceAnalyticsForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {
      errors
    }
  } = useForm();
  const {
    toast
  } = useToast();
  const {
    addPerformanceRecord,
    isLoading
  } = usePerformanceAnalytics();
  const [debugData, setDebugData] = useState(null);
  const actionRequired = watch("action_required", false);
  const onSubmit = async data => {
    try {
      console.log("Form data before submission:", data);
      if (!data.delivery_id) {
        toast({
          title: "Error",
          description: "Delivery ID is required",
          variant: "destructive"
        });
        return;
      }
      if (!data.performance_rating) {
        toast({
          title: "Error",
          description: "Performance rating is required",
          variant: "destructive"
        });
        return;
      }
      if (!data.delivery_time) {
        toast({
          title: "Error",
          description: "Delivery time is required",
          variant: "destructive"
        });
        return;
      }
      if (actionRequired && !data.action_details) {
        toast({
          title: "Error",
          description: "Action details are required when action is required",
          variant: "destructive"
        });
        return;
      }
      const result = await addPerformanceRecord(data);
      if (result.success) {
        toast({
          title: "Success",
          description: "Performance record saved successfully"
        });
        reset();
        setDebugData(null);
      }
    } catch (error) {
      console.error('Error saving performance record:', error);
      toast({
        title: "Error",
        description: "Failed to save performance record: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  // Debug handler to log form values
  const handleDebugClick = () => {
    const formValues = {
      delivery_id: document.querySelector('[name="delivery_id"]').value,
      performance_rating: document.querySelector('[name="performance_rating"]')?.value,
      delivery_time: document.querySelector('[name="delivery_time"]').value,
      delay_reason: document.querySelector('[name="delay_reason"]')?.value,
      action_required: document.querySelector('[name="action_required"]')?.checked,
      action_details: document.querySelector('[name="action_details"]')?.value,
      comments: document.querySelector('[name="comments"]').value
    };
    console.log("Debug - Current form values:", formValues);
    setDebugData(formValues);
  };
  return <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="delivery_id">Delivery ID</Label>
          <Input id="delivery_id" {...register("delivery_id", {
          required: "Delivery ID is required"
        })} />
          {errors.delivery_id && <p className="text-sm text-red-500">{errors.delivery_id.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="performance_rating">Performance Rating</Label>
          <Select onValueChange={value => setValue("performance_rating", value)} defaultValue="">
            <SelectTrigger id="performance_rating">
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              {RATINGS.map(rating => <SelectItem key={rating} value={rating.toString()}>
                  {rating} Star{rating !== 1 ? 's' : ''}
                </SelectItem>)}
            </SelectContent>
          </Select>
          {errors.performance_rating && <p className="text-sm text-red-500">{errors.performance_rating.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery_time">Delivery Time (minutes)</Label>
          <Input id="delivery_time" type="number" {...register("delivery_time", {
          required: "Delivery time is required",
          min: {
            value: 0,
            message: "Delivery time cannot be negative"
          }
        })} />
          {errors.delivery_time && <p className="text-sm text-red-500">{errors.delivery_time.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="delay_reason">Delay Reason (if applicable)</Label>
          <Select onValueChange={value => setValue("delay_reason", value)}>
            <SelectTrigger id="delay_reason">
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              {DELAY_REASONS.map(reason => <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox id="action_required" {...register("action_required")} onCheckedChange={checked => setValue("action_required", checked)} />
          <Label htmlFor="action_required">Action Required</Label>
        </div>
        {actionRequired && <div className="ml-6 mt-2">
            <Input placeholder="Specify required action" {...register("action_details", {
          required: actionRequired ? "Please specify the required action" : false
        })} />
            {errors.action_details && <p className="text-sm text-red-500">{errors.action_details.message}</p>}
          </div>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comments/Performance Feedback</Label>
        <Textarea id="comments" {...register("comments")} placeholder="Enter any additional comments or feedback" />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Submit Performance Record'}
        </Button>

        
      </div>
      
      {debugData && <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="text-sm font-medium">Debug Output:</p>
          <pre className="text-xs mt-1 overflow-auto">
            {JSON.stringify(debugData, null, 2)}
          </pre>
        </div>}
    </form>;
};
export default PerformanceAnalyticsForm;