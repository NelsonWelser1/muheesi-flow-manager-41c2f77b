
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useFormSubmit } from './hooks/useFormSubmit';
import { AnimalIdField, SpeciesField, BreedField, AgeField, HealthStatusField, NotesField } from './components/FormFields';
import FormActions from './components/FormActions';

const LivestockForm = ({ form, isEditing, resetForm, fetchAnimals }) => {
  const { handleSubmit } = useFormSubmit({ isEditing, resetForm, fetchAnimals });

  return (
    <Card className="mb-6 border border-gray-200">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
