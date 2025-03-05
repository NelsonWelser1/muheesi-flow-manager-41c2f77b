import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";
import { Checkbox } from "@/components/ui/checkbox";
import { useCRMReports } from './hooks/useCRMReports';

const CRMReportsForm = ({ onBack, onViewReports }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitCRMReport, debugFormData } = useCRMReports();

  const form = useForm({
    defaultValues: {
      report_title: '',
      report_type: 'customer_segmentation',
      department: 'Sales & Marketing',
      date_range_start: '',
      date_range_end: '',
      summary: '',
      key_findings: '',
      recommendations: '',
      distribution: 'internal'
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Debug: Print form data to console
    debugFormData(data);
    
    try {
      const success = await submitCRMReport(data);
      
      if (success) {
        // Reset form
        form.reset({
          report_title: '',
          report_type: 'customer_segmentation',
          department: 'Sales & Marketing',
          date_range_start: '',
          date_range_end: '',
          summary: '',
          key_findings: '',
          recommendations: '',
          distribution: 'internal'
        });
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      showErrorToast(toast, "Form submission error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug function to be attached to any element for testing
  const handleDebugClick = () => {
    const currentFormData = form.getValues();
    console.log('Debug - Current form values:', currentFormData);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>CRM Reports Form</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleDebugClick}
              className="flex items-center gap-2"
            >
              Debug Form
            </Button>
            <Button 
              variant="outline" 
              onClick={onViewReports}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" /> View Reports
            </Button>
          </div>
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
                          <SelectItem value="customer_segmentation">Customer Segmentation</SelectItem>
                          <SelectItem value="sales_performance">Sales Performance</SelectItem>
                          <SelectItem value="lead_generation">Lead Generation</SelectItem>
                          <SelectItem value="customer_retention">Customer Retention</SelectItem>
                          <SelectItem value="customer_satisfaction">Customer Satisfaction</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                          <SelectItem value="Customer Service">Customer Service</SelectItem>
                          <SelectItem value="Product Development">Product Development</SelectItem>
                          <SelectItem value="Executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="distribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distribution</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select distribution" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="internal">Internal Only</SelectItem>
                          <SelectItem value="executive">Executive Team</SelectItem>
                          <SelectItem value="department">Department Only</SelectItem>
                          <SelectItem value="company_wide">Company Wide</SelectItem>
                          <SelectItem value="external">External</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_range_start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Range Start</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_range_end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Range End</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a brief summary of the report"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="key_findings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Findings</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter key findings or insights (one per line)"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Enter each finding on a new line for better formatting
                    </p>
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
                        placeholder="Enter recommendations based on the findings"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Create CRM Report"}
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
