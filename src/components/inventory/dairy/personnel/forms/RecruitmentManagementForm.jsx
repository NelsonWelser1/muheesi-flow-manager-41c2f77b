
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useRecruitmentForm } from '../hooks/useRecruitmentForm';
import RecruitmentRecordsDisplay from '../records/RecruitmentRecordsDisplay';

const JOB_POSITIONS = [
  "Production Manager",
  "Quality Control Specialist",
  "Shift Supervisor",
  "Machine Operator",
  "Maintenance Technician",
  "Warehouse Staff"
];

const RecruitmentManagementForm = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [showRecords, setShowRecords] = useState(false);
  const {
    isSubmitting,
    records,
    submitRecruitmentRecord,
  } = useRecruitmentForm(toast);

  const onSubmit = async (data) => {
    console.log("Form data before submission:", data);
    
    try {
      const result = await submitRecruitmentRecord(data);
      
      if (result.success) {
        reset();
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const handleJobTitleChange = (value) => {
    setValue("jobTitle", value);
  };

  const handleDebugClick = () => {
    const formValues = {
      candidateName: document.querySelector('input[name="candidateName"]').value,
      jobTitle: document.querySelector('select[name="jobTitle"]')?.value || '',
      interviewDateTime: document.querySelector('input[name="interviewDateTime"]').value,
      hiringManagerId: document.querySelector('input[name="hiringManagerId"]').value,
      feedback: document.querySelector('textarea[name="feedback"]').value,
    };
    
    console.log("DEBUG - Current form values:", formValues);
  };

  if (showRecords) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setShowRecords(false)} className="mb-4">
          ← Back to Recruitment Form
        </Button>
        <RecruitmentRecordsDisplay />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recruitment Management Form</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleDebugClick}
            className="text-xs"
          >
            Debug Form
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowRecords(true)}
          >
            View Records
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="candidateName">Candidate Name</Label>
            <Input 
              id="candidateName"
              {...register("candidateName", { 
                required: "Candidate name is required" 
              })} 
              placeholder="Enter candidate name"
            />
            {errors.candidateName && (
              <p className="text-red-500 text-xs">{errors.candidateName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title Applied For</Label>
            <Select onValueChange={handleJobTitleChange}>
              <SelectTrigger id="jobTitle">
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
            {errors.jobTitle && (
              <p className="text-red-500 text-xs">{errors.jobTitle.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewDateTime">Interview Date & Time</Label>
            <Input 
              id="interviewDateTime"
              type="datetime-local" 
              {...register("interviewDateTime", { 
                required: "Interview date and time is required" 
              })} 
            />
            {errors.interviewDateTime && (
              <p className="text-red-500 text-xs">{errors.interviewDateTime.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hiringManagerId">Hiring Manager ID</Label>
            <Input 
              id="hiringManagerId"
              {...register("hiringManagerId", { 
                required: "Hiring manager ID is required" 
              })} 
              placeholder="Enter hiring manager ID" 
            />
            {errors.hiringManagerId && (
              <p className="text-red-500 text-xs">{errors.hiringManagerId.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback">Feedback/Comments</Label>
          <Textarea 
            id="feedback"
            {...register("feedback")} 
            placeholder="Enter interview feedback and comments"
            className="min-h-[100px]"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Recruitment Record"}
        </Button>
      </form>
    </div>
  );
};

export default RecruitmentManagementForm;
