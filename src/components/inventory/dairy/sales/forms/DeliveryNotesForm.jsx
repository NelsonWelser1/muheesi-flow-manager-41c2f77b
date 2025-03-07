
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DeliveryNotesFormFields from './components/DeliveryNotesFormFields';
import DeliveryNotesFormActions from './components/DeliveryNotesFormActions';
import { useDeliveryNotesForm } from './hooks/useDeliveryNotesForm';

const DeliveryNotesForm = ({ onBack }) => {
  const { 
    register, 
    handleSubmit, 
    setValue, 
    errors, 
    onSubmit 
  } = useDeliveryNotesForm();
  
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Delivery Notes Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DeliveryNotesFormFields 
              register={register}
              errors={errors}
              setValue={setValue}
            />
            <DeliveryNotesFormActions />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryNotesForm;
