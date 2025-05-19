
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import VendorSection from './form-sections/VendorSection';
import ShipToSection from './form-sections/ShipToSection';
import ProductTable from './form-sections/ProductTable';

const OrderForm = ({ company }) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [currency, setCurrency] = useState('USD');
  const [products, setProducts] = useState([{ product: '', quantity: '', price: 0 }]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // Calculate total price
  const calculateTotal = () => {
    return products.reduce((total, item) => {
      if (item.product && item.quantity && item.price) {
        return total + (parseFloat(item.quantity) * 1000 * parseFloat(item.price));
      }
      return total;
    }, 0);
  };

  const handleSubmit = () => {
    // Validation can be enhanced based on requirements
    if (products.length === 0 || !products.some(p => p.product && p.quantity)) {
      toast({
        title: "Error",
        description: "Please add at least one product",
        variant: "destructive",
      });
      return;
    }

    // Show submitting state
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      console.log(`Submitting order for ${company}:`, {
        company,
        products,
        currency,
        specialInstructions,
        total: calculateTotal()
      });
      
      // Show success message
      toast({
        title: "Order Placed",
        description: `Your order with ${company} has been submitted successfully.`,
        className: "bg-green-50 border-green-300 text-green-800",
      });
      
      // Reset form and close it
      setProducts([{ product: '', quantity: '', price: 0 }]);
      setSpecialInstructions('');
      setCurrency('USD');
      setShowForm(false);
      setIsSubmitting(false);
    }, 800);
  };

  const handleClose = () => {
    setShowForm(false);
    setProducts([{ product: '', quantity: '', price: 0 }]);
    setSpecialInstructions('');
    setCurrency('USD');
  };

  return (
    <div className="mt-3" data-select-id={`order-form-${company}`}>
      {!showForm ? (
        <Button 
          variant="outline" 
          className="w-full bg-white hover:bg-gray-100"
          onClick={() => setShowForm(true)}
        >
          Place Order
        </Button>
      ) : (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 flex items-center justify-between border-b">
              <h2 className="text-xl font-bold text-blue-600">PURCHASE ORDER</h2>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <VendorSection company={company} />
                <ShipToSection />
              </div>
              
              <div className="mb-4">
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="UGX">UGX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <ProductTable 
                company={company}
                currency={currency}
                products={products}
                onProductsChange={setProducts}
              />
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Special Instructions</label>
                  <Textarea 
                    placeholder="Enter any special instructions or notes" 
                    className="min-h-[120px]"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  />
                </div>
                <div className="flex flex-col items-end justify-between">
                  <div className="text-right mb-4">
                    <div className="font-bold">TOTAL:</div>
                    <div className="text-xl font-bold">
                      {currency} {calculateTotal().toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-auto">
                    <Button 
                      variant="outline"
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#1A1F2C] text-white hover:bg-[#292f3d]" 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Submit Order"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
