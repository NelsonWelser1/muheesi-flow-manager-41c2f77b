import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, ChevronUp, Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { addDays, format, isAfter, isBefore } from "date-fns";

const BananaPlantation = () => {
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

  // Function to create custom date picker that allows all dates
  const CustomDatePicker = ({ date, setDate, className }) => {
    return (
      <DatePicker 
        date={date} 
        setDate={setDate} 
        className={className} 
      />
    );
  };

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

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd MMM yyyy');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Crop Management</CardTitle>
          <Button onClick={handleAddCropClick} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Crop
          </Button>
        </CardHeader>
        <CardContent>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Total Plantation Area</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{summaryStats.totalArea} acres</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Growth Stage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  {Object.entries(summaryStats.stageCount).map(([stage, count]) => (
                    <div key={stage} className="flex justify-between">
                      <span>{stage}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Upcoming Treatment Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                {summaryStats.upcomingFertilization.length > 0 ? (
                  <div className="space-y-2">
                    {summaryStats.upcomingFertilization.map(crop => (
                      <Alert key={crop.id} className="py-2">
                        <Bell className="h-4 w-4 text-yellow-500" />
                        <AlertTitle className="text-xs font-medium">Fertilization Due</AlertTitle>
                        <AlertDescription className="text-xs">
                          Area {crop.plantationArea} acres needs fertilization on {formatDate(crop.nextFertilizationDate)}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No upcoming treatments in the next 3 days</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Crop Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('plantationArea')} className="cursor-pointer hover:bg-gray-50">
                    Plantation Area (acres) {sortConfig.key === 'plantationArea' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                  </TableHead>
                  <TableHead onClick={() => handleSort('growthStage')} className="cursor-pointer hover:bg-gray-50">
                    Growth Stage {sortConfig.key === 'growthStage' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                  </TableHead>
                  <TableHead>Last Fertilization</TableHead>
                  <TableHead>Next Fertilization</TableHead>
                  <TableHead onClick={() => handleSort('diseaseStatus')} className="cursor-pointer hover:bg-gray-50">
                    Disease Status {sortConfig.key === 'diseaseStatus' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                  </TableHead>
                  <TableHead onClick={() => handleSort('bunchesHarvested')} className="cursor-pointer hover:bg-gray-50">
                    Bunches Harvested {sortConfig.key === 'bunchesHarvested' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
                  </TableHead>
                  <TableHead>Harvest Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCrops.length > 0 ? (
                  sortedCrops.map((crop) => (
                    <TableRow key={crop.id}>
                      <TableCell>{crop.plantationArea}</TableCell>
                      <TableCell>{crop.growthStage}</TableCell>
                      <TableCell>{formatDate(crop.lastFertilizationDate)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {formatDate(crop.nextFertilizationDate)}
                          {crop.nextFertilizationDate && isAfter(crop.nextFertilizationDate, new Date()) && isBefore(crop.nextFertilizationDate, addDays(new Date(), 3)) && (
                            <Bell className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          crop.diseaseStatus === 'Healthy' ? 'bg-green-100 text-green-800' : 
                          crop.diseaseStatus === 'Infected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {crop.diseaseStatus}
                        </span>
                      </TableCell>
                      <TableCell>{crop.bunchesHarvested || 'N/A'}</TableCell>
                      <TableCell>{formatDate(crop.harvestDate)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCrop(crop)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setCropToDelete(crop);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      No crops found. Add a crop to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Crop Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>Add New Crop</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="plantationArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plantation Area (acres)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="Enter area in acres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="growthStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Growth Stage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select growth stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Seedling">Seedling</SelectItem>
                          <SelectItem value="Vegetative">Vegetative</SelectItem>
                          <SelectItem value="Flowering">Flowering</SelectItem>
                          <SelectItem value="Fruiting">Fruiting</SelectItem>
                          <SelectItem value="Harvesting">Harvesting</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastFertilizationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Last Fertilization Date</FormLabel>
                      <CustomDatePicker date={field.value} setDate={field.onChange} className="w-full" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fertilizerUsed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fertilizer Used</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter fertilizer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nextFertilizationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Next Fertilization Date</FormLabel>
                      <CustomDatePicker date={field.value} setDate={field.onChange} className="w-full" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastPesticideDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Last Pesticide Application</FormLabel>
                      <CustomDatePicker date={field.value} setDate={field.onChange} className="w-full" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pesticideUsed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pesticide Used</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pesticide name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="applicationReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Application</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Explain why pesticide was applied" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="diseaseStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disease Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select disease status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Healthy">Healthy</SelectItem>
                          <SelectItem value="Infected">Infected</SelectItem>
                          <SelectItem value="Treated">Treated</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bunchesHarvested"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bunches Harvested</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="Number of bunches" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="submit">Add Crop</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Crop Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>Edit Crop</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="plantationArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plantation Area (acres)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="Enter area in acres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="growthStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Growth Stage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select growth stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Seedling">Seedling</SelectItem>
                          <SelectItem value="Vegetative">Vegetative</SelectItem>
                          <SelectItem value="Flowering">Flowering</SelectItem>
                          <SelectItem value="Fruiting">Fruiting</SelectItem>
                          <SelectItem value="Harvesting">Harvesting</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastFertilizationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Last Fertilization Date</FormLabel>
                      <CustomDatePicker date={field.value} setDate={field.onChange} className="w-full" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fertilizerUsed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fertilizer Used</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter fertilizer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nextFertilizationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Next Fertilization Date</FormLabel>
                      <CustomDatePicker date={field.value} setDate={field.onChange} className="w-full" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastPesticideDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Last Pesticide Application</FormLabel>
                      <CustomDatePicker date={field.value} setDate={field.onChange} className="w-full" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pesticideUsed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pesticide Used</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pesticide name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="applicationReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Application</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Explain why pesticide was applied" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="diseaseStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disease Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select disease status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Healthy">Healthy</SelectItem>
                          <SelectItem value="Infected">Infected</SelectItem>
                          <SelectItem value="Treated">Treated</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bunchesHarvested"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bunches Harvested</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="Number of bunches" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="submit">Update Crop</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this crop record? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDeleteCrop(cropToDelete?.id)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BananaPlantation;
