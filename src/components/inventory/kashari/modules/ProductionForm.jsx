
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Save, BarChart2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ProductionForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    productionType: 'crops',
    productCategory: '',
    productName: '',
    productionDate: new Date(),
    productionVolume: '',
    productionUnit: '',
    frequency: 'daily',
    remarks: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  // Product options based on category
  const productOptions = {
    crops: ['Bananas', 'Maize', 'Coffee', 'Beans', 'Vegetables', 'Other'],
    livestock: ['Dairy', 'Beef', 'Goats', 'Poultry', 'Other']
  };

  // Unit options based on product type
  const unitOptions = {
    crops: ['Kg', 'Tons', 'Bunches', 'Bags', 'Pieces'],
    livestock: ['Liters', 'Kg', 'Heads', 'Eggs', 'Other']
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      productionDate: date
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset dependent fields when type changes
    if (name === 'productionType') {
      setFormData(prev => ({
        ...prev,
        productCategory: '',
        productName: '',
        productionUnit: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.productCategory || !formData.productName || !formData.productionVolume) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Here you would typically save to Supabase or another backend
      console.log('Production data to save:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Production data saved successfully",
      });
      
      // Reset form
      setFormData({
        productionType: formData.productionType,
        productCategory: '',
        productName: '',
        productionDate: new Date(),
        productionVolume: '',
        productionUnit: '',
        frequency: formData.frequency,
        remarks: '',
        location: '',
      });
    } catch (error) {
      console.error('Error saving production data:', error);
      toast({
        title: "Error",
        description: "Failed to save production data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Production Data Entry</h3>
        <Button variant="outline" className="flex gap-2 items-center">
          <BarChart2 className="h-4 w-4" />
          View Reports
        </Button>
      </div>

      <Tabs defaultValue="crops" value={formData.productionType} onValueChange={(value) => handleSelectChange('productionType', value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="crops">Crop Production</TabsTrigger>
          <TabsTrigger value="livestock">Livestock Production</TabsTrigger>
        </TabsList>

        <TabsContent value="crops" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productCategory">Crop Category*</Label>
                    <Select 
                      value={formData.productCategory} 
                      onValueChange={(value) => handleSelectChange('productCategory', value)}
                    >
                      <SelectTrigger id="productCategory">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staples">Staple Crops</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="cash_crops">Cash Crops</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productName">Crop Name*</Label>
                    <Select 
                      value={formData.productName} 
                      onValueChange={(value) => handleSelectChange('productName', value)}
                    >
                      <SelectTrigger id="productName">
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {productOptions.crops.map(crop => (
                          <SelectItem key={crop} value={crop.toLowerCase()}>{crop}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select 
                      value={formData.frequency} 
                      onValueChange={(value) => handleSelectChange('frequency', value)}
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                        <SelectItem value="harvest">Per Harvest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Production Date*</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.productionDate ? format(formData.productionDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar 
                          mode="single" 
                          selected={formData.productionDate} 
                          onSelect={handleDateChange} 
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productionVolume">Volume/Quantity*</Label>
                    <Input 
                      id="productionVolume" 
                      name="productionVolume" 
                      type="number" 
                      placeholder="Enter quantity" 
                      value={formData.productionVolume} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productionUnit">Unit</Label>
                    <Select 
                      value={formData.productionUnit} 
                      onValueChange={(value) => handleSelectChange('productionUnit', value)}
                    >
                      <SelectTrigger id="productionUnit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {unitOptions.crops.map(unit => (
                          <SelectItem key={unit} value={unit.toLowerCase()}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location/Field</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      placeholder="Enter field or location" 
                      value={formData.location} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks/Notes</Label>
                  <Textarea 
                    id="remarks" 
                    name="remarks" 
                    placeholder="Enter any additional notes or observations" 
                    value={formData.remarks} 
                    onChange={handleInputChange} 
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Production Data
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="livestock" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productCategory">Livestock Category*</Label>
                    <Select 
                      value={formData.productCategory} 
                      onValueChange={(value) => handleSelectChange('productCategory', value)}
                    >
                      <SelectTrigger id="productCategory">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="beef">Beef</SelectItem>
                        <SelectItem value="goats">Goats</SelectItem>
                        <SelectItem value="poultry">Poultry</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Type*</Label>
                    <Select 
                      value={formData.productName} 
                      onValueChange={(value) => handleSelectChange('productName', value)}
                    >
                      <SelectTrigger id="productName">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.productCategory === 'dairy' && (
                          <>
                            <SelectItem value="milk">Milk</SelectItem>
                            <SelectItem value="cheese">Cheese</SelectItem>
                            <SelectItem value="butter">Butter</SelectItem>
                            <SelectItem value="yogurt">Yogurt</SelectItem>
                          </>
                        )}
                        {formData.productCategory === 'beef' && (
                          <>
                            <SelectItem value="meat">Meat</SelectItem>
                            <SelectItem value="calves">Calves</SelectItem>
                            <SelectItem value="hides">Hides</SelectItem>
                          </>
                        )}
                        {formData.productCategory === 'goats' && (
                          <>
                            <SelectItem value="meat">Meat</SelectItem>
                            <SelectItem value="milk">Milk</SelectItem>
                            <SelectItem value="kids">Kids</SelectItem>
                          </>
                        )}
                        {formData.productCategory === 'poultry' && (
                          <>
                            <SelectItem value="eggs">Eggs</SelectItem>
                            <SelectItem value="meat">Meat</SelectItem>
                            <SelectItem value="chicks">Chicks</SelectItem>
                          </>
                        )}
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select 
                      value={formData.frequency} 
                      onValueChange={(value) => handleSelectChange('frequency', value)}
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Production Date*</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.productionDate ? format(formData.productionDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar 
                          mode="single" 
                          selected={formData.productionDate} 
                          onSelect={handleDateChange}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productionVolume">Volume/Quantity*</Label>
                    <Input 
                      id="productionVolume" 
                      name="productionVolume" 
                      type="number" 
                      placeholder="Enter quantity" 
                      value={formData.productionVolume} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productionUnit">Unit</Label>
                    <Select 
                      value={formData.productionUnit} 
                      onValueChange={(value) => handleSelectChange('productionUnit', value)}
                    >
                      <SelectTrigger id="productionUnit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {unitOptions.livestock.map(unit => (
                          <SelectItem key={unit} value={unit.toLowerCase()}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location/Pen</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      placeholder="Enter pen or location" 
                      value={formData.location} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks/Notes</Label>
                  <Textarea 
                    id="remarks" 
                    name="remarks" 
                    placeholder="Enter any additional notes about health, feed, etc." 
                    value={formData.remarks} 
                    onChange={handleInputChange} 
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Production Data
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionForm;
