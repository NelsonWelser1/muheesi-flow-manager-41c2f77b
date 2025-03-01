
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { CalendarIcon, ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdvertisingPromotionForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [channels, setChannels] = useState([
    { name: '', type: 'digital', cost: '', start_date: new Date(), end_date: new Date(new Date().setDate(new Date().getDate() + 30)), status: 'planned' }
  ]);
  
  const form = useForm({
    defaultValues: {
      campaign_name: '',
      description: '',
      target_audience: '',
      objectives: '',
      budget: '',
      start_date: new Date(),
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      kpi_metrics: '',
      status: 'planning'
    }
  });

  const addChannel = () => {
    setChannels([...channels, { 
      name: '', 
      type: 'digital', 
      cost: '', 
      start_date: new Date(), 
      end_date: new Date(new Date().setDate(new Date().getDate() + 30)), 
      status: 'planned' 
    }]);
  };

  const removeChannel = (index) => {
    const updatedChannels = [...channels];
    updatedChannels.splice(index, 1);
    setChannels(updatedChannels);
  };

  const handleChannelChange = (index, field, value) => {
    const updatedChannels = [...channels];
    updatedChannels[index][field] = value;
    setChannels(updatedChannels);
  };

  const onSubmit = async (data) => {
    // Validate channels
    if (channels.length === 0 || !channels.some(c => c.name.trim() !== '')) {
      toast({
        title: "Validation Error",
        description: "At least one advertising channel must be added",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a campaign ID
      const campaignId = `ADV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      // Format channels with ISO dates
      const formattedChannels = channels.map(channel => ({
        ...channel,
        start_date: new Date(channel.start_date).toISOString(),
        end_date: new Date(channel.end_date).toISOString()
      }));
      
      // Format data for Supabase
      const formattedData = {
        campaign_id: campaignId,
        campaign_name: data.campaign_name,
        description: data.description,
        target_audience: data.target_audience,
        objectives: data.objectives,
        budget: data.budget,
        channels: JSON.stringify(formattedChannels),
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        kpi_metrics: data.kpi_metrics,
        status: data.status,
        created_at: new Date().toISOString(),
        created_by: userData?.user?.id || null
      };

      const { error } = await supabase
        .from('advertising_campaigns')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Advertising campaign created successfully"
      });

      // Reset form
      form.reset();
      setChannels([{ 
        name: '', 
        type: 'digital', 
        cost: '', 
        start_date: new Date(), 
        end_date: new Date(new Date().setDate(new Date().getDate() + 30)), 
        status: 'planned' 
      }]);
    } catch (error) {
      console.error('Error creating advertising campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create advertising campaign: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create Advertising Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="campaign_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter campaign name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter campaign budget" 
                          type="number" 
                          step="0.01" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target_audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="Describe target audience" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
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
                          <SelectItem value="planning">
                            <div className="flex items-center">
                              <span>Planning</span>
                              <Badge variant="info" className="ml-2">Planning</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="active">
                            <div className="flex items-center">
                              <span>Active</span>
                              <Badge variant="success" className="ml-2">Active</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="paused">
                            <div className="flex items-center">
                              <span>Paused</span>
                              <Badge variant="warning" className="ml-2">Paused</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="completed">
                            <div className="flex items-center">
                              <span>Completed</span>
                              <Badge className="ml-2">Completed</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="canceled">
                            <div className="flex items-center">
                              <span>Canceled</span>
                              <Badge variant="destructive" className="ml-2">Canceled</Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter campaign description"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="objectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objectives</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter campaign objectives"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="kpi_metrics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KPI Metrics</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter KPIs and metrics to measure success"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-lg font-medium mb-4">Advertising Channels</h3>
                
                {channels.map((channel, index) => (
                  <div key={index} className="p-4 border rounded-md mb-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Channel {index + 1}</h4>
                      {channels.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeChannel(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <FormLabel>Channel Name</FormLabel>
                        <Input 
                          value={channel.name} 
                          onChange={(e) => handleChannelChange(index, 'name', e.target.value)}
                          placeholder="E.g., Facebook Ads, Radio, Billboards"
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Channel Type</FormLabel>
                        <Select 
                          value={channel.type} 
                          onValueChange={(value) => handleChannelChange(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select channel type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="digital">Digital</SelectItem>
                            <SelectItem value="print">Print</SelectItem>
                            <SelectItem value="radio">Radio</SelectItem>
                            <SelectItem value="tv">TV</SelectItem>
                            <SelectItem value="outdoor">Outdoor</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <FormLabel>Cost</FormLabel>
                        <Input 
                          value={channel.cost} 
                          onChange={(e) => handleChannelChange(index, 'cost', e.target.value)}
                          placeholder="Enter cost"
                          type="number"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          value={channel.status} 
                          onValueChange={(value) => handleChannelChange(index, 'status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="canceled">Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !channel.start_date && "text-muted-foreground"
                              )}
                            >
                              {channel.start_date ? (
                                format(new Date(channel.start_date), "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={new Date(channel.start_date)}
                              onSelect={(date) => handleChannelChange(index, 'start_date', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !channel.end_date && "text-muted-foreground"
                              )}
                            >
                              {channel.end_date ? (
                                format(new Date(channel.end_date), "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={new Date(channel.end_date)}
                              onSelect={(date) => handleChannelChange(index, 'end_date', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addChannel}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" /> Add Channel
                </Button>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Campaign"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertisingPromotionForm;
