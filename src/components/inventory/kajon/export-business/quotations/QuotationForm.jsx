import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Barcode from 'react-barcode';
import { supabase } from '@/integrations/supabase';

const QuotationForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    quoteNumber: '',
    customerName: '',
    coffeeGrade: '',
    quantity: '',
    unitPrice: '',
    totalAmount: '',
    terms: '',
    validity: '',
    deliveryTerms: '',
    paymentTerms: '',
  });

  const generateQuoteNumber = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `QT-${timestamp}-${random}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'quantity' || name === 'unitPrice' ? {
        totalAmount: calculateTotal(
          name === 'quantity' ? value : prev.quantity,
          name === 'unitPrice' ? value : prev.unitPrice
        )
      } : {})
    }));
  };

  const calculateTotal = (quantity, price) => {
    const total = parseFloat(quantity) * parseFloat(price);
    return isNaN(total) ? '' : total.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const quoteNumber = generateQuoteNumber();
      const { data, error } = await supabase
        .from('quotations')
        .insert([
          {
            ...formData,
            quoteNumber,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quotation created successfully",
      });

      // Reset form
      setFormData({
        quoteNumber: '',
        customerName: '',
        coffeeGrade: '',
        quantity: '',
        unitPrice: '',
        totalAmount: '',
        terms: '',
        validity: '',
        deliveryTerms: '',
        paymentTerms: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create quotation",
        variant: "destructive",
      });
      console.error('Error creating quotation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Customer Name</Label>
          <Input
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            placeholder="Enter customer name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Coffee Grade</Label>
          <Select
            name="coffeeGrade"
            value={formData.coffeeGrade}
            onValueChange={(value) => handleInputChange({ target: { name: 'coffeeGrade', value } })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="screen18">Screen 18</SelectItem>
              <SelectItem value="screen15">Screen 15</SelectItem>
              <SelectItem value="screen12">Screen 12</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Quantity (MT)</Label>
          <Input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="Enter quantity"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Unit Price (USD/MT)</Label>
          <Input
            type="number"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleInputChange}
            placeholder="Enter unit price"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Total Amount (USD)</Label>
          <Input
            type="text"
            name="totalAmount"
            value={formData.totalAmount}
            readOnly
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>Validity</Label>
          <Input
            type="date"
            name="validity"
            value={formData.validity}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Delivery Terms</Label>
          <Input
            name="deliveryTerms"
            value={formData.deliveryTerms}
            onChange={handleInputChange}
            placeholder="Enter delivery terms"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Payment Terms</Label>
          <Input
            name="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleInputChange}
            placeholder="Enter payment terms"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Additional Terms & Conditions</Label>
        <Input
          name="terms"
          value={formData.terms}
          onChange={handleInputChange}
          placeholder="Enter additional terms"
        />
      </div>

      {formData.quoteNumber && (
        <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
          <Barcode value={formData.quoteNumber} />
        </div>
      )}

      <Button type="submit" className="w-full">Create Quotation</Button>
    </form>
  );
};

export default QuotationForm;