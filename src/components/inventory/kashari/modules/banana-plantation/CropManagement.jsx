
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { addDays, isAfter, isBefore } from "date-fns";
import SummaryStats from './SummaryStats';
import CropTable from './CropTable';
import { AddCropDialog, EditCropDialog, DeleteCropDialog } from './CropDialogs';

const CropManagement = () => {
  const [crops, setCrops] = useState([]);
  const [editingCrop, setEditingCrop] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cropToDelete, setCropToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const { toast } = useToast();

  // Initialize with sample data (replace with actual data fetching logic)
  useEffect(() => {
    // Sample data for demonstration
    const sampleCrops = [
      {
        id: 1,
        plantationArea: 5.5,
        growthStage: 'Flowering',
        lastFertilizationDate: new Date(2024, 2, 15),
        fertilizerUsed: 'NPK 17-17-17',
        nextFertilizationDate: new Date(2024, 3, 15),
        lastPesticideDate: new Date(2024, 2, 10),
        pesticideUsed: 'Chlorpyrifos',
        applicationReason: 'Preventive treatment',
        diseaseStatus: 'Healthy',
        bunchesHarvested: 0,
        harvestDate: null,
        createdAt: new Date(2024, 1, 1)
      },
      {
        id: 2,
        plantationArea: 3.2,
        growthStage: 'Fruiting',
        lastFertilizationDate: new Date(2024, 2, 20),
        fertilizerUsed: 'Organic compost',
        nextFertilizationDate: new Date(2024, 3, 20),
        lastPesticideDate: new Date(2024, 2, 5),
        pesticideUsed: 'Neem oil extract',
        applicationReason: 'Aphid infestation',
        diseaseStatus: 'Treated',
        bunchesHarvested: 12.5,
        harvestDate: new Date(2024, 3, 1),
        createdAt: new Date(2024, 1, 15)
      },
      {
        id: 3,
        plantationArea: 2.8,
        growthStage: 'Vegetative',
        lastFertilizationDate: new Date(2024, 2, 25),
        fertilizerUsed: 'Urea',
        nextFertilizationDate: new Date(2024, 3, 25),
        lastPesticideDate: new Date(2024, 2, 20),
        pesticideUsed: 'Copper fungicide',
        applicationReason: 'Black Sigatoka prevention',
        diseaseStatus: 'Healthy',
        bunchesHarvested: 0,
        harvestDate: null,
        createdAt: new Date(2024, 2, 1)
      }
    ];
    setCrops(sampleCrops);
  }, []);

  // Form configuration
  const form = useForm({
    defaultValues: {
      plantationArea: '',
      growthStage: '',
      lastFertilizationDate: null,
      fertilizerUsed: '',
      nextFertilizationDate: null,
      lastPesticideDate: null,
      pesticideUsed: '',
      applicationReason: '',
      diseaseStatus: '',
      bunchesHarvested: 0,
      harvestDate: null
    }
  });

  // Handle form submission for adding or editing crops
  const onSubmit = (data) => {
    if (editingCrop) {
      // Update existing crop
      const updatedCrops = crops.map(crop => 
        crop.id === editingCrop.id 
          ? { ...crop, ...data, harvestDate: data.bunchesHarvested > 0 ? new Date() : crop.harvestDate } 
          : crop
      );
      setCrops(updatedCrops);
      toast({
        title: "Crop Updated",
        description: "The crop record has been updated successfully.",
      });
      setIsEditDialogOpen(false);
    } else {
      // Add new crop
      const newCrop = {
        ...data,
        id: crops.length > 0 ? Math.max(...crops.map(crop => crop.id)) + 1 : 1,
        harvestDate: data.bunchesHarvested > 0 ? new Date() : null,
        createdAt: new Date()
      };
      setCrops([...crops, newCrop]);
      toast({
        title: "Crop Added",
        description: "A new crop record has been added successfully.",
      });
      setIsAddDialogOpen(false);
    }
    form.reset();
    setEditingCrop(null);
  };

  // Open edit dialog and populate form with crop data
  const handleEditCrop = (crop) => {
    setEditingCrop(crop);
    form.reset({
      plantationArea: crop.plantationArea,
      growthStage: crop.growthStage,
      lastFertilizationDate: crop.lastFertilizationDate,
      fertilizerUsed: crop.fertilizerUsed,
      nextFertilizationDate: crop.nextFertilizationDate,
      lastPesticideDate: crop.lastPesticideDate,
      pesticideUsed: crop.pesticideUsed,
      applicationReason: crop.applicationReason,
      diseaseStatus: crop.diseaseStatus,
      bunchesHarvested: crop.bunchesHarvested,
      harvestDate: crop.harvestDate
    });
    setIsEditDialogOpen(true);
  };

  // Confirm and handle crop deletion
  const handleDeleteCrop = (id) => {
    const updatedCrops = crops.filter(crop => crop.id !== id);
    setCrops(updatedCrops);
    setCropToDelete(null);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Crop Deleted",
      description: "The crop record has been deleted successfully.",
    });
  };

  // Handle sorting of table columns
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to sort crops based on sort configuration
  const sortedCrops = React.useMemo(() => {
    let sortableCrops = [...crops];
    if (sortConfig.key) {
      sortableCrops.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCrops;
  }, [crops, sortConfig]);

  // Calculate summary statistics
  const summaryStats = React.useMemo(() => {
    const totalArea = crops.reduce((sum, crop) => sum + crop.plantationArea, 0);
    
    const stageCount = {
      'Seedling': 0,
      'Vegetative': 0,
      'Flowering': 0,
      'Fruiting': 0,
      'Harvesting': 0
    };
    
    crops.forEach(crop => {
      if (crop.growthStage in stageCount) {
        stageCount[crop.growthStage]++;
      }
    });

    // Find upcoming fertilization reminders
    const today = new Date();
    const upcomingFertilization = crops.filter(crop => 
      crop.nextFertilizationDate && 
      isAfter(crop.nextFertilizationDate, today) && 
      isBefore(crop.nextFertilizationDate, addDays(today, 3))
    );

    return {
      totalArea: totalArea.toFixed(2),
      stageCount,
      upcomingFertilization
    };
  }, [crops]);

  // Reset form when opening add dialog
  const handleAddCropClick = () => {
    form.reset({
      plantationArea: '',
      growthStage: '',
      lastFertilizationDate: null,
      fertilizerUsed: '',
      nextFertilizationDate: null,
      lastPesticideDate: null,
      pesticideUsed: '',
      applicationReason: '',
      diseaseStatus: '',
      bunchesHarvested: 0,
      harvestDate: null
    });
    setIsAddDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Crop Management</CardTitle>
        <Button onClick={handleAddCropClick} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Crop
        </Button>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <SummaryStats summaryStats={summaryStats} />
        
        {/* Crop Table */}
        <CropTable 
          crops={sortedCrops} 
          sortConfig={sortConfig} 
          handleSort={handleSort} 
          handleEditCrop={handleEditCrop} 
          setCropToDelete={setCropToDelete} 
          setIsDeleteDialogOpen={setIsDeleteDialogOpen} 
        />
      </CardContent>

      {/* Dialogs */}
      <AddCropDialog 
        isOpen={isAddDialogOpen} 
        setIsOpen={setIsAddDialogOpen} 
        form={form} 
        onSubmit={onSubmit} 
      />

      <EditCropDialog 
        isOpen={isEditDialogOpen} 
        setIsOpen={setIsEditDialogOpen} 
        form={form} 
        onSubmit={onSubmit} 
      />

      <DeleteCropDialog 
        isOpen={isDeleteDialogOpen} 
        setIsOpen={setIsDeleteDialogOpen} 
        cropToDelete={cropToDelete} 
        handleDeleteCrop={handleDeleteCrop} 
      />
    </Card>
  );
};

export default CropManagement;
