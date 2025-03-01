
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

const CRMReportsForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metrics, setMetrics] = useState([
    { name: '', value: '', trend: 'stable', notes: '' }
  ]);
  
  const form = useForm({
    defaultValues: {
      report_title: '',
      report_type: 'customer_acquisition',
      time_period: 'monthly',
      period_start: new Date(new Date().setDate(1)), // First day of current month
      period_end: new Date(),
      summary: '',
      recommendations: '',
      author: '',
      status: 'draft'
    }
  });

  const addMetric = () => {
    setMetrics([...metrics, { name: '', value: '', trend: 'stable', notes: '' }]);
  };

  const removeMetric = (index) => {
    const updatedMetrics = [...metrics];
    updatedMetrics.splice(index, 1);
    setMetrics(updatedMetrics);
  };

  const handleMetricChange = (index, field, value) => {
    const updatedMetrics = [...metrics];
    updatedMetrics[index][field] = value;
    setMetrics(updatedMetrics);
  };

  const onSubmit = async (data) => {
    // Validate metrics
    if (metrics.length === 0 || !metrics.some(m => m.name.trim() !== '')) {
      toast({
        title: "Validation Error",
        description: "At least one metric must be added to the report",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a report ID
      const reportId = `CRM-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      // Format data for Supabase
      const formattedData = {
        report_id: reportId,
        report_title: data.report_title,
        report_type: data.report_type,
        time_period: data.time_period,
        period_start: data.period_start.toISOString(),
        period_end: data.period_end.toISOString(),
        metrics: JSON.stringify(metrics),
        summary: data.summary,
        recommendations: data.recommendations,
        author: data.author,
        status: data.status,
        created_at: new Date().toISOString(),
        created_by: userData?.user?.id || null
      };

      const { error } = await supabase
        .from('crm_reports')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "CRM report created successfully"
      });

      // Reset form
      form.reset();
      setMetrics([{ name: '', value: '', trend: 'stable', notes: '' }]);
    } catch (error) {
      console.error('Error creating CRM report:', error);
      toast({
        title: "Error",
        description: "Failed to create CRM report: " + error.message,
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
          <CardTitle>Create CRM Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="report_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter report title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="report_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Type</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="customer_acquisition">Customer Acquisition</SelectItem>
                          <SelectItem value="customer_retention">Customer Retention</SelectItem>
                          <SelectItem value="sales_performance">Sales Performance</SelectItem>
                          <SelectItem value="customer_satisfaction">Customer Satisfaction</SelectItem>
                          <SelectItem value="market_analysis">Market Analysis</SelectItem>
                          <SelectItem value="product_performance">Product Performance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time_period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Period</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="period_start"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Period Start Date</FormLabel>
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
                  name="period_end"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Period End Date</FormLabel>
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
              </div>

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
                        <SelectItem value="draft">
                          <div className="flex items-center">
                            <span>Draft</span>
                            <Badge variant="info" className="ml-2">Draft</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="under_review">
                          <div className="flex items-center">
                            <span>Under Review</span>
                            <Badge variant="warning" className="ml-2">Under Review</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="published">
                          <div className="flex items-center">
                            <span>Published</span>
                            <Badge variant="success" className="ml-2">Published</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="archived">
                          <div className="flex items-center">
                            <span>Archived</span>
                            <Badge className="ml-2">Archived</Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-lg font-medium mb-4">Key Metrics</h3>
                
                {metrics.map((metric, index) => (
                  <div key={index} className="p-4 border rounded-md mb-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Metric {index + 1}</h4>
                      {metrics.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeMetric(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <FormLabel>Metric Name</FormLabel>
                        <Input 
                          value={metric.name} 
                          onChange={(e) => handleMetricChange(index, 'name', e.target.value)}
                          placeholder="E.g., New Customers, Retention Rate"
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Value</FormLabel>
                        <Input 
                          value={metric.value} 
                          onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                          placeholder="E.g., 123, 45.6%, 7.8"
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Trend</FormLabel>
                        <Select 
                          value={metric.trend} 
                          onValueChange={(value) => handleMetricChange(index, 'trend', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select trend" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="increasing">
                              <div className="flex items-center">
                                <span>Increasing</span>
                                <Badge variant="success" className="ml-2">↑</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="decreasing">
                              <div className="flex items-center">
                                <span>Decreasing</span>
                                <Badge variant="destructive" className="ml-2">↓</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="stable">
                              <div className="flex items-center">
                                <span>Stable</span>
                                <Badge variant="secondary" className="ml-2">→</Badge>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <FormLabel>Notes</FormLabel>
                        <Input 
                          value={metric.notes} 
                          onChange={(e) => handleMetricChange(index, 'notes', e.target.value)}
                          placeholder="Brief explanation of the metric"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addMetric}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" /> Add Metric
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter report summary"
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
                  name="recommendations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recommendations</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter recommendations based on findings"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Report"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMReportsForm;
