
import React from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useTrainingEvaluations } from "../hooks/useTrainingEvaluations";
import RecentTrainingRecords from "./training-evaluations/RecentTrainingRecords";

const TRAINING_MODULES = [
  "Safety Protocols",
  "Quality Management",
  "Machine Operation",
  "Hygiene Standards",
  "Product Knowledge",
  "Customer Service"
];

const TrainingEvaluationForm = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const { toast } = useToast();
  const { isSubmitting, isLoading, records, submitTrainingEvaluation } = useTrainingEvaluations(toast);

  const onSubmit = async (data) => {
    console.log("Form data before submission:", data);
    const result = await submitTrainingEvaluation(data);
    if (result.success) {
      reset();
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input 
              id="employeeId"
              {...register("employeeId", { required: "Employee ID is required" })} 
              placeholder="Enter employee ID" 
              className={errors.employeeId ? "border-red-500" : ""}
            />
            {errors.employeeId && (
              <p className="text-red-500 text-sm">{errors.employeeId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trainingModule">Training Module</Label>
            <Select 
              onValueChange={(value) => setValue("trainingModule", value)} 
              name="trainingModule"
            >
              <SelectTrigger id="trainingModule" className={errors.trainingModule ? "border-red-500" : ""}>
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
            {errors.trainingModule && (
              <p className="text-red-500 text-sm">{errors.trainingModule.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trainingDate">Training Date</Label>
            <Input 
              id="trainingDate"
              type="date" 
              {...register("trainingDate", { required: "Training date is required" })} 
              className={errors.trainingDate ? "border-red-500" : ""}
            />
            {errors.trainingDate && (
              <p className="text-red-500 text-sm">{errors.trainingDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="performanceRating">Performance Rating (1-5)</Label>
            <Input 
              id="performanceRating"
              type="number" 
              min="1" 
              max="5" 
              {...register("performanceRating", { 
                required: "Rating is required",
                min: { value: 1, message: "Rating must be at least 1" },
                max: { value: 5, message: "Rating must be at most 5" }
              })} 
              className={errors.performanceRating ? "border-red-500" : ""}
            />
            {errors.performanceRating && (
              <p className="text-red-500 text-sm">{errors.performanceRating.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback">Comments/Feedback</Label>
          <Textarea 
            id="feedback"
            {...register("feedback")} 
            placeholder="Enter training feedback and comments"
            className="min-h-[100px]"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Training Evaluation'}
        </Button>
      </form>

      {/* Display recent records with loading state */}
      <RecentTrainingRecords records={records} isLoading={isLoading} />
    </div>
  );
};

export default TrainingEvaluationForm;
