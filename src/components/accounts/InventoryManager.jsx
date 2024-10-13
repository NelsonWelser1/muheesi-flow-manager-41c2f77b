import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InventoryManager = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    location: '',
    condition: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Inventory update:", formData);
    // Implement inventory update logic
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Inventory Manager</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="productName">Product Name</Label>
          <Input id="productName" name="productName" value={formData.productName} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="location">Storage Location</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="condition">Product Condition</Label>
          <Input id="condition" name="condition" value={formData.condition} onChange={handleInputChange} required />
        </div>
        <Button type="submit">Update Inventory</Button>
      </form>
    </div>
  );
};

export default InventoryManager;