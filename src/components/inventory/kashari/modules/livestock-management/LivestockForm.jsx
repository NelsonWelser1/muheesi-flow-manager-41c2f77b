
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import { useFormSubmit } from './hooks/useFormSubmit';
import { AnimalIdField, SpeciesField, BreedField, AgeField, HealthStatusField, NotesField } from './components/FormFields';
import FormActions from './components/FormActions';

const LivestockForm = ({ form, isEditing, resetForm, fetchAnimals, debugForm }) => {
  const { handleSubmit, debugSubmission } = useFormSubmit({ isEditing, resetForm, fetchAnimals });

  // Handler for the form submission with debug logging
  const onSubmit = (data) => {
    // Call debug function for logging before actual submission
    const processedData = debugSubmission(data);
    handleSubmit(processedData);
  };

  // Handler for the debug button
  const handleDebugClick = () => {
    const formValues = debugForm();
    console.log('Debug button clicked. Current form state:', formValues);
  };

  return (
    <Card className="mb-6 border border-gray-200">
      <CardContent className="pt-6">
        <div className="flex justify-end mb-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleDebugClick}
            className="flex items-center gap-2"
          >
            <Bug className="h-4 w-4" /> Debug Form
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimalIdField control={form.control} />
            <SpeciesField control={form.control} />
            <BreedField control={form.control} />
            <AgeField control={form.control} />
            <HealthStatusField control={form.control} />
            <NotesField control={form.control} />
            <FormActions isEditing={isEditing} resetForm={resetForm} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LivestockForm;
