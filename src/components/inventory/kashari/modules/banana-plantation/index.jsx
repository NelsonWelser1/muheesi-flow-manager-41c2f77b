
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, Bug } from "lucide-react";
import CropForm from './CropForm';
import CropTable from './CropTable';
import { useBananaPlantationData } from './hooks/useBananaPlantationData';
import SummaryStats from './SummaryStats';

const BananaPlantation = () => {
  const [showForm, setShowForm] = useState(false);
  const {
    crops,
    isLoading,
    isSubmitting,
    form,
    handleSubmit,
    handleEdit,
    handleDelete,
    fetchCrops,
    debugForm,
    editingCrop,
    setEditingCrop
  } = useBananaPlantationData();

  const onSubmit = (data) => {
    console.log('Form submitted with data:', data);
    handleSubmit(data);
    if (!editingCrop) {
      setShowForm(false);
    }
  };

  const handleCancelEdit = () => {
    form.reset();
    setEditingCrop(null);
    setShowForm(false);
  };

  // Calculate summary statistics
  const summaryStats = React.useMemo(() => {
    const totalArea = crops.reduce((sum, crop) => sum + crop.plantation_area, 0);
    
    const stageCount = {
      'Seedling': 0,
      'Vegetative': 0,
      'Flowering': 0,
      'Fruiting': 0,
      'Harvesting': 0
    };
    
    crops.forEach(crop => {
      if (crop.growth_stage in stageCount) {
        stageCount[crop.growth_stage]++;
      }
    });

    return {
      totalArea: totalArea.toFixed(2),
      stageCount,
      upcomingFertilization: []
    };
  }, [crops]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Banana Plantation Management</CardTitle>
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
                if (showForm && !editingCrop) {
                  setShowForm(false);
                } else if (editingCrop) {
                  handleCancelEdit();
                } else {
                  setShowForm(true);
                }
              }} 
              className="flex items-center gap-2"
            >
              {showForm || editingCrop ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm || editingCrop ? 'Cancel' : 'Add Crop'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Statistics */}
          <SummaryStats summaryStats={summaryStats} />
          
          {/* Crop Form */}
          {(showForm || editingCrop) && (
            <div className="mb-6 p-4 border rounded-md bg-muted/50">
              <h3 className="text-lg font-medium mb-4">{editingCrop ? 'Edit Crop Record' : 'Add New Crop Record'}</h3>
              <CropForm 
                form={form} 
                onSubmit={onSubmit}
                isEdit={!!editingCrop}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
          
          {/* Crop Table */}
          <CropTable 
            crops={crops} 
            isLoading={isLoading} 
            handleEdit={(crop) => {
              handleEdit(crop);
              setShowForm(true);
            }} 
            handleDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BananaPlantation;
