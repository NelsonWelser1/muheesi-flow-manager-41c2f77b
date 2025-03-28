
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
import { PlusCircle, Cow, RefreshCw, Download, BarChart2, FileDown } from "lucide-react";
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
  
  // New cattle form state
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

  // Fetch cattle data
  const fetchCattleData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cattle_inventory')
        .select('*')
        .eq('farm_id', 'bukomero')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCattleData(data || []);
      
      // Calculate counts
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
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCattle(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setNewCattle(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newCattle.tagNumber || !newCattle.type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cattle_inventory')
        .insert([{
          tag_number: newCattle.tagNumber,
          name: newCattle.name,
          cattle_type: newCattle.type,
          breed: newCattle.breed,
          date_of_birth: newCattle.dob,
          weight: newCattle.weight ? parseFloat(newCattle.weight) : null,
          health_status: newCattle.health,
          notes: newCattle.notes,
          status: newCattle.status,
          farm_id: 'bukomero',
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Cattle record added successfully.",
      });
      
      // Reset form
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
      
      // Refresh data
      fetchCattleData();
      
      // Switch to registry tab
      setActiveTab('registry');
    } catch (error) {
      console.error('Error adding cattle record:', error);
      toast({
        title: "Error",
        description: "Failed to add cattle record: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    fetchCattleData();
    toast({
      title: "Data Refreshed",
      description: "Cattle data has been updated."
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Preparing cattle data export..."
    });
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Cattle Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-4">
          <TabsTrigger value="registry" className="flex items-center gap-2">
            <Cow className="h-4 w-4" />
            Cattle Registry
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2" disabled={!isDataEntry}>
            <PlusCircle className="h-4 w-4" />
            Add Cattle
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registry">
          <Card>
            <CardHeader>
              <CardTitle>Cattle Registry</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : cattleData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No cattle records found. Add some cattle to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
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
                        <TableRow key={cattle.id}>
                          <TableCell>
                            <div className="font-medium">{cattle.tag_number}</div>
                            <div className="text-sm text-muted-foreground">{cattle.name}</div>
                          </TableCell>
                          <TableCell>{getCattleTypeLabel(cattle.cattle_type)}</TableCell>
                          <TableCell>{getBreedLabel(cattle.breed)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {cattle.date_of_birth ? format(new Date(cattle.date_of_birth), 'PP') : 'N/A'}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {cattle.weight ? `${cattle.weight} kg` : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={cattle.status === 'active' ? 'default' : 'secondary'}>
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
          <Card>
            <CardHeader>
              <CardTitle>Add New Cattle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tagNumber">Tag Number *</Label>
                    <Input
                      id="tagNumber"
                      name="tagNumber"
                      value={newCattle.tagNumber}
                      onChange={handleInputChange}
                      placeholder="Enter tag number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newCattle.name}
                      onChange={handleInputChange}
                      placeholder="Enter cattle name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={newCattle.type}
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger id="type">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breed">Breed</Label>
                    <Select
                      value={newCattle.breed}
                      onValueChange={(value) => handleSelectChange('breed', value)}
                    >
                      <SelectTrigger id="breed">
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
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={newCattle.dob}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={newCattle.weight}
                      onChange={handleInputChange}
                      placeholder="Enter weight"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="health">Health Status</Label>
                    <Select
                      value={newCattle.health}
                      onValueChange={(value) => handleSelectChange('health', value)}
                    >
                      <SelectTrigger id="health">
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
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newCattle.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger id="status">
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
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={newCattle.notes}
                      onChange={handleInputChange}
                      placeholder="Enter any additional notes"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Add Cattle Record
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Cattle Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Cattle Composition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Mother Cows:</span>
                        <span className="font-medium">{cattleCounts.motherCows}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Heifers:</span>
                        <span className="font-medium">{cattleCounts.heifers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bulls:</span>
                        <span className="font-medium">{cattleCounts.bulls}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Male Calves:</span>
                        <span className="font-medium">{cattleCounts.malecalves}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Female Calves:</span>
                        <span className="font-medium">{cattleCounts.femalecalves}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total Head Count:</span>
                        <span>{Object.values(cattleCounts).reduce((a, b) => a + b, 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Herd Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Overall Herd Health:</span>
                          <span className="font-medium text-green-600">Good</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Vaccination Rate:</span>
                        <span className="font-medium">95%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Milk Producing Cows:</span>
                        <span className="font-medium">{cattleCounts.motherCows}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Breeding Potential:</span>
                        <span className="font-medium">High</span>
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
