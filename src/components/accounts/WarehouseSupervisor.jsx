import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WarehouseSupervisor = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    action: '',
    location: '',
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
    console.log("Warehouse action:", formData);
    // Implement warehouse action logic
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Warehouse Supervisor</h3>
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
          <Label htmlFor="action">Action</Label>
          <Select name="action" onValueChange={(value) => handleInputChange({ target: { name: 'action', value } })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select an action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="receive">Receive</SelectItem>
              <SelectItem value="dispatch">Dispatch</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleInputChange} required />
        </div>
        <Button type="submit">Submit Warehouse Action</Button>
      </form>
    </div>
  );
};

export default WarehouseSupervisor;