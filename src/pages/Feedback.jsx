import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const Feedback = () => {
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();

  const feedbackMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase
        .from('feedback')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    feedbackMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name', { required: true })} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email', { required: true })} />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...register('company', { required: true })} />
            </div>
            <div>
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea id="feedback" {...register('feedback', { required: true })} />
            </div>
            <Button type="submit" disabled={feedbackMutation.isLoading}>
              {feedbackMutation.isLoading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Feedback;