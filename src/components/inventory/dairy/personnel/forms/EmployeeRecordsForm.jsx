import React from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const JOB_TITLES = [
  "Production Manager",
  "Quality Control Specialist",
  "Shift Supervisor",
  "Machine Operator",
  "Maintenance Technician",
  "Warehouse Staff"
];

const EmployeeRecordsForm = () => {
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

      const { error } = await supabase
        .from('personnel_employee_records')
        .insert([{
          ...data,
          operator_id: user.id,
        }]);

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
  );
};

export default EmployeeRecordsForm;
