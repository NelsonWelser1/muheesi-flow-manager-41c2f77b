
import React from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { Eye } from "lucide-react";

const JOB_TITLES = [
  "Production Manager",
  "Quality Control Specialist",
  "Shift Supervisor",
  "Machine Operator",
  "Maintenance Technician",
  "Warehouse Staff"
];

const EmployeeRecordsForm = ({ onViewRecords }) => {
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit records",
          variant: "destructive",
        });
        return;
      }

      const formattedData = {
        employee_id: data.employeeId,
        job_title: data.jobTitle,
        shift_start: data.shiftStart,
        shift_end: data.shiftEnd,
        performance_rating: parseInt(data.performanceRating),
        review_date_time: data.reviewDateTime,
        comments: data.comments,
        operator_id: user.id
      };

      const { error } = await supabase
        .from('personnel_employee_records')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Employee record has been saved",
      });
      reset();
    } catch (error) {
      console.error('Error saving employee record:', error);
      toast({
        title: "Error",
        description: "Failed to save employee record",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Add New Employee Record</h3>
        {onViewRecords && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewRecords}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Records
          </Button>
        )}
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Employee Name/ID</Label>
            <Input {...register("employeeId", { required: true })} placeholder="Enter employee name or ID" />
          </div>

          <div className="space-y-2">
            <Label>Job Title</Label>
            <Select onValueChange={(value) => register("jobTitle").onChange({ target: { value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select job title" />
              </SelectTrigger>
              <SelectContent>
                {JOB_TITLES.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Shift Schedule Start</Label>
            <Input type="datetime-local" {...register("shiftStart", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label>Shift Schedule End</Label>
            <Input type="datetime-local" {...register("shiftEnd", { required: true })} />
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

          <div className="space-y-2">
            <Label>Review Date & Time</Label>
            <Input type="datetime-local" {...register("reviewDateTime", { required: true })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Performance Review Comments</Label>
          <Textarea {...register("comments")} placeholder="Enter performance review comments" />
        </div>

        <Button type="submit" className="w-full">Save Employee Record</Button>
      </form>
    </div>
  );
};

export default EmployeeRecordsForm;
