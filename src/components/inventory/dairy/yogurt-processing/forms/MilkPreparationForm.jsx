
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BatchInfoSection from './sections/BatchInfoSection';
import MilkDetailsSection from './sections/MilkDetailsSection';
import HomogenizationSection from './sections/HomogenizationSection';
import { useMilkPreparationForm } from './hooks/useMilkPreparationForm';
import { handlePrint, handleShare } from './utils/formActions';

const MilkPreparationForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, errors, onSubmit } = useMilkPreparationForm();

  const handlePrintClick = async () => {
    const formElement = document.getElementById('milk-preparation-form');
    await handlePrint(formElement, toast);
  };

  const handleShareClick = async () => {
    await handleShare(toast);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Milk Preparation & Standardization</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="milk-preparation-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <BatchInfoSection register={register} />
          <MilkDetailsSection register={register} errors={errors} />
          <HomogenizationSection register={register} />

          <div className="flex flex-wrap gap-4 justify-end">
            <Button type="button" variant="outline" onClick={handlePrintClick}>
              Print Form
            </Button>
            <Button type="button" variant="outline" onClick={handleShareClick}>
              Share
            </Button>
            <Button type="submit">Submit Record</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MilkPreparationForm;
