
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import LivestockForm from './LivestockForm';
import LivestockTable from './LivestockTable';
import { useLivestockData } from './hooks/useLivestockData';

const LivestockManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const {
    animals,
    isLoading,
    isEditing,
    editingId,
    form,
    fetchAnimals,
    handleEdit,
    handleDelete,
    resetForm
  } = useLivestockData();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Livestock Management</CardTitle>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Animal'}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <LivestockForm 
            form={form} 
            isEditing={isEditing}
            resetForm={resetForm}
            fetchAnimals={fetchAnimals}
          />
        )}
        
        <LivestockTable 
          animals={animals}
          isLoading={isLoading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};

export default LivestockManagement;
