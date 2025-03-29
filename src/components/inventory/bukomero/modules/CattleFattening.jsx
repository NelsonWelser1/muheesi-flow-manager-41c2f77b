
import React, { useState, useEffect } from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  RefreshCw, 
  FileDown, 
  Plus, 
  Beef,
  ArrowUpRight,
  Calendar,
  Scale,
  BarChart2,
  Trash2,
  Pencil,
  Tag,
  Check,
  CircleX,
  Filter,
  FileText,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCattleFattening } from "@/hooks/useCattleFattening";
import { supabase } from '@/integrations/supabase/supabase';

const CattleFattening = ({ isDataEntry = false }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBreed, setFilterBreed] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [programToComplete, setProgramToComplete] = useState(null);
  const [completeStatus, setCompleteStatus] = useState('sold');
  const [completeNotes, setCompleteNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Form state
  const [formData, setFormData] = useState({
    tag_number: '',
    name: '',
    breed: '',
    date_of_birth: format(new Date(), 'yyyy-MM-dd'),
    entry_date: format(new Date(), 'yyyy-MM-dd'),
    entry_weight: '',
    current_weight: '',
    target_weight: '',
    feeding_regime: 'standard',
    notes: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  // Fetch data
  const { 
    fatteningData,
    isLoading,
    isSubmitting,
    analytics,
    addFatteningProgram,
    updateFatteningProgram,
    deleteFatteningProgram,
    completeFatteningProgram,
    refreshData,
    exportToCSV
  } = useCattleFattening('bukomero');

  // Fetch available cattle for new entries
  const [availableCattle, setAvailableCattle] = useState([]);
  
  const fetchAvailableCattle = async () => {
    try {
      // Get cattle not already in fattening program
      const { data: fatteningCattle, error: fatteningError } = await supabase
        .from('cattle_fattening')
        .select('tag_number')
        .eq('farm_id', 'bukomero')
        .eq('status', 'active');
      
      if (fatteningError) throw fatteningError;
      
      // Get all male cattle from inventory
      const { data: inventoryCattle, error: inventoryError } = await supabase
        .from('cattle_inventory')
        .select('id, tag_number, name, breed, date_of_birth, weight')
        .eq('farm_id', 'bukomero')
        .eq('status', 'active')
        .in('cattle_type', ['bull', 'male_calf']);
      
      if (inventoryError) throw inventoryError;
      
      // Filter out cattle already in fattening program
      const fatteningTags = fatteningCattle.map(c => c.tag_number);
      const availableCattleList = inventoryCattle.filter(c => !fatteningTags.includes(c.tag_number));
      
      setAvailableCattle(availableCattleList || []);
    } catch (err) {
      console.error('Error fetching available cattle:', err);
    }
  };

  useEffect(() => {
    if (showForm) {
      fetchAvailableCattle();
    }
  }, [showForm]);

  // Filter data based on search and filters
  const filteredData = fatteningData.filter(item => {
    const matchesSearch = 
      searchTerm === '' || 
      item.tag_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesBreed = filterBreed === 'all' || item.breed === filterBreed;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesBreed && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // If selecting existing cattle, pre-fill some fields
    if (name === 'tag_number') {
      const selectedCattle = availableCattle.find(cattle => cattle.tag_number === value);
      if (selectedCattle) {
        setFormData(prev => ({
          ...prev,
          name: selectedCattle.name || '',
          breed: selectedCattle.breed || '',
          date_of_birth: selectedCattle.date_of_birth || format(new Date(), 'yyyy-MM-dd'),
          entry_weight: selectedCattle.weight?.toString() || '',
          current_weight: selectedCattle.weight?.toString() || '',
        }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.tag_number) errors.tag_number = 'Tag number is required';
    if (!formData.breed) errors.breed = 'Breed is required';
    if (!formData.entry_date) errors.entry_date = 'Entry date is required';
    if (!formData.entry_weight) errors.entry_weight = 'Entry weight is required';
    else if (isNaN(formData.entry_weight) || parseFloat(formData.entry_weight) <= 0) {
      errors.entry_weight = 'Entry weight must be a positive number';
    }
    
    if (!formData.current_weight) errors.current_weight = 'Current weight is required';
    else if (isNaN(formData.current_weight) || parseFloat(formData.current_weight) <= 0) {
      errors.current_weight = 'Current weight must be a positive number';
    }
    
    if (!formData.target_weight) errors.target_weight = 'Target weight is required';
    else if (isNaN(formData.target_weight) || parseFloat(formData.target_weight) <= 0) {
      errors.target_weight = 'Target weight must be a positive number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive"
      });
      return;
    }
    
    // Convert string values to numbers
    const processedData = {
      ...formData,
      entry_weight: parseFloat(formData.entry_weight),
      current_weight: parseFloat(formData.current_weight),
      target_weight: parseFloat(formData.target_weight)
    };
    
    let success;
    
    if (editingProgram) {
      success = await updateFatteningProgram(editingProgram.id, processedData);
    } else {
      success = await addFatteningProgram(processedData);
    }
    
    if (success) {
      resetForm();
      setEditingProgram(null);
      setShowForm(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      tag_number: '',
      name: '',
      breed: '',
      date_of_birth: format(new Date(), 'yyyy-MM-dd'),
      entry_date: format(new Date(), 'yyyy-MM-dd'),
      entry_weight: '',
      current_weight: '',
      target_weight: '',
      feeding_regime: 'standard',
      notes: ''
    });
    setFormErrors({});
  };

  // Handle edit button click
  const handleEditClick = (program) => {
    setEditingProgram(program);
    setFormData({
      tag_number: program.tag_number,
      name: program.name || '',
      breed: program.breed || '',
      date_of_birth: program.date_of_birth || format(new Date(), 'yyyy-MM-dd'),
      entry_date: program.entry_date || format(new Date(), 'yyyy-MM-dd'),
      entry_weight: program.entry_weight?.toString() || '',
      current_weight: program.current_weight?.toString() || '',
      target_weight: program.target_weight?.toString() || '',
      feeding_regime: program.feeding_regime || 'standard',
      notes: program.notes || ''
    });
    setShowForm(true);
  };

  // Handle delete button click
  const handleDeleteClick = (program) => {
    setProgramToDelete(program);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (programToDelete) {
      await deleteFatteningProgram(programToDelete.id);
    }
    setIsDeleteDialogOpen(false);
    setProgramToDelete(null);
  };

  // Handle complete button click
  const handleCompleteClick = (program) => {
    setProgramToComplete(program);
    setCompleteStatus('sold');
    setCompleteNotes(`${program.name || program.tag_number} completed fattening program.`);
    setIsCompleteDialogOpen(true);
  };

  // Confirm complete
  const confirmComplete = async () => {
    if (programToComplete) {
      await completeFatteningProgram(programToComplete.id, completeStatus, completeNotes);
    }
    setIsCompleteDialogOpen(false);
    setProgramToComplete(null);
    setCompleteStatus('sold');
    setCompleteNotes('');
  };

  // Calculate progress percentage
  const calculateProgress = (currentWeight, targetWeight) => {
    if (!currentWeight || !targetWeight) return 0;
    const progress = (currentWeight / targetWeight) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // Format date with date-fns
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  // Get weight change trend indicator
  const getWeightTrend = (entry, current) => {
    const gain = current - entry;
    if (gain > 0) {
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold text-green-800 flex items-center">
            <Beef className="h-5 w-5 mr-2 text-green-700" />
            Cattle Fattening Program
          </h2>
          {!showForm && (
            <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100">
              {analytics.totalActive} Active
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => refreshData()}
            variant="outline" 
            size="sm"
            className="bg-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={exportToCSV}
            variant="outline" 
            size="sm"
            className="bg-white"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {showForm ? (
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="text-green-800">
              {editingProgram ? 'Update Fattening Program' : 'Add to Fattening Program'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tag_number">
                    Cattle Tag Number <span className="text-red-500">*</span>
                  </Label>
                  {editingProgram ? (
                    <Input
                      id="tag_number"
                      name="tag_number"
                      value={formData.tag_number}
                      onChange={handleInputChange}
                      readOnly
                      className="bg-gray-50"
                    />
                  ) : (
                    <Select
                      value={formData.tag_number}
                      onValueChange={(value) => handleSelectChange('tag_number', value)}
                    >
                      <SelectTrigger id="tag_number" className={formErrors.tag_number ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select cattle" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCattle.length === 0 ? (
                          <SelectItem value="" disabled>
                            No available cattle found
                          </SelectItem>
                        ) : (
                          availableCattle.map((cattle) => (
                            <SelectItem key={cattle.id} value={cattle.tag_number}>
                              {cattle.tag_number} - {cattle.name || 'Unnamed'} ({cattle.weight || '?'} kg)
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                  {formErrors.tag_number && <p className="text-xs text-red-500">{formErrors.tag_number}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Cattle Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">
                    Breed <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.breed}
                    onValueChange={(value) => handleSelectChange('breed', value)}
                  >
                    <SelectTrigger id="breed" className={formErrors.breed ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select breed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Boran">Boran</SelectItem>
                      <SelectItem value="Ankole Longhorn">Ankole Longhorn</SelectItem>
                      <SelectItem value="Hereford">Hereford</SelectItem>
                      <SelectItem value="Aberdeen">Aberdeen</SelectItem>
                      <SelectItem value="Angus">Angus</SelectItem>
                      <SelectItem value="Charolais">Charolais</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.breed && <p className="text-xs text-red-500">{formErrors.breed}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 absolute ml-3" />
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entry_date">
                    Entry Date <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 absolute ml-3" />
                    <Input
                      id="entry_date"
                      name="entry_date"
                      type="date"
                      value={formData.entry_date}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                  {formErrors.entry_date && <p className="text-xs text-red-500">{formErrors.entry_date}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entry_weight">
                    Entry Weight (kg) <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center">
                    <Scale className="h-4 w-4 text-gray-500 absolute ml-3" />
                    <Input
                      id="entry_weight"
                      name="entry_weight"
                      type="number"
                      step="0.1"
                      value={formData.entry_weight}
                      onChange={handleInputChange}
                      placeholder="Initial weight"
                      className="pl-10"
                      required
                    />
                  </div>
                  {formErrors.entry_weight && <p className="text-xs text-red-500">{formErrors.entry_weight}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current_weight">
                    Current Weight (kg) <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center">
                    <Scale className="h-4 w-4 text-gray-500 absolute ml-3" />
                    <Input
                      id="current_weight"
                      name="current_weight"
                      type="number"
                      step="0.1"
                      value={formData.current_weight}
                      onChange={handleInputChange}
                      placeholder="Current weight"
                      className="pl-10"
                      required
                    />
                  </div>
                  {formErrors.current_weight && <p className="text-xs text-red-500">{formErrors.current_weight}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_weight">
                    Target Weight (kg) <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center">
                    <Scale className="h-4 w-4 text-gray-500 absolute ml-3" />
                    <Input
                      id="target_weight"
                      name="target_weight"
                      type="number"
                      step="0.1"
                      value={formData.target_weight}
                      onChange={handleInputChange}
                      placeholder="Target weight"
                      className="pl-10"
                      required
                    />
                  </div>
                  {formErrors.target_weight && <p className="text-xs text-red-500">{formErrors.target_weight}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feeding_regime">Feeding Regime</Label>
                  <Select
                    value={formData.feeding_regime}
                    onValueChange={(value) => handleSelectChange('feeding_regime', value)}
                  >
                    <SelectTrigger id="feeding_regime">
                      <SelectValue placeholder="Select regime" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="intensive">Intensive</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="specialized">Specialized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Enter any additional notes"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setEditingProgram(null);
                    setShowForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : editingProgram ? 'Update' : 'Add to Program'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Active in Program</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800">{analytics.totalActive}</div>
                <p className="text-xs text-green-600 mt-1">Current participants</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-emerald-800">Average Daily Gain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-800">
                  {analytics.averageDailyGain ? analytics.averageDailyGain.toFixed(2) : '0.00'} kg
                </div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                  <p className="text-xs text-emerald-500">Weight gain per day</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-800">Avg. Days in Program</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-800">
                  {Math.round(analytics.averageDaysInProgram || 0)}
                </div>
                <p className="text-xs text-amber-600 mt-1">Days since entry</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Top Performing Breed</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.weightGainByBreed && analytics.weightGainByBreed.length > 0 ? (
                  <>
                    <div className="text-2xl font-bold text-blue-800">
                      {analytics.weightGainByBreed.sort((a, b) => b.averageGain - a.averageGain)[0]?.breed || 'N/A'}
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      Based on weight gain rate
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-xl font-bold text-blue-800">No data</div>
                    <p className="text-xs text-blue-600 mt-1">Add cattle to view stats</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-2/3">
              <Card className="border-green-100">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-green-800">Fattening Programs</CardTitle>
                    <CardDescription>
                      Manage your beef cattle fattening program
                    </CardDescription>
                  </div>
                  {isDataEntry && (
                    <Button
                      onClick={() => {
                        resetForm();
                        setEditingProgram(null);
                        setShowForm(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by tag or name..."
                        className="pl-9 w-full sm:w-auto min-w-[200px]"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select 
                        value={filterBreed} 
                        onValueChange={(value) => {
                          setFilterBreed(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-[130px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <span className="truncate">
                            {filterBreed === 'all' ? 'All Breeds' : filterBreed}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Breeds</SelectItem>
                          <SelectItem value="Boran">Boran</SelectItem>
                          <SelectItem value="Ankole Longhorn">Ankole Longhorn</SelectItem>
                          <SelectItem value="Hereford">Hereford</SelectItem>
                          <SelectItem value="Aberdeen">Aberdeen</SelectItem>
                          <SelectItem value="Angus">Angus</SelectItem>
                          <SelectItem value="Charolais">Charolais</SelectItem>
                          <SelectItem value="Mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select 
                        value={filterStatus} 
                        onValueChange={(value) => {
                          setFilterStatus(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-[130px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <span className="truncate">
                            {filterStatus === 'all' ? 'All Status' : (
                              filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)
                            )}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                          <SelectItem value="transferred">Transferred</SelectItem>
                          <SelectItem value="deceased">Deceased</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="py-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
                      <p className="mt-2 text-green-800">Loading fattening program data...</p>
                    </div>
                  ) : filteredData.length === 0 ? (
                    <div className="py-8 text-center border rounded-md bg-gray-50">
                      <Beef className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <h3 className="text-lg font-medium text-gray-600">No cattle found</h3>
                      <p className="text-gray-500">
                        {searchTerm || filterBreed !== 'all' || filterStatus !== 'all' 
                          ? 'Try changing your search or filters'
                          : 'Add cattle to the fattening program to get started'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-green-50">
                              <TableHead>Info</TableHead>
                              <TableHead>Weights</TableHead>
                              <TableHead className="hidden md:table-cell">Entry Date</TableHead>
                              <TableHead>Progress</TableHead>
                              <TableHead className="hidden lg:table-cell">Daily Gain</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedData.map((program) => (
                              <TableRow key={program.id} className={program.status !== 'active' ? 'bg-gray-50' : ''}>
                                <TableCell>
                                  <div className="flex items-start gap-2">
                                    <Tag className={`h-5 w-5 ${
                                      program.status === 'active' ? 'text-green-600' : 'text-gray-400'
                                    }`} />
                                    <div>
                                      <div className="font-medium flex items-center">
                                        {program.tag_number}
                                        {program.status !== 'active' && (
                                          <Badge variant="outline" className="ml-2 text-xs">
                                            {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-500">{program.name || 'Unnamed'}</div>
                                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                        <span>Breed: {program.breed || 'Unknown'}</span>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                      <span className="text-sm font-medium">
                                        {program.current_weight} kg
                                      </span>
                                      {getWeightTrend(program.entry_weight, program.current_weight)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Entry: {program.entry_weight} kg
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Target: {program.target_weight} kg
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <div className="text-sm">{formatDate(program.entry_date)}</div>
                                  {program.expected_completion_date && (
                                    <div className="text-xs text-gray-500">
                                      Est. completion: {formatDate(program.expected_completion_date)}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1 w-32">
                                    <Progress 
                                      value={calculateProgress(program.current_weight, program.target_weight)} 
                                      className={program.status === 'active' ? 'h-2' : 'h-2 bg-gray-100'}
                                    />
                                    <div className="text-xs text-gray-500 text-right">
                                      {calculateProgress(program.current_weight, program.target_weight).toFixed(0)}%
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  <div className="text-sm">
                                    {program.daily_gain ? program.daily_gain.toFixed(2) : '0.00'} kg/day
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    {isDataEntry && program.status === 'active' && (
                                      <>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => handleEditClick(program)}
                                        >
                                          <Pencil className="h-4 w-4" />
                                          <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => handleCompleteClick(program)}
                                        >
                                          <Check className="h-4 w-4" />
                                          <span className="sr-only">Complete</span>
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          className="h-8 w-8 p-0 hover:text-red-600 hover:bg-red-50"
                                          onClick={() => handleDeleteClick(program)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                          <span className="sr-only">Delete</span>
                                        </Button>
                                      </>
                                    )}
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 p-0 px-2 flex items-center"
                                      onClick={() => {
                                        toast({
                                          title: `${program.tag_number}`,
                                          description: program.notes || 'No additional notes available',
                                        });
                                      }}
                                    >
                                      <FileText className="h-4 w-4 mr-1" />
                                      <span className="text-xs">Notes</span>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-gray-500">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {
                              Math.min(currentPage * itemsPerPage, filteredData.length)
                            } of {filteredData.length} records
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                              <span className="sr-only">Previous</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                            >
                              <ChevronRight className="h-4 w-4" />
                              <span className="sr-only">Next</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:w-1/3 space-y-4">
              <Card className="border-green-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-800">Breed Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.breedDistribution?.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.breedDistribution.map((item) => (
                        <div key={item.breed} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.breed}</span>
                            <span className="font-medium">{item.count}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-green-600"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      No breed data available
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-amber-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-amber-800">Weight Gain by Breed</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.weightGainByBreed?.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.weightGainByBreed
                        .sort((a, b) => b.averageGain - a.averageGain)
                        .map((item) => (
                          <div key={item.breed} className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{item.breed}</div>
                              <div className="text-xs text-gray-500">{item.count} cattle</div>
                            </div>
                            <div className="text-lg font-bold text-amber-700">
                              {item.averageGain.toFixed(1)} kg
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      No weight gain data available
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-800">Fattening Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-medium">Optimal Age:</h4>
                      <p className="text-gray-600">2 years of age</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Target Weight:</h4>
                      <p className="text-gray-600">1,350 pounds (≈ 612 kg)</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Optimal Breeds:</h4>
                      <p className="text-gray-600">Boran, Ankole Longhorn, Hereford, Aberdeen, Angus, Charolais</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Feeding Regimes:</h4>
                      <ul className="list-disc pl-5 text-gray-600">
                        <li>Standard: Base nutritional requirements</li>
                        <li>Intensive: High energy for faster weight gain</li>
                        <li>Premium: Quality-focused balanced nutrition</li>
                        <li>Specialized: Custom formulations for specific breeds</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {programToDelete?.tag_number || 'this cattle'} from the fattening program.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Complete/Sell confirmation dialog */}
      <AlertDialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Fattening Program</AlertDialogTitle>
            <AlertDialogDescription>
              Update the status of {programToComplete?.tag_number || 'this cattle'} in the fattening program.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="complete-status">New Status</Label>
              <Select
                value={completeStatus}
                onValueChange={setCompleteStatus}
              >
                <SelectTrigger id="complete-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="completed">Completed (Retained)</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                  <SelectItem value="deceased">Deceased</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="complete-notes">Notes</Label>
              <Textarea
                id="complete-notes"
                value={completeNotes}
                onChange={(e) => setCompleteNotes(e.target.value)}
                placeholder="Add details about sale price, reason, etc."
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmComplete}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Update Status
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CattleFattening;
