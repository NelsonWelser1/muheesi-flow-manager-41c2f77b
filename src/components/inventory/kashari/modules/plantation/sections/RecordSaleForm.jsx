
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sendSalesUpdate } from '@/utils/ceoDashboardUtils';

const RecordSaleForm = ({ inventoryData, onSubmit, onCancel, isSubmitting }) => {
  const [form, setForm] = useState({
    product: '',
    quantity: '',
    unitPrice: '',
    customer: ''
  });
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectProduct = (value) => {
    setForm(prev => ({
      ...prev,
      product: value
    }));
    
    setSelectedProduct(inventoryData.find(item => item.product === value));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.product || !form.quantity || !form.unitPrice || !form.customer) {
      alert('Please fill in all fields');
      return;
    }
    
    // Check if quantity is available
    if (selectedProduct && parseInt(form.quantity) > selectedProduct.remaining) {
      alert(`Not enough stock available. Only ${selectedProduct.remaining} ${selectedProduct.unit} available.`);
      return;
    }
    
    // Send to CEO Dashboard
    sendSalesUpdate({
      company: 'Kyalima Farmers Limited',
      product: form.product,
      quantity: parseInt(form.quantity),
      unitPrice: parseFloat(form.unitPrice),
      customer: form.customer
    }).catch(err => {
      console.error('Error sending sales data to CEO Dashboard:', err);
    });
    
    onSubmit(form);
  };
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product">Product</Label>
              <Select onValueChange={handleSelectProduct} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryData.map((item) => (
                    <SelectItem key={item.id} value={item.product}>
                      {item.product} ({item.remaining} {item.unit} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantity (Bunches)</Label>
              <Input 
                id="quantity" 
                name="quantity" 
                type="number" 
                value={form.quantity} 
                onChange={handleInputChange} 
                min="1" 
                max={selectedProduct?.remaining} 
                required 
              />
              {selectedProduct && (
                <p className="text-xs text-gray-500 mt-1">
                  Available: {selectedProduct.remaining} {selectedProduct.unit}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="unitPrice">Unit Price (UGX)</Label>
              <Input 
                id="unitPrice" 
                name="unitPrice" 
                type="number" 
                value={form.unitPrice} 
                onChange={handleInputChange} 
                min="1000" 
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="customer">Customer Name</Label>
              <Input 
                id="customer" 
                name="customer" 
                value={form.customer} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : 'Record Sale'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RecordSaleForm;
