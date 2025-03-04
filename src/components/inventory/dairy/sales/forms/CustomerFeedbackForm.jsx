
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { ArrowLeft, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

const CustomerFeedbackForm = ({ onBack, onViewReports }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      product_service: '',
      satisfaction_rating: '4',
      feedback_text: '',
      improvement_suggestions: '',
      follow_up_required: false,
      follow_up_status: 'pending'
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const formattedData = {
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        product_service: data.product_service,
        satisfaction_rating: parseFloat(data.satisfaction_rating),
        feedback_text: data.feedback_text,
        improvement_suggestions: data.improvement_suggestions,
        follow_up_required: data.follow_up_required,
        follow_up_status: data.follow_up_required ? data.follow_up_status : null,
        feedback_date: new Date().toISOString(),
        created_by: userData?.user?.id || null
      };

      const { error } = await supabase
        .from('customer_feedback')
        .insert([formattedData]);

      if (error) throw error;

      showSuccessToast(toast, "Customer feedback recorded successfully");

      // Reset form
      form.reset({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        product_service: '',
        satisfaction_rating: '4',
        feedback_text: '',
        improvement_suggestions: '',
        follow_up_required: false,
        follow_up_status: 'pending'
      });
    } catch (error) {
      console.error('Error recording customer feedback:', error);
      showErrorToast(toast, "Failed to record customer feedback: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer Feedback Form</CardTitle>
          <Button 
            variant="outline" 
            onClick={onViewReports}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" /> View Reports
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="product_service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product/Service</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product or service name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="satisfaction_rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Satisfaction Rating (1-5)</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Very Dissatisfied</SelectItem>
                          <SelectItem value="2">2 - Dissatisfied</SelectItem>
                          <SelectItem value="3">3 - Neutral</SelectItem>
                          <SelectItem value="4">4 - Satisfied</SelectItem>
                          <SelectItem value="5">5 - Very Satisfied</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerFeedbackForm;
