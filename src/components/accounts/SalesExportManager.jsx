import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SalesExportManager = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    customerName: '',
    destination: '',
    saleType: '',
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
    console.log("Sales order:", formData);
    // Implement sales order submission logic
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Sales & Export Manager</h3>
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
          <Label htmlFor="customerName">Customer Name</Label>
          <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Input id="destination" name="destination" value={formData.destination} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="saleType">Sale Type</Label>
          <Select name="saleType" onValueChange={(value) => handleInputChange({ target: { name: 'saleType', value } })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select sale type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="export">Export</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Create Sales Order</Button>
      </form>
    </div>
  );
};

export default SalesExportManager;