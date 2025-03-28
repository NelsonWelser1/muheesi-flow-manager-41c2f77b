
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, Leaf, FileText, BarChart2, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSilageData } from '../../../hooks/useSilageData';
import { format } from 'date-fns';

const SilageManager = ({ farmId, isDataEntry = false }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('inventory');
  const { silageData, isLoading, error, addSilageRecord, updateSilageRecord, fetchSilageData } = useSilageData(farmId);
  
  // New silage form state
  const [newSilage, setNewSilage] = useState({
    type: 'maize',
    amount: '',
    unit: 'tons',
    productionDate: '',
    expiryDate: '',
    storageLocation: '',
    quality: 'good',
    notes: ''
  });

  useEffect(() => {
    fetchSilageData();
  }, [farmId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSilage(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setNewSilage(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newSilage.amount || !newSilage.productionDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addSilageRecord({
        ...newSilage,
        farm_id: farmId,
        amount: parseFloat(newSilage.amount),
        created_at: new Date().toISOString()
      });
      
      toast({
        title: "Success",
        description: "Silage record added successfully.",
      });
      
      // Reset form
      setNewSilage({
        type: 'maize',
        amount: '',
        unit: 'tons',
        productionDate: '',
        expiryDate: '',
        storageLocation: '',
        quality: 'good',
        notes: ''
      });
      
      // Refresh data
      fetchSilageData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add silage record: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    fetchSilageData();
    toast({
      title: "Data Refreshed",
      description: "Silage data has been updated."
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Preparing silage data export..."
    });
  };

  // Calculate total silage by type
  const calculateTotalByType = (type) => {
    return silageData
      .filter(item => item.type === type)
      .reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Silage Management</h2>
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
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2" disabled={!isDataEntry}>
            <PlusCircle className="h-4 w-4" />
            Add Silage
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Silage Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Error loading silage data: {error.message}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Production Date</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Quality</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {silageData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No silage records found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        silageData.map((silage) => (
                          <TableRow key={silage.id}>
                            <TableCell className="flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-green-500" />
                              {silage.type.charAt(0).toUpperCase() + silage.type.slice(1)}
                            </TableCell>
                            <TableCell>
                              {silage.amount} {silage.unit}
                            </TableCell>
                            <TableCell>
                              {silage.productionDate ? format(new Date(silage.productionDate), 'PP') : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {silage.expiryDate ? format(new Date(silage.expiryDate), 'PP') : 'N/A'}
                            </TableCell>
                            <TableCell>{silage.storageLocation}</TableCell>
                            <TableCell>
                              <Badge variant={
                                silage.quality === 'excellent' ? 'default' :
                                silage.quality === 'good' ? 'outline' :
                                'secondary'
                              }>
                                {silage.quality.charAt(0).toUpperCase() + silage.quality.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
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
              <CardTitle>Add New Silage</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Silage Type</Label>
                    <Select
                      value={newSilage.type}
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select silage type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maize">Maize Silage</SelectItem>
                        <SelectItem value="grass">Grass Silage</SelectItem>
                        <SelectItem value="alfalfa">Alfalfa Silage</SelectItem>
                        <SelectItem value="mixed">Mixed Silage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        value={newSilage.amount}
                        onChange={handleInputChange}
                        placeholder="Enter amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select
                        value={newSilage.unit}
                        onValueChange={(value) => handleSelectChange('unit', value)}
                      >
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tons">Tons</SelectItem>
                          <SelectItem value="kg">Kilograms</SelectItem>
                          <SelectItem value="bales">Bales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productionDate">Production Date</Label>
                    <Input
                      id="productionDate"
                      name="productionDate"
                      type="date"
                      value={newSilage.productionDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={newSilage.expiryDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storageLocation">Storage Location</Label>
                    <Input
                      id="storageLocation"
                      name="storageLocation"
                      value={newSilage.storageLocation}
                      onChange={handleInputChange}
                      placeholder="Enter storage location"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quality">Quality</Label>
                    <Select
                      value={newSilage.quality}
                      onValueChange={(value) => handleSelectChange('quality', value)}
                    >
                      <SelectTrigger id="quality">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={newSilage.notes}
                    onChange={handleInputChange}
                    placeholder="Enter any additional notes"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Add Silage Record'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Silage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Silage by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Maize Silage:</span>
                        <span className="font-medium">{calculateTotalByType('maize')} tons</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Grass Silage:</span>
                        <span className="font-medium">{calculateTotalByType('grass')} tons</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Alfalfa Silage:</span>
                        <span className="font-medium">{calculateTotalByType('alfalfa')} tons</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mixed Silage:</span>
                        <span className="font-medium">{calculateTotalByType('mixed')} tons</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Feeding Capacity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Total Available:</span>
                          <span className="font-medium">
                            {silageData.reduce((sum, item) => sum + item.amount, 0)} tons
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Duration:</span>
                        <span className="font-medium">~6 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily Consumption:</span>
                        <span className="font-medium">0.8 tons</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Feed Efficiency:</span>
                        <span className="font-medium text-green-600">Good</span>
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

export default SilageManager;
