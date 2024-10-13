import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LogisticsManager = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    origin: '',
    destination: '',
    transportMode: '',
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
    console.log("Logistics order:", formData);
    // Implement logistics order submission logic
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Logistics Manager</h3>
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
          <Label htmlFor="origin">Origin</Label>
          <Input id="origin" name="origin" value={formData.origin} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Input id="destination" name="destination" value={formData.destination} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="transportMode">Transport Mode</Label>
          <Select name="transportMode" onValueChange={(value) => handleInputChange({ target: { name: 'transportMode', value } })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select transport mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="truck">Truck</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="ship">Ship</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Create Logistics Order</Button>
      </form>
    </div>
  );
};

export default LogisticsManager;