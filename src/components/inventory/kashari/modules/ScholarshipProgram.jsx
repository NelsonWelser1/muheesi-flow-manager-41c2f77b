
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, X, Bug } from "lucide-react";
import { useScholarshipProgramData } from './scholarship-program/hooks/useScholarshipProgramData';
import ScholarshipForm from './scholarship-program/ScholarshipForm';
import ScholarshipTable from './scholarship-program/ScholarshipTable';
import ScholarshipSummary from './scholarship-program/ScholarshipSummary';

const ScholarshipProgram = () => {
  const [showForm, setShowForm] = useState(false);
  const {
    scholarships,
    isLoading,
    isSubmitting,
    form,
    handleSubmit,
    handleEdit,
    handleDelete,
    fetchScholarships,
    debugForm,
    editingScholarship,
    setEditingScholarship,
    getScholarshipSummary
  } = useScholarshipProgramData();

  const onSubmit = (data) => {
    console.log('Form submitted with data:', data);
    handleSubmit(data);
    if (!editingScholarship) {
      setShowForm(false);
    }
  };

  const handleCancelEdit = () => {
    form.reset();
    setEditingScholarship(null);
    setShowForm(false);
  };

  const scholarshipSummary = getScholarshipSummary();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Scholarship Program Management</CardTitle>
            <CardDescription>Manage scholarship recipients and program details</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => debugForm()}
              className="flex items-center gap-1"
            >
              <Bug className="h-4 w-4" /> Debug
            </Button>
            <Button 
              onClick={() => {
                if (showForm && !editingScholarship) {
                  setShowForm(false);
                } else if (editingScholarship) {
                  handleCancelEdit();
                } else {
                  setShowForm(true);
                }
              }} 
              className="flex items-center gap-2"
            >
              {showForm || editingScholarship ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm || editingScholarship ? 'Cancel' : 'Add Scholarship'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <ScholarshipSummary summary={scholarshipSummary} />
          </TabsContent>
          
          <TabsContent value="scholarships">
            {/* Scholarship Form */}
            {(showForm || editingScholarship) && (
              <div className="mb-6 p-4 border rounded-md bg-muted/50">
                <h3 className="text-lg font-medium mb-4">{editingScholarship ? 'Edit Scholarship Record' : 'Add New Scholarship'}</h3>
                <ScholarshipForm 
                  form={form} 
                  onSubmit={onSubmit}
                  isEdit={!!editingScholarship}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
            
            {/* Scholarship Table */}
            <ScholarshipTable 
              scholarships={scholarships} 
              isLoading={isLoading} 
              handleEdit={(scholarship) => {
                handleEdit(scholarship);
                setShowForm(true);
              }} 
              handleDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ScholarshipProgram;
