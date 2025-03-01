
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
import { CalendarIcon, ArrowLeft, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const StarRating = ({ rating, setRating }) => {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={`p-1 focus:outline-none ${
            star <= rating ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => setRating(star)}
        >
          <Star className="h-5 w-5 fill-current" />
        </button>
      ))}
    </div>
  );
};

const CustomerFeedbackForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  
  const form = useForm({
    defaultValues: {
      customer_name: '',
      customer_id: '',
      feedback_date: new Date(),
      product_name: '',
      feedback_text: '',
      suggestions: '',
      action_required: false,
      action_taken: '',
    }
  });

  const onSubmit = async (data) => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a feedback ID
      const feedbackId = `FDB-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      // Format dates for Supabase
      const formattedData = {
        feedback_id: feedbackId,
        customer_name: data.customer_name,
        customer_id: data.customer_id || null,
        feedback_date: data.feedback_date.toISOString(),
        product_name: data.product_name,
        rating: rating,
        feedback_text: data.feedback_text,
        suggestions: data.suggestions,
        action_required: data.action_required,
        action_taken: data.action_taken,
        created_by: userData?.user?.id || null
      };

      const { error } = await supabase
        .from('customer_feedback')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer feedback recorded successfully"
      });

      // Reset form
      form.reset();
      setRating(0);
    } catch (error) {
      console.error('Error recording customer feedback:', error);
      toast({
        title: "Error",
        description: "Failed to record customer feedback: " + error.message,
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
                  name="customer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer ID if available" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feedback_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Feedback Date</FormLabel>
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
                  name="product_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Fresh Milk">Fresh Milk</SelectItem>
                          <SelectItem value="Yogurt">Yogurt</SelectItem>
                          <SelectItem value="Cheese">Cheese</SelectItem>
                          <SelectItem value="Butter">Butter</SelectItem>
                          <SelectItem value="Ice Cream">Ice Cream</SelectItem>
                          <SelectItem value="Meat Products">Meat Products</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <FormLabel>Rating</FormLabel>
                <StarRating rating={rating} setRating={setRating} />
                {rating === 0 && (
                  <p className="text-sm text-destructive">Please provide a rating</p>
                )}
              </div>

              <FormField
                control={form.control}
                name="feedback_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter customer feedback"
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
                name="suggestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suggestions for Improvement</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter customer suggestions"
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
                name="action_required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Action Required
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Check if this feedback requires follow-up action
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="action_taken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action Taken/To Be Taken</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe action taken or planned"
                        className="min-h-[80px]"
                        disabled={!form.watch("action_required")}
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
