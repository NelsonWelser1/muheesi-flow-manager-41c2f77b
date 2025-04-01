
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
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, Download, Leaf, FileText, BarChart2, PlusCircle, Trash2, Pencil, DollarSign, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSilageInventory } from "@/hooks/useSilageInventory";
import { format, parseISO } from 'date-fns';

const SilageManager = ({ farmId, isDataEntry = true }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('inventory');
  const { 
    silageData, 
    isLoading, 
    isSubmitting, 
    error, 
    addSilageRecord, 
    updateSilageRecord, 
    deleteSilageRecord, 
    refreshData, 
    exportToCSV 
  } = useSilageInventory(farmId);
  
  // New silage form state
  const [newSilage, setNewSilage] = useState({
    type: 'maize',
    amount: '',
    unit: 'tons',
    productionDate: format(new Date(), 'yyyy-MM-dd'),
    expiryDate: '',
    storageLocation: '',
    quality: 'good',
    notes: '',
    ingredients: [],
    expensesIncurred: '',
    personInCharge: ''
  });

  // Ingredients options
  const ingredientOptions = ['molasses', 'urea', 'salt', 'formic acid'];

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSilage(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user makes changes
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setNewSilage(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user makes changes
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle ingredient checkbox changes
  const handleIngredientChange = (ingredient, checked) => {
    setNewSilage(prev => {
      const currentIngredients = prev.ingredients || [];
      
      if (checked) {
        return { ...prev, ingredients: [...currentIngredients, ingredient] };
      } else {
        return { ...prev, ingredients: currentIngredients.filter(item => item !== ingredient) };
      }
    });
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!newSilage.type) errors.type = "Type is required";
    if (!newSilage.amount || newSilage.amount <= 0) errors.amount = "Valid amount is required";
    if (!newSilage.unit) errors.unit = "Unit is required";
    if (!newSilage.productionDate) errors.productionDate = "Production date is required";
    if (!newSilage.quality) errors.quality = "Quality rating is required";
    
    // Check if expiry date is after production date if provided
    if (newSilage.expiryDate && newSilage.productionDate && 
        new Date(newSilage.expiryDate) <= new Date(newSilage.productionDate)) {
      errors.expiryDate = "Expiry date must be after production date";
    }
    
    // Validate expenses if provided
    if (newSilage.expensesIncurred && isNaN(parseFloat(newSilage.expensesIncurred))) {
      errors.expensesIncurred = "Expenses must be a valid number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive"
      });
      return;
    }

    const success = await addSilageRecord(newSilage);
    
    if (success) {
      // Reset form
      setNewSilage({
        type: 'maize',
        amount: '',
        unit: 'tons',
        productionDate: format(new Date(), 'yyyy-MM-dd'),
        expiryDate: '',
        storageLocation: '',
        quality: 'good',
        notes: '',
        ingredients: [],
        expensesIncurred: '',
        personInCharge: ''
      });
      
      // Switch to inventory tab to see the new entry
      setActiveTab('inventory');
    }
  };

  const handleRefresh = () => {
    refreshData();
    toast({
      title: "Data Refreshed",
      description: "Silage data has been updated"
    });
  };

  const handleExport = () => {
    exportToCSV();
  };

  // Calculate total silage by type
  const calculateTotalByType = (type) => {
    return silageData
      .filter(item => item.type === type)
      .reduce((sum, item) => sum + Number(item.amount), 0);
  };

  // Calculate total available silage
  const calculateTotalAvailable = () => {
    return silageData.reduce((sum, item) => sum + Number(item.amount), 0);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'PP');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Format ingredients for display
  const formatIngredients = (ingredients) => {
    if (!ingredients || ingredients.length === 0) return 'None';
    return ingredients.join(', ');
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
                  Error loading silage data: {error}
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
                        <TableHead>Ingredients</TableHead>
                        <TableHead>Person in Charge</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {silageData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-4">
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
                              {formatDate(silage.production_date)}
                            </TableCell>
                            <TableCell>
                              {formatDate(silage.expiry_date)}
                            </TableCell>
                            <TableCell>{silage.storage_location || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant={
                                silage.quality === 'excellent' ? 'default' :
                                silage.quality === 'good' ? 'outline' :
                                silage.quality === 'poor' ? 'destructive' :
                                'secondary'
                              }>
                                {silage.quality.charAt(0).toUpperCase() + silage.quality.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatIngredients(silage.ingredients)}</TableCell>
                            <TableCell>{silage.person_in_charge || 'N/A'}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    // Handle edit functionality
                                    toast({
                                      title: "Edit Feature",
                                      description: "Edit functionality will be implemented in a future update"
                                    });
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => deleteSilageRecord(silage.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
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
                    <Label htmlFor="type">Silage Type *</Label>
                    <Select
                      value={newSilage.type}
                      onValueChange={(value) => handleSelectChange('type', value)}
                      required
                    >
                      <SelectTrigger id="type" className={formErrors.type ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select silage type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maize">Maize Silage</SelectItem>
                        <SelectItem value="grass">Grass Silage</SelectItem>
                        <SelectItem value="alfalfa">Alfalfa Silage</SelectItem>
                        <SelectItem value="mixed">Mixed Silage</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.type && <p className="text-xs text-red-500">{formErrors.type}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        value={newSilage.amount}
                        onChange={handleInputChange}
                        placeholder="Enter amount"
                        required
                        className={formErrors.amount ? "border-red-500" : ""}
                      />
                      {formErrors.amount && <p className="text-xs text-red-500">{formErrors.amount}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit *</Label>
                      <Select
                        value={newSilage.unit}
                        onValueChange={(value) => handleSelectChange('unit', value)}
                        required
                      >
                        <SelectTrigger id="unit" className={formErrors.unit ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tons">Tons</SelectItem>
                          <SelectItem value="kg">Kilograms</SelectItem>
                          <SelectItem value="bales">Bales</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.unit && <p className="text-xs text-red-500">{formErrors.unit}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productionDate">Production Date *</Label>
                    <Input
                      id="productionDate"
                      name="productionDate"
                      type="date"
                      value={newSilage.productionDate}
                      onChange={handleInputChange}
                      required
                      className={formErrors.productionDate ? "border-red-500" : ""}
                    />
                    {formErrors.productionDate && <p className="text-xs text-red-500">{formErrors.productionDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={newSilage.expiryDate}
                      onChange={handleInputChange}
                      className={formErrors.expiryDate ? "border-red-500" : ""}
                    />
                    {formErrors.expiryDate && <p className="text-xs text-red-500">{formErrors.expiryDate}</p>}
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
                    <Label htmlFor="quality">Quality *</Label>
                    <Select
                      value={newSilage.quality}
                      onValueChange={(value) => handleSelectChange('quality', value)}
                      required
                    >
                      <SelectTrigger id="quality" className={formErrors.quality ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.quality && <p className="text-xs text-red-500">{formErrors.quality}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Ingredients</Label>
                    <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                      {ingredientOptions.map((ingredient) => (
                        <div key={ingredient} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`ingredient-${ingredient}`}
                            checked={newSilage.ingredients?.includes(ingredient)}
                            onCheckedChange={(checked) => handleIngredientChange(ingredient, checked)}
                          />
                          <label 
                            htmlFor={`ingredient-${ingredient}`}
                            className="text-sm cursor-pointer capitalize"
                          >
                            {ingredient}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expensesIncurred">Expenses Incurred</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="expensesIncurred"
                        name="expensesIncurred"
                        type="number"
                        step="0.01"
                        value={newSilage.expensesIncurred}
                        onChange={handleInputChange}
                        placeholder="Enter expenses"
                        className={`pl-8 ${formErrors.expensesIncurred ? "border-red-500" : ""}`}
                      />
                    </div>
                    {formErrors.expensesIncurred && <p className="text-xs text-red-500">{formErrors.expensesIncurred}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="personInCharge">Person in Charge</Label>
                    <div className="relative">
                      <User className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="personInCharge"
                        name="personInCharge"
                        value={newSilage.personInCharge}
                        onChange={handleInputChange}
                        placeholder="Enter responsible person"
                        className="pl-8"
                      />
                    </div>
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
                  <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                    {isSubmitting ? (
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
                            {calculateTotalAvailable()} tons
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: `${Math.min(calculateTotalAvailable() / 2, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Duration:</span>
                        <span className="font-medium">
                          ~{Math.round(calculateTotalAvailable() / 0.8)} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily Consumption:</span>
                        <span className="font-medium">0.8 tons</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Feed Efficiency:</span>
                        <span className={`font-medium ${
                          calculateTotalAvailable() > 50 ? "text-green-600" : 
                          calculateTotalAvailable() > 20 ? "text-amber-600" : 
                          "text-red-600"
                        }`}>
                          {calculateTotalAvailable() > 50 ? "Good" : 
                           calculateTotalAvailable() > 20 ? "Average" : 
                           "Low"}
                        </span>
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
