
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, RefreshCw } from "lucide-react";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

const ProductionForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('crops');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    productionType: activeTab,
    category: '',
    productName: '',
    productionDate: selectedDate,
    volume: '',
    unit: '',
    location: '',
    remarks: '',
    frequency: 'daily'
  });

  // Preset categories based on production type
  const categories = {
    crops: ['Bananas', 'Maize', 'Coffee', 'Vegetables', 'Fruits', 'Other'],
    livestock: ['Dairy', 'Beef', 'Goats', 'Poultry', 'Pigs', 'Other']
  };

  // Preset products based on category
  const products = {
    Bananas: ['Matooke', 'Sweet Bananas', 'Gonja', 'Other'],
    Maize: ['Fresh Corn', 'Dry Corn', 'Seed Maize', 'Other'],
    Coffee: ['Arabica', 'Robusta', 'Other'],
    Dairy: ['Milk', 'Cheese', 'Yogurt', 'Other'],
    Beef: ['Live Animals', 'Meat (kg)', 'Other'],
    Goats: ['Live Animals', 'Meat (kg)', 'Milk', 'Other'],
    Poultry: ['Eggs', 'Meat (kg)', 'Live Birds', 'Other'],
    Pigs: ['Live Animals', 'Meat (kg)', 'Other']
  };

  // Units based on product type
  const unitOptions = {
    Milk: ['Liters', 'Gallons'],
    Eggs: ['Trays', 'Pieces', 'Dozens'],
    Matooke: ['Bunches', 'Kilograms'],
    'Fresh Corn': ['Kilograms', 'Sacks'],
    'Dry Corn': ['Kilograms', 'Sacks'],
    default: ['Kilograms', 'Units', 'Sacks', 'Trays', 'Bunches', 'Pieces']
  };

  // Farm locations
  const locations = [
    'Main Farm', 'North Field', 'South Field', 'East Pasture', 
    'West Pasture', 'Banana Plantation', 'Coffee Plantation',
    'Dairy Unit', 'Goat Pen', 'Poultry House', 'Maize Field'
  ];

  const handleTabChange = (value) => {
    setActiveTab(value);
    setFormData(prev => ({
      ...prev,
      productionType: value,
      category: '',
      productName: '',
      unit: ''
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      productionDate: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.category || !formData.productName || !formData.volume || !formData.unit) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here we would normally save to Supabase or another backend
      console.log("Saving production data:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Production record saved successfully!",
      });
      
      // Reset form
      setFormData({
        productionType: activeTab,
        category: '',
        productName: '',
        productionDate: new Date(),
        volume: '',
        unit: '',
        location: '',
        remarks: '',
        frequency: 'daily'
      });
      setSelectedDate(new Date());
    } catch (error) {
      console.error("Error saving production data:", error);
      toast({
        title: "Error",
        description: "Failed to save production record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      productionType: activeTab,
      category: '',
      productName: '',
      productionDate: new Date(),
      volume: '',
      unit: '',
      location: '',
      remarks: '',
      frequency: 'daily'
    });
    setSelectedDate(new Date());
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="crops">Crop Production</TabsTrigger>
          <TabsTrigger value="livestock">Livestock Production</TabsTrigger>
        </TabsList>

        <TabsContent value="crops" className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Crop Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.crops.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Select 
                  value={formData.productName} 
                  onValueChange={(value) => handleSelectChange('productName', value)}
                  disabled={!formData.category || !products[formData.category]}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category && products[formData.category] 
                      ? products[formData.category].map(product => (
                          <SelectItem key={product} value={product}>{product}</SelectItem>
                        ))
                      : <SelectItem value="none">Select category first</SelectItem>
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productionDate">Production Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume">Volume/Quantity *</Label>
                <Input
                  id="volume"
                  name="volume"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.volume}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit of Measure *</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => handleSelectChange('unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.productName && unitOptions[formData.productName]
                      ? unitOptions[formData.productName]
                      : unitOptions.default).map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select 
                  value={formData.location} 
                  onValueChange={(value) => handleSelectChange('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Recording Frequency</Label>
                <Select 
                  value={formData.frequency} 
                  onValueChange={(value) => handleSelectChange('frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Add any additional notes or observations"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                disabled={isSubmitting}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Record"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="livestock" className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Livestock Type *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.livestock.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Product *</Label>
                <Select 
                  value={formData.productName} 
                  onValueChange={(value) => handleSelectChange('productName', value)}
                  disabled={!formData.category || !products[formData.category]}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category && products[formData.category] 
                      ? products[formData.category].map(product => (
                          <SelectItem key={product} value={product}>{product}</SelectItem>
                        ))
                      : <SelectItem value="none">Select type first</SelectItem>
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productionDate">Production Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume">Volume/Quantity *</Label>
                <Input
                  id="volume"
                  name="volume"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.volume}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit of Measure *</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => handleSelectChange('unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.productName && unitOptions[formData.productName]
                      ? unitOptions[formData.productName]
                      : unitOptions.default).map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select 
                  value={formData.location} 
                  onValueChange={(value) => handleSelectChange('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Recording Frequency</Label>
                <Select 
                  value={formData.frequency} 
                  onValueChange={(value) => handleSelectChange('frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Add any additional notes or observations"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                disabled={isSubmitting}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Record"}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionForm;
