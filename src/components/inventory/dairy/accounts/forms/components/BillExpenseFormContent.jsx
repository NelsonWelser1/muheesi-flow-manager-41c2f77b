
import React from 'react';
import { Button } from "@/components/ui/button";
import FormFieldGroup from './FormFieldGroup';
import RecurringSection from './RecurringSection';
import NotesField from './NotesField';
import FileUploadSection from './FileUploadSection';

const BillExpenseFormContent = ({
  onSubmit,
  register,
  errors,
  setValue,
  isRecurring,
  handleRecurringToggle,
  fileInputRef,
  fileSelected,
  handleFileUpload,
  isUploading,
  uploadedFileUrl
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormFieldGroup 
        register={register} 
        errors={errors} 
        setValue={setValue} 
      />

      <RecurringSection 
        isRecurring={isRecurring}
        handleRecurringToggle={handleRecurringToggle}
        setValue={setValue}
        register={register}
      />

      <NotesField register={register} />

      <FileUploadSection 
        fileInputRef={fileInputRef}
        fileSelected={fileSelected}
        handleFileUpload={handleFileUpload}
        isUploading={isUploading}
        uploadedFileUrl={uploadedFileUrl}
      />

      <div className="flex gap-4">
        <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">
          Record Expense
        </Button>
      </div>
    </form>
  );
};

export default BillExpenseFormContent;
