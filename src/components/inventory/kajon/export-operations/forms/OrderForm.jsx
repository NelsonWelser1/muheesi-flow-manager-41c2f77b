
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, Plus, Trash2 } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

const OrderForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    client: "",
    contactPerson: "",
    email: "",
    phone: "",
    orderDate: "",
    deliveryDate: "",
    paymentTerms: "30days",
    currency: "usd",
    notes: "",
    items: [
      { id: 1, product: "", grade: "", quantity: "", unit: "mt", pricePerUnit: "", total: 0 }
    ]
  });
  
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
  
  const handleItemChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { 
          ...item, 
          [field]: value,
          total: field === 'quantity' || field === 'pricePerUnit' ? 
            calculateItemTotal(
              field === 'quantity' ? value : item.quantity, 
              field === 'pricePerUnit' ? value : item.pricePerUnit
            ) : item.total
        } : item
      )
    }));
  };
  
  const calculateItemTotal = (quantity, price) => {
    const qtyNum = parseFloat(quantity) || 0;
    const priceNum = parseFloat(price) || 0;
    return qtyNum * priceNum;
  };
  
  const addItem = () => {
    const newId = formData.items.length > 0 ? Math.max(...formData.items.map(i => i.id)) + 1 : 1;
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items, 
        { id: newId, product: "", grade: "", quantity: "", unit: "mt", pricePerUnit: "", total: 0 }
      ]
    }));
  };
  
  const removeItem = (id) => {
    if (formData.items.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };
  
  const calculateOrderTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  };
  
  const coffeeSources = ["Kazo Coffee Project", "External Suppliers", "Local Cooperatives", "Direct Farm Purchase"];
  const coffeeProducts = ["Arabica AA", "Arabica A", "Arabica AB", "Robusta Grade 1", "Robusta Grade 2", "Robusta Peaberry", "Washed Arabica"];
  const coffeeGrades = ["Screen 18", "Screen 15", "Screen 12", "Premium", "Standard", "Specialty Grade 1", "Specialty Grade 2"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">New Export Order</CardTitle>
            <CardDescription>
              Create a new international coffee export order
            </CardDescription>
          </div>
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Client Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Client Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client Name</Label>
              <Input 
                id="client" 
                name="client" 
                value={formData.client}
                onChange={handleInputChange}
                placeholder="Enter client name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input 
                id="contactPerson" 
                name="contactPerson" 
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="Enter contact person name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Order Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderDate">Order Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="orderDate" 
                  name="orderDate" 
                  type="date"
                  value={formData.orderDate}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Required Delivery Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="deliveryDate" 
                  name="deliveryDate" 
                  type="date"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select 
                value={formData.paymentTerms}
                onValueChange={(value) => handleSelectChange("paymentTerms", value)}
              >
                <SelectTrigger id="paymentTerms">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="advance">Advance Payment</SelectItem>
                  <SelectItem value="lc">Letter of Credit</SelectItem>
                  <SelectItem value="30days">Net 30 Days</SelectItem>
                  <SelectItem value="60days">Net 60 Days</SelectItem>
                  <SelectItem value="90days">Net 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleSelectChange("currency", value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coffeeSource">Coffee Source</Label>
              <Select defaultValue="kazo">
                <SelectTrigger id="coffeeSource">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {coffeeSources.map((source, index) => (
                    <SelectItem key={index} value={source.toLowerCase().replace(/\s+/g, '-')}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Order Items</h3>
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          {formData.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-end border-b pb-4 last:border-0">
              <div className="col-span-12 md:col-span-3 space-y-2">
                <Label htmlFor={`product-${item.id}`}>Coffee Product</Label>
                <Select
                  value={item.product}
                  onValueChange={(value) => handleItemChange(item.id, "product", value)}
                >
                  <SelectTrigger id={`product-${item.id}`}>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {coffeeProducts.map((product, idx) => (
                      <SelectItem key={idx} value={product.toLowerCase().replace(/\s+/g, '-')}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-12 md:col-span-2 space-y-2">
                <Label htmlFor={`grade-${item.id}`}>Grade</Label>
                <Select
                  value={item.grade}
                  onValueChange={(value) => handleItemChange(item.id, "grade", value)}
                >
                  <SelectTrigger id={`grade-${item.id}`}>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {coffeeGrades.map((grade, idx) => (
                      <SelectItem key={idx} value={grade.toLowerCase().replace(/\s+/g, '-')}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-6 md:col-span-2 space-y-2">
                <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                <Input 
                  id={`quantity-${item.id}`}
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                  placeholder="Enter quantity"
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div className="col-span-6 md:col-span-1 space-y-2">
                <Label htmlFor={`unit-${item.id}`}>Unit</Label>
                <Select
                  value={item.unit}
                  onValueChange={(value) => handleItemChange(item.id, "unit", value)}
                >
                  <SelectTrigger id={`unit-${item.id}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">KG</SelectItem>
                    <SelectItem value="mt">MT</SelectItem>
                    <SelectItem value="lb">LB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-6 md:col-span-2 space-y-2">
                <Label htmlFor={`price-${item.id}`}>Price Per Unit</Label>
                <Input 
                  id={`price-${item.id}`}
                  type="number"
                  value={item.pricePerUnit}
                  onChange={(e) => handleItemChange(item.id, "pricePerUnit", e.target.value)}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="col-span-4 md:col-span-1 space-y-2">
                <Label>Total</Label>
                <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center">
                  {(item.total || 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>
              
              <div className="col-span-2 md:col-span-1 flex items-center justify-end h-10">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  disabled={formData.items.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end">
            <div className="w-full md:w-1/3 space-y-2">
              <div className="flex justify-between py-2">
                <span className="font-medium">Subtotal:</span>
                <span>
                  {calculateOrderTotal().toLocaleString('en-US', {
                    style: 'currency',
                    currency: formData.currency === 'eur' ? 'EUR' : formData.currency === 'gbp' ? 'GBP' : 'USD'
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span className="font-bold">Order Total:</span>
                <span className="font-bold">
                  {calculateOrderTotal().toLocaleString('en-US', {
                    style: 'currency',
                    currency: formData.currency === 'eur' ? 'EUR' : formData.currency === 'gbp' ? 'GBP' : 'USD'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Enter any additional order notes or special requirements"
            rows={4}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-4 border-t pt-6">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Order</Button>
      </CardFooter>
    </Card>
  );
};

export default OrderForm;
