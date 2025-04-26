
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, Beef, BarChart2, PlusCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { format } from 'date-fns';

const CattleManagement = ({ isDataEntry = false }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('registry');
  const [cattleData, setCattleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cattleCounts, setCattleCounts] = useState({
    motherCows: 0,
    heifers: 0,
    bulls: 0,
    malecalves: 0,
    femalecalves: 0
  });
  
  const [newCattle, setNewCattle] = useState({
    tagNumber: '',
    name: '',
    type: 'mother_cow',
    breed: 'friesian',
    dob: '',
    weight: '',
    health: 'good',
    notes: '',
    status: 'active'
  });
  
  // Form validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCattleData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cattle_inventory')
        .select('*')
        .eq('farm_id', 'bukomero')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched cattle data:', data);
      setCattleData(data || []);
      
      const counts = {
        motherCows: 0,
        heifers: 0,
        bulls: 0,
        malecalves: 0,
        femalecalves: 0
      };
      
      data.forEach(cattle => {
        switch(cattle.cattle_type) {
          case 'mother_cow': counts.motherCows++; break;
          case 'heifer': counts.heifers++; break;
          case 'bull': counts.bulls++; break;
          case 'male_calf': counts.malecalves++; break;
          case 'female_calf': counts.femalecalves++; break;
        }
      });
      
      setCattleCounts(counts);
      
      toast({
        title: "Data Loaded Successfully",
        description: `${data.length} cattle records loaded.`,
        variant: "default"
      });
    } catch (err) {
      console.error('Error fetching cattle data:', err);
      toast({
        title: "Error",
        description: "Failed to load cattle data: " + err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCattleData();
    
    // Set up a realtime subscription to cattle_inventory table
    const cattleSubscription = supabase
      .channel('cattle_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cattle_inventory', filter: 'farm_id=eq.bukomero' }, 
        (payload) => {
          console.log('Realtime update received:', payload);
          fetchCattleData();
      })
      .subscribe();
      
    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(cattleSubscription);
    };
  }, []);

  const validateForm = () => {
    const errors = {};
    
    if (!newCattle.tagNumber || newCattle.tagNumber.trim() === '') {
      errors.tagNumber = 'Tag number is required';
    }
    
    if (!newCattle.type) {
      errors.type = 'Cattle type is required';
    }
    
    if (newCattle.weight && isNaN(Number(newCattle.weight))) {
      errors.weight = 'Weight must be a valid number';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCattle(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setNewCattle(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field when user selects
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare data for Supabase
      const cattleRecord = {
        tag_number: newCattle.tagNumber.trim(),
        name: newCattle.name.trim() || null,
        cattle_type: newCattle.type,
        breed: newCattle.breed,
        date_of_birth: newCattle.dob || null,
        weight: newCattle.weight ? parseFloat(newCattle.weight) : null,
        health_status: newCattle.health,
        notes: newCattle.notes.trim() || null,
        status: newCattle.status,
        farm_id: 'bukomero'
      };
      
      console.log('Submitting cattle record:', cattleRecord);
      
      // Check for duplicate tag number
      const { data: existingCattle, error: checkError } = await supabase
        .from('cattle_inventory')
        .select('id')
        .eq('tag_number', cattleRecord.tag_number)
        .eq('farm_id', 'bukomero');
        
      if (checkError) throw checkError;
      
      if (existingCattle && existingCattle.length > 0) {
        toast({
          title: "Duplicate Tag Number",
          description: "A cattle with this tag number already exists.",
          variant: "destructive"
        });
        return;
      }
      
      // Insert the new record
      const { data, error } = await supabase
        .from('cattle_inventory')
        .insert([cattleRecord])
        .select();

      if (error) throw error;
      
      console.log('Cattle record added successfully:', data);
      
      toast({
        title: "Success",
        description: "Cattle record added successfully.",
      });
      
      // Reset form after successful submission
      setNewCattle({
        tagNumber: '',
        name: '',
        type: 'mother_cow',
        breed: 'friesian',
        dob: '',
        weight: '',
        health: 'good',
        notes: '',
        status: 'active'
      });
      
      // Switch to registry tab to see the new record
      setActiveTab('registry');
    } catch (error) {
      console.error('Error adding cattle record:', error);
      toast({
        title: "Error",
        description: "Failed to add cattle record: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    fetchCattleData();
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Preparing cattle data export..."
    });
    
    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Tag Number,Name,Type,Breed,Date of Birth,Weight,Health Status,Status\n";
      
      cattleData.forEach(cattle => {
        const row = [
          cattle.tag_number,
          cattle.name || "",
          getCattleTypeLabel(cattle.cattle_type),
          getBreedLabel(cattle.breed),
          cattle.date_of_birth || "",
          cattle.weight ? `${cattle.weight} kg` : "",
          cattle.health_status,
          cattle.status
        ].join(",");
        csvContent += row + "\n";
      });
      
      // Create download link and trigger download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `bukomero_cattle_inventory_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Complete",
        description: "Cattle data has been exported successfully.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export cattle data: " + error.message,
        variant: "destructive"
      });
    }
  };

  const getCattleTypeLabel = (type) => {
    const types = {
      'mother_cow': 'Mother Cow',
      'heifer': 'Heifer',
      'bull': 'Bull',
      'male_calf': 'Male Calf',
      'female_calf': 'Female Calf'
    };
    return types[type] || type;
  };

  const getBreedLabel = (breed) => {
    const breeds = {
      'friesian': 'Friesian',
      'jersey': 'Jersey',
      'guernsey': 'Guernsey',
      'holstein': 'Holstein',
      'mixed': 'Mixed',
      'ankole': 'Ankole'
    };
    return breeds[breed] || breed;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-green-800">Cattle Management</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-4 bg-green-50 p-1">
          <TabsTrigger 
            value="registry" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-green-800"
          >
            <Beef className="h-4 w-4" />
            Cattle Registry
          </TabsTrigger>
          <TabsTrigger 
            value="add" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-green-800" 
            disabled={!isDataEntry}
          >
            <PlusCircle className="h-4 w-4" />
            Add Cattle
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-green-800"
          >
            <BarChart2 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registry">
          <Card className="border-green-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">
              <CardTitle className="text-lg text-green-800">Cattle Registry</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
                </div>
              ) : cattleData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No cattle records found. Add some cattle to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50 text-green-800">
                        <TableHead>Tag/Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Breed</TableHead>
                        <TableHead className="hidden md:table-cell">Age/DOB</TableHead>
                        <TableHead className="hidden lg:table-cell">Weight</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cattleData.map((cattle) => (
                        <TableRow key={cattle.id} className="border-b border-green-50">
                          <TableCell>
                            <div className="font-medium">{cattle.tag_number}</div>
                            <div className="text-sm text-green-600">{cattle.name}</div>
                          </TableCell>
                          <TableCell>{getCattleTypeLabel(cattle.cattle_type)}</TableCell>
                          <TableCell>{getBreedLabel(cattle.breed)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {cattle.date_of_birth ? format(new Date(cattle.date_of_birth), 'PPP') : 'N/A'}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {cattle.weight ? `${cattle.weight} kg` : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={cattle.status === 'active' ? 'default' : 'secondary'}
                                  className={cattle.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"}>
                              {cattle.status?.charAt(0).toUpperCase() + cattle.status?.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card className="border-green-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">
              <CardTitle className="text-lg text-green-800">Add New Cattle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tagNumber" className="text-green-700">Tag Number *</Label>
                    <Input
                      id="tagNumber"
                      name="tagNumber"
                      value={newCattle.tagNumber}
                      onChange={handleInputChange}
                      placeholder="Enter tag number"
                      className={`border-green-200 focus:border-green-300 focus:ring-green-200 ${
                        validationErrors.tagNumber ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {validationErrors.tagNumber && (
                      <p className="text-red-500 text-xs flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.tagNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-green-700">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newCattle.name}
                      onChange={handleInputChange}
                      placeholder="Enter cattle name"
                      className="border-green-200 focus:border-green-300 focus:ring-green-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-green-700">Type *</Label>
                    <Select
                      value={newCattle.type}
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger id="type" className={`border-green-200 focus:ring-green-200 ${
                        validationErrors.type ? 'border-red-500' : ''
                      }`}>
                        <SelectValue placeholder="Select cattle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mother_cow">Mother Cow</SelectItem>
                        <SelectItem value="heifer">Heifer</SelectItem>
                        <SelectItem value="bull">Bull</SelectItem>
                        <SelectItem value="male_calf">Male Calf</SelectItem>
                        <SelectItem value="female_calf">Female Calf</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.type && (
                      <p className="text-red-500 text-xs flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.type}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breed" className="text-green-700">Breed</Label>
                    <Select
                      value={newCattle.breed}
                      onValueChange={(value) => handleSelectChange('breed', value)}
                    >
                      <SelectTrigger id="breed" className="border-green-200 focus:ring-green-200">
                        <SelectValue placeholder="Select breed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friesian">Friesian</SelectItem>
                        <SelectItem value="jersey">Jersey</SelectItem>
                        <SelectItem value="guernsey">Guernsey</SelectItem>
                        <SelectItem value="holstein">Holstein</SelectItem>
                        <SelectItem value="ankole">Ankole</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-green-700">Date of Birth</Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={newCattle.dob}
                      onChange={handleInputChange}
                      className="border-green-200 focus:border-green-300 focus:ring-green-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-green-700">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.1"
                      value={newCattle.weight}
                      onChange={handleInputChange}
                      placeholder="Enter weight"
                      className={`border-green-200 focus:border-green-300 focus:ring-green-200 ${
                        validationErrors.weight ? 'border-red-500' : ''
                      }`}
                    />
                    {validationErrors.weight && (
                      <p className="text-red-500 text-xs flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.weight}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="health" className="text-green-700">Health Status</Label>
                    <Select
                      value={newCattle.health}
                      onValueChange={(value) => handleSelectChange('health', value)}
                    >
                      <SelectTrigger id="health" className="border-green-200 focus:ring-green-200">
                        <SelectValue placeholder="Select health status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-green-700">Status</Label>
                    <Select
                      value={newCattle.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger id="status" className="border-green-200 focus:ring-green-200">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="deceased">Deceased</SelectItem>
                        <SelectItem value="quarantined">Quarantined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes" className="text-green-700">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={newCattle.notes}
                      onChange={handleInputChange}
                      placeholder="Enter any additional notes"
                      rows={3}
                      className="border-green-200 focus:border-green-300 focus:ring-green-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      'Add Cattle Record'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="border-green-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">
              <CardTitle className="text-lg text-green-800">Cattle Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-green-100 shadow-sm">
                  <CardHeader className="pb-2 bg-green-50 border-b border-green-100">
                    <CardTitle className="text-base text-green-800">Cattle Composition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-green-700">Mother Cows:</span>
                        <span className="font-medium text-green-800">{cattleCounts.motherCows}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Heifers:</span>
                        <span className="font-medium text-green-800">{cattleCounts.heifers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Bulls:</span>
                        <span className="font-medium text-green-800">{cattleCounts.bulls}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Male Calves:</span>
                        <span className="font-medium text-green-800">{cattleCounts.malecalves}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Female Calves:</span>
                        <span className="font-medium text-green-800">{cattleCounts.femalecalves}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-green-100 pt-2">
                        <span className="text-green-800">Total Head Count:</span>
                        <span className="text-green-800">{Object.values(cattleCounts).reduce((a, b) => a + b, 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-100 shadow-sm">
                  <CardHeader className="pb-2 bg-green-50 border-b border-green-100">
                    <CardTitle className="text-base text-green-800">Herd Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-green-700">Overall Herd Health:</span>
                          <span className="font-medium text-green-600">Good</span>
                        </div>
                        <div className="w-full bg-green-100 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Vaccination Rate:</span>
                        <span className="font-medium text-green-800">95%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Milk Producing Cows:</span>
                        <span className="font-medium text-green-800">{cattleCounts.motherCows}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Breeding Potential:</span>
                        <span className="font-medium text-green-800">High</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CattleManagement;
