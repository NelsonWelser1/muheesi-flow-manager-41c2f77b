
import React from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const JOB_POSITIONS = [
  "Production Manager",
  "Quality Control Specialist",
  "Shift Supervisor",
  "Machine Operator",
  "Maintenance Technician",
  "Warehouse Staff"
];

const RecruitmentManagementForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();

  const onSubmit = (data) => {
    console.log(data);
    toast({
      title: "Success",
      description: "Recruitment record has been saved",
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Candidate Name</Label>
          <Input {...register("candidateName", { required: true })} placeholder="Enter candidate name" />
        </div>

        <div className="space-y-2">
          <Label>Job Title Applied For</Label>
          <Select onValueChange={(value) => register("jobTitle").onChange({ target: { value } })}>
            <SelectTrigger>
              <SelectValue placeholder="Select job position" />
            </SelectTrigger>
            <SelectContent>
              {JOB_POSITIONS.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Interview Date & Time</Label>
          <Input type="datetime-local" {...register("interviewDateTime", { required: true })} />
        </div>

        <div className="space-y-2">
          <Label>Hiring Manager ID</Label>
          <Input {...register("hiringManagerId", { required: true })} placeholder="Enter hiring manager ID" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Feedback/Comments</Label>
        <Textarea 
          {...register("feedback")} 
          placeholder="Enter interview feedback and comments"
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" className="w-full">Save Recruitment Record</Button>
    </form>
  );
};

export default RecruitmentManagementForm;
