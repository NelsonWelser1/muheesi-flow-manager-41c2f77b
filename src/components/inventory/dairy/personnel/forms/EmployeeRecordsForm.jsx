
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";
import { format } from 'date-fns';

const JOB_TITLES = [
  "Production Manager",
  "Quality Control Specialist",
  "Shift Supervisor",
  "Machine Operator",
  "Maintenance Technician",
  "Warehouse Staff"
];

const DEPARTMENTS = [
  "Production",
  "Quality Control",
  "Maintenance",
  "Warehouse",
  "Administration",
  "Logistics"
];

const STATUS_OPTIONS = [
  "Active",
  "On Leave",
  "Terminated",
  "Suspended",
  "Training",
  "Probation"
];

const EmployeeRecordsForm = () => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [records, setRecords] = useState([]);

  // Fetch records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('personnel_employee_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching employee records:', error);
      showErrorToast(toast, "Failed to load recent employee records");
    }
  };

  const onSubmit = async (data) => {
    // Debug data - temporary
    console.log('Form data submitted:', data);
    
    setIsSubmitting(true);
    try {
      // Temporarily bypass user authentication check
      // const { data: { user } } = await supabase.auth.getUser();
      // if (!user) {
      //   showErrorToast(toast, "You must be logged in to submit records");
      //   return;
      // }

      const formattedData = {
        employee_id: data.employeeId,
        job_title: data.jobTitle,
        department: data.department,
        shift_start: data.shiftStart,
        shift_end: data.shiftEnd,
        performance_rating: parseInt(data.performanceRating) || null,
        review_date_time: data.reviewDateTime,
        status: data.status || 'Active',
        comments: data.comments
        // operator_id: user?.id // Temporarily commented out
      };

      // Log the actual data being sent to Supabase
      console.log('Submitting data to Supabase:', formattedData);

      const { data: result, error } = await supabase
        .from('personnel_employee_records')
        .insert([formattedData])
        .select();

      if (error) throw error;

      console.log('Submission result:', result);
      showSuccessToast(toast, "Employee record has been saved successfully");
      reset();
      fetchRecords(); // Refresh the list
    } catch (error) {
      console.error('Error saving employee record:', error);
      showErrorToast(toast, "Failed to save employee record: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get form values for validation
  const selectedJobTitle = watch('jobTitle');
  const selectedDepartment = watch('department');
  const selectedStatus = watch('status');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Add New Employee Record</h3>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Employee Name/ID</Label>
            <Input 
              {...register("employeeId", { required: true })} 
              placeholder="Enter employee name or ID" 
            />
            {errors.employeeId && <p className="text-sm text-red-500">Employee ID is required</p>}
          </div>

          <div className="space-y-2">
            <Label>Job Title</Label>
            <Select onValueChange={(value) => setValue("jobTitle", value)}>
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
            {errors.jobTitle && <p className="text-sm text-red-500">Job title is required</p>}
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
            <Select onValueChange={(value) => setValue("department", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-sm text-red-500">Department is required</p>}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select onValueChange={(value) => setValue("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">Status is required</p>}
          </div>

          <div className="space-y-2">
            <Label>Shift Schedule Start</Label>
            <Input 
              type="datetime-local" 
              {...register("shiftStart", { required: true })} 
            />
            {errors.shiftStart && <p className="text-sm text-red-500">Shift start time is required</p>}
          </div>

          <div className="space-y-2">
            <Label>Shift Schedule End</Label>
            <Input 
              type="datetime-local" 
              {...register("shiftEnd", { required: true })} 
            />
            {errors.shiftEnd && <p className="text-sm text-red-500">Shift end time is required</p>}
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
            {errors.performanceRating && <p className="text-sm text-red-500">Performance rating (1-5) is required</p>}
          </div>

          <div className="space-y-2">
            <Label>Review Date & Time</Label>
            <Input 
              type="datetime-local" 
              {...register("reviewDateTime", { required: true })} 
            />
            {errors.reviewDateTime && <p className="text-sm text-red-500">Review date & time is required</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Performance Review Comments</Label>
          <Textarea 
            {...register("comments")} 
            placeholder="Enter performance review comments" 
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Employee Record'}
        </Button>
      </form>

      {records.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Recently Added Records</h4>
          <div className="text-xs text-muted-foreground">
            {records.map((record, index) => (
              <div key={record.id} className="border-b py-2">
                <p><strong>{record.employee_id}</strong> - {record.job_title}</p>
                <p className="text-xs">
                  Added: {format(new Date(record.created_at), 'PPp')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeRecordsForm;
