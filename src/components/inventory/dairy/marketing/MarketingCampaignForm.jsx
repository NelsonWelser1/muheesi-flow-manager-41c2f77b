
import React from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import QRCodeGenerator from '../qr/QRCodeGenerator';

const PLATFORMS = ["Social Media", "Print", "TV", "Radio", "Email", "Direct Marketing"];

const MarketingCampaignForm = ({ onBack }) => {
  const { register, handleSubmit, reset, watch } = useForm();
  const { toast } = useToast();
  const [showQR, setShowQR] = React.useState(false);
  const formData = watch();

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

  if (showQR) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setShowQR(false)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Form
        </Button>
        <QRCodeGenerator 
          data={formData} 
          title="Marketing Campaign"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Sales & Marketing
      </Button>
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

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">Submit Campaign</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowQR(true)}
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                Generate QR
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingCampaignForm;
