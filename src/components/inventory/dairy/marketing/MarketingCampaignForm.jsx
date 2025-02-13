
import React from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";

const PLATFORMS = ["Social Media", "Print", "TV", "Radio", "Email", "Direct Marketing"];

const MarketingCampaignForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();

  const handleFormSubmit = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit campaign records",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('marketing_campaigns')
        .insert([{
          ...data,
          created_by: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign record saved successfully",
      });
      reset();
    } catch (error) {
      console.error('Error saving campaign record:', error);
      toast({
        title: "Error",
        description: "Failed to save campaign record",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing Campaign Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input {...register("campaign_name", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <Select onValueChange={(value) => register("platform").onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((platform) => (
                    <SelectItem key={platform} value={platform.toLowerCase()}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" {...register("start_date", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" {...register("end_date", { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>Budget</Label>
              <Input type="number" step="0.01" {...register("budget", { required: true, min: 0 })} />
            </div>

            <div className="space-y-2">
              <Label>Engagement Metrics</Label>
              <Input {...register("engagement_metrics")} placeholder="Enter metrics or KPIs" />
            </div>
          </div>

          <Button type="submit" className="w-full">Submit Campaign</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MarketingCampaignForm;
