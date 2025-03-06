
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BatchInfoSection from './sections/BatchInfoSection';
import MilkDetailsSection from './sections/MilkDetailsSection';
import HomogenizationSection from './sections/HomogenizationSection';
import { useMilkPreparationForm } from './hooks/useMilkPreparationForm';
import { useMilkPreparationData } from './hooks/useMilkPreparationData';
import { handlePrint, handleShare } from './utils/formActions';

const MilkPreparationForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, errors, onSubmit } = useMilkPreparationForm();
  const { handleSubmit: submitToDatabase, debugFormData, isSubmitting } = useMilkPreparationData();
  const [formData, setFormData] = useState({});

  const handlePrintClick = async () => {
    const formElement = document.getElementById('milk-preparation-form');
    await handlePrint(formElement, toast);
  };

  const handleShareClick = async () => {
    await handleShare(toast);
  };

  const handleDebugClick = () => {
    debugFormData(formData);
    toast({
      title: "Debug Information",
      description: "Form data has been logged to the console",
    });
  };

  // Enhanced onSubmit that saves to both form handler and database
  const handleFormSubmit = (data) => {
    setFormData(data);
    
    // First, handle the original form submission logic
    onSubmit(data);
    
    // Then, also save to the database
    submitToDatabase(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Milk Preparation & Standardization</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="milk-preparation-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <BatchInfoSection register={register} />
          <MilkDetailsSection register={register} errors={errors} />
          <HomogenizationSection register={register} />

          <div className="flex flex-wrap gap-4 justify-end">
            <Button type="button" variant="outline" onClick={handleDebugClick}>
              Debug Form
            </Button>
            <Button type="button" variant="outline" onClick={handlePrintClick}>
              Print Form
            </Button>
            <Button type="button" variant="outline" onClick={handleShareClick}>
              Share
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Record'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MilkPreparationForm;
