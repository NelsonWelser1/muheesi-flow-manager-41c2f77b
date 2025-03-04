
import React from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import PersonnelDataDisplay from '../data-display/PersonnelDataDisplay';

const TRAINING_MODULES = [
  "Safety Protocols",
  "Quality Management",
  "Machine Operation",
  "Hygiene Standards",
  "Product Knowledge",
  "Customer Service"
];

const TrainingEvaluationForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit evaluations",
          variant: "destructive",
        });
        return;
      }

      const formattedData = {
        employee_id: data.employeeId,
        training_module: data.trainingModule,
        training_date: data.trainingDate,
        performance_rating: parseInt(data.performanceRating),
        feedback: data.feedback,
        operator_id: user.id
      };

      const { error } = await supabase
        .from('personnel_training_evaluations')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Training evaluation has been saved",
      });
      reset();
    } catch (error) {
      console.error('Error saving training evaluation:', error);
      toast({
        title: "Error",
        description: "Failed to save training evaluation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Employee ID</Label>
            <Input {...register("employeeId", { required: true })} placeholder="Enter employee ID" />
          </div>

          <div className="space-y-2">
            <Label>Training Module</Label>
            <Select onValueChange={(value) => register("trainingModule").onChange({ target: { value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select training module" />
              </SelectTrigger>
              <SelectContent>
                {TRAINING_MODULES.map((module) => (
                  <SelectItem key={module} value={module}>
                    {module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Training Date</Label>
            <Input type="date" {...register("trainingDate", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label>Performance Rating (1-5)</Label>
            <Input 
              type="number" 
              min="1" 
              max="5" 
              {...register("performanceRating", { 
                required: true,
                min: 1,
                max: 5
              })} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Comments/Feedback</Label>
          <Textarea 
            {...register("feedback")} 
            placeholder="Enter training feedback and comments"
            className="min-h-[100px]"
          />
        </div>

        <Button type="submit" className="w-full">Submit Training Evaluation</Button>
      </form>
      <PersonnelDataDisplay 
        tableName="personnel_training_evaluations" 
        title="Training"
      />
    </div>
  );
};

export default TrainingEvaluationForm;
