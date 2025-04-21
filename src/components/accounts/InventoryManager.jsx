
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { sendInventoryUpdate } from '@/utils/ceoDashboardUtils';

const InventoryManager = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    location: '',
    condition: 'Good',
    company: 'Grand Berna Dairies'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Inventory update:", formData);
    
    // Send to CEO Dashboard
    try {
      await sendInventoryUpdate({
        company: formData.company,
        product: formData.productName,
        quantity: Number(formData.quantity),
        action: 'update',
        value: 0
      });
      
      toast({
        title: "Success",
        description: "Inventory updated successfully and notified to CEO Dashboard",
      });
      
      // Reset form
      setFormData({
        productName: '',
        quantity: '',
        location: '',
        condition: 'Good',
        company: 'Grand Berna Dairies'
      });
    } catch (error) {
      console.error("Error updating inventory:", error);
      
      toast({
        title: "Error",
        description: "Failed to update inventory",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Inventory Manager</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="company">Company</Label>
          <Select 
            value={formData.company} 
            onValueChange={(value) => handleSelectChange('company', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Grand Berna Dairies">Grand Berna Dairies</SelectItem>
              <SelectItem value="KAJON Coffee Limited">KAJON Coffee Limited</SelectItem>
              <SelectItem value="Kyalima Farmers Limited">Kyalima Farmers Limited</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="productName">Product Name</Label>
          <Input 
            id="productName" 
            name="productName" 
            value={formData.productName} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input 
            id="quantity" 
            name="quantity" 
            type="number" 
            value={formData.quantity} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="location">Storage Location</Label>
          <Input 
            id="location" 
            name="location" 
            value={formData.location} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="condition">Product Condition</Label>
          <Select 
            value={formData.condition} 
            onValueChange={(value) => handleSelectChange('condition', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
              <SelectItem value="Damaged">Damaged</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button type="submit">Update Inventory</Button>
      </form>
    </div>
  );
};

export default InventoryManager;
