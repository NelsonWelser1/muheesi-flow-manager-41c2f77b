
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useBillsExpenses } from "@/integrations/supabase/hooks/accounting/useBillsExpenses";
import BillsExpensesRecords from '../records/BillsExpensesRecords';
import { useBillsExpensesForm } from './hooks/useBillsExpensesForm';
import BillExpenseFormContent from './components/BillExpenseFormContent';

const BillsExpensesForm = ({ onBack }) => {
  const [viewMode, setViewMode] = useState("form"); // form or records
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    errors,
    fileInputRef,
    fileSelected,
    isUploading,
    uploadedFileUrl,
    isRecurring,
    isSubmissionCooldown,
    handleRecurringToggle,
    handleFileChange,
    handleFileUpload,
    onSubmit
  } = useBillsExpensesForm();

  if (viewMode === "records") {
    return <BillsExpensesRecords onBack={() => setViewMode("form")} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          variant="outline"
          onClick={() => setViewMode("records")}
        >
          View Records
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Bills & Expenses Form</CardTitle>
        </CardHeader>
        <CardContent>
          <BillExpenseFormContent
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
            setValue={setValue}
            isRecurring={isRecurring}
            handleRecurringToggle={handleRecurringToggle}
            fileInputRef={fileInputRef}
            fileSelected={fileSelected}
            handleFileUpload={handleFileUpload}
            isUploading={isUploading}
            uploadedFileUrl={uploadedFileUrl}
            isSubmissionCooldown={isSubmissionCooldown}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BillsExpensesForm;
