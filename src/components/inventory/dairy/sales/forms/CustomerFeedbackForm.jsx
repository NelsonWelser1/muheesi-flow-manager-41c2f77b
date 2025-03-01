
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
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

const CustomerFeedbackForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      product_name: '',
      rating: '5',
      feedback_type: 'general',
      feedback_text: '',
      action_required: 'no',
      action_assigned_to: '',
      status: 'new'
    }
  });

  const watchFeedbackType = form.watch('feedback_type');
  const watchActionRequired = form.watch('action_required');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Generate a feedback ID
      const feedbackId = `FB-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      // Format data for Supabase
      const formattedData = {
        feedback_id: feedbackId,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        product_name: data.product_name,
        rating: parseInt(data.rating),
        feedback_type: data.feedback_type,
        feedback_text: data.feedback_text,
        action_required: data.action_required === 'yes',
        action_assigned_to: data.action_assigned_to || null,
        status: data.status,
        created_at: new Date().toISOString(),
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
        product_name: '',
        rating: '5',
        feedback_type: 'general',
        feedback_text: '',
        action_required: 'no',
        action_assigned_to: '',
        status: 'new'
      });
    } catch (error) {
      console.error('Error recording feedback:', error);
      showErrorToast(toast, "Failed to record feedback: " + error.message);
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
          <CardTitle>Customer Feedback Form</CardTitle>
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
                  name="customer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="product_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (1-5)</FormLabel>
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
                          <SelectItem value="1">★ (Poor)</SelectItem>
                          <SelectItem value="2">★★ (Fair)</SelectItem>
                          <SelectItem value="3">★★★ (Good)</SelectItem>
                          <SelectItem value="4">★★★★ (Very Good)</SelectItem>
                          <SelectItem value="5">★★★★★ (Excellent)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feedback_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feedback Type</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select feedback type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="product_quality">Product Quality</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                          <SelectItem value="customer_service">Customer Service</SelectItem>
                          <SelectItem value="complaint">Complaint</SelectItem>
                          <SelectItem value="suggestion">Suggestion</SelectItem>
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
                    <FormLabel>Feedback Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed feedback"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="action_required"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Action Required?</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchActionRequired === 'yes' && (
                  <FormField
                    control={form.control}
                    name="action_assigned_to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign Action To</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name or department" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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
                          <SelectItem value="new">
                            <div className="flex items-center">
                              <span>New</span>
                              <Badge variant="info" className="ml-2">New</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="in_progress">
                            <div className="flex items-center">
                              <span>In Progress</span>
                              <Badge variant="pending" className="ml-2">In Progress</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="resolved">
                            <div className="flex items-center">
                              <span>Resolved</span>
                              <Badge variant="success" className="ml-2">Resolved</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="closed">
                            <div className="flex items-center">
                              <span>Closed</span>
                              <Badge className="ml-2">Closed</Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
