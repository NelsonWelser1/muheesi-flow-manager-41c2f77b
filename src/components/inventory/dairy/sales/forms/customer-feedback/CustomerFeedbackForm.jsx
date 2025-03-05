
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileText, Bug } from "lucide-react";
import { useCustomerFeedback } from '../hooks/useCustomerFeedback';
import FormHeader from './components/FormHeader';
import CustomerInfoFields from './components/CustomerInfoFields';
import FeedbackContentFields from './components/FeedbackContentFields';
import FollowUpFields from './components/FollowUpFields';
import FormActions from './components/FormActions';

const CustomerFeedbackForm = ({ onBack, onViewReports }) => {
  const { isSubmitting, submitFeedback, debugFeedback } = useCustomerFeedback();

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
    // Submit the feedback data to Supabase
    const result = await submitFeedback(data);
    
    if (result.success) {
      // Reset form on successful submission
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
    }
  };

  // Debug function to print form data to console
  const handleDebug = () => {
    const formData = form.getValues();
    debugFeedback(formData);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer Feedback Form</CardTitle>
          <FormHeader onViewReports={onViewReports} onDebug={handleDebug} />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CustomerInfoFields form={form} />
              <FeedbackContentFields form={form} />
              <FollowUpFields form={form} />
              <FormActions isSubmitting={isSubmitting} />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerFeedbackForm;
