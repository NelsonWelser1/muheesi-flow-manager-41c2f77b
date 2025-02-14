
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

  const onSubmit = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit recruitment records",
          variant: "destructive",
        });
        return;
      }

      const formattedData = {
        candidate_name: data.candidateName,
        job_title: data.jobTitle,
        interview_date_time: data.interviewDateTime,
        feedback: data.feedback,
        hiring_manager_id: data.hiringManagerId,
        status: 'Pending',
        operator_id: user.id
      };

      const { error } = await supabase
        .from('personnel_recruitment_records')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recruitment record has been saved",
      });
      reset();
    } catch (error) {
      console.error('Error saving recruitment record:', error);
      toast({
        title: "Error",
        description: "Failed to save recruitment record",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
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
      <PersonnelDataDisplay 
        tableName="personnel_recruitment_records" 
        title="Recruitment"
      />
    </div>
  );
};

export default RecruitmentManagementForm;
