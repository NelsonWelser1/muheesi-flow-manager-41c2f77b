
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEmployeeForm } from "../hooks/useEmployeeForm";
import EmployeeBasicInfoFields from "./employee-records/EmployeeBasicInfoFields";
import SchedulePerformanceFields from "./employee-records/SchedulePerformanceFields";
import RecentRecords from "./employee-records/RecentRecords";

const EmployeeRecordsForm = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const { toast } = useToast();
  const { isSubmitting, records, submitEmployeeRecord } = useEmployeeForm(toast);

  // Register default values for select fields
  useEffect(() => {
    // Set default status value
    setValue("status", "Active");
  }, [setValue]);

  const onSubmit = async (data) => {
    const result = await submitEmployeeRecord(data);
    if (result.success) {
      reset();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Add New Employee Record</h3>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <EmployeeBasicInfoFields 
          register={register} 
          errors={errors} 
          setValue={setValue} 
        />

        <SchedulePerformanceFields 
          register={register} 
          errors={errors} 
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Employee Record'}
        </Button>
      </form>

      <RecentRecords records={records} />
    </div>
  );
};

export default EmployeeRecordsForm;
