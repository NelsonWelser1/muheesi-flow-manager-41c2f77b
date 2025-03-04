
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import EmployeeFormFields from './components/EmployeeFormFields';
import { useEmployeeForm } from './hooks/useEmployeeForm';

const AddEmployeeForm = () => {
  const form = useForm({
    defaultValues: {
      employee_id: '',
      job_title: '',
      department: '',
      email: '',
      phone: '',
      base_salary: '',
      status: 'Active'
    }
  });

  const { onSubmit } = useEmployeeForm(form);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserPlus className="mr-2 h-5 w-5" />
          Add New Employee
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EmployeeFormFields form={form} />

            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddEmployeeForm;
