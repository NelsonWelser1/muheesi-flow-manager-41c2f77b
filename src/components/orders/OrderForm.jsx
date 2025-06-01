
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import VendorSection from './form-sections/VendorSection';
import ShipToSection from './form-sections/ShipToSection';
import ProductTable from './form-sections/ProductTable';

const OrderForm = ({ company, onClose }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(company || '');
  const [currency, setCurrency] = useState('USD');
  const [products, setProducts] = useState([{ product: '', quantity: '', price: 0 }]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const companies = [
    'Grand Berna Dairies',
    'KAJON Coffee Limited', 
    'Kyalima Farmers Limited'
  ];

  const calculateTotal = () => {
    return products.reduce((total, item) => {
      if (item.product && item.quantity && item.price) {
        // Convert tons to kg (1 ton = 1000 kg) and multiply by price per kg
        return total + (item.price * (parseFloat(item.quantity) * 1000));
      }
      return total;
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order submitted:', {
      company: selectedCompany,
      currency,
      products,
      specialInstructions,
      total: calculateTotal()
    });
    setShowForm(false);
  };

  return (
    <div className="mt-3" data-select-id={`order-form-${company}`}>
      {!showForm ? (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowForm(true)}
        >
          Place Order
        </Button>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-600">PURCHASE ORDER</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Company Selection */}
              <div className="space-y-2">
                <Label htmlFor="company">Select Company</Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(comp => (
                      <SelectItem key={comp} value={comp}>
                        {comp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vendor and Ship To Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VendorSection selectedCompany={selectedCompany} />
                <ShipToSection />
              </div>

              {/* Currency Selection */}
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="UGX">UGX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Product Table */}
              <div className="space-y-2">
                <Label>Products</Label>
                <ProductTable 
                  company={selectedCompany}
                  currency={currency}
                  products={products}
                  onProductsChange={setProducts}
                />
              </div>

              {/* Special Instructions */}
              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Enter any special instructions or notes"
                  className="min-h-[100px]"
                />
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-sm text-gray-600">TOTAL:</div>
                  <div className="text-2xl font-bold">
                    {currency} {calculateTotal().toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
