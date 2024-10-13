import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProcurementManager = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    supplier: '',
    cost: '',
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
    console.log("Procurement order:", formData);
    // Implement procurement order logic
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Procurement Manager</h3>
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
          <Label htmlFor="supplier">Supplier</Label>
          <Input id="supplier" name="supplier" value={formData.supplier} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="cost">Cost</Label>
          <Input id="cost" name="cost" type="number" value={formData.cost} onChange={handleInputChange} required />
        </div>
        <Button type="submit">Create Procurement Order</Button>
      </form>
    </div>
  );
};

export default ProcurementManager;