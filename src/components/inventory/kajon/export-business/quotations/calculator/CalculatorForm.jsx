
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Calculator, Percent } from "lucide-react";

const COFFEE_TYPES = [
  { value: 'arabica', label: 'Arabica' },
  { value: 'robusta', label: 'Robusta' },
];

const COFFEE_GRADES = {
  arabica: [
    { value: 'aa', label: 'AA (Screen 18+)' },
    { value: 'a', label: 'A (Screen 16/17)' },
    { value: 'pb', label: 'PB (Peaberry)' },
    { value: 'b', label: 'B (Screen 15 and below)' },
    { value: 'specialty', label: 'Specialty (SCA 85+)' },
    { value: 'organic', label: 'Organic Certified' },
  ],
  robusta: [
    { value: 'screen18', label: 'Screen 18' },
    { value: 'screen15', label: 'Screen 15' },
    { value: 'screen12', label: 'Screen 12' },
    { value: 'organic', label: 'Organic Certified' },
    { value: 'faq', label: 'FAQ (Fair Average Quality)' },
  ]
};

const CERTIFICATIONS = [
  { value: 'none', label: 'None', premium: 0 },
  { value: 'organic', label: 'Organic', premium: 0.45 },
  { value: 'fairtrade', label: 'Fair Trade', premium: 0.35 },
  { value: 'rainforest', label: 'Rainforest Alliance', premium: 0.30 },
  { value: 'utz', label: 'UTZ Certified', premium: 0.28 },
  { value: '4c', label: '4C Certification', premium: 0.20 },
];

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
];

const DEFAULT_VALUES = {
  arabica: {
    aa: 4.20,
    a: 3.80,
    pb: 3.90,
    b: 3.40,
    specialty: 5.50,
    organic: 4.80,
  },
  robusta: {
    screen18: 2.70,
    screen15: 2.40,
    screen12: 2.20,
    organic: 3.20,
    faq: 2.00,
  }
};

const CalculatorForm = ({ onCalculate, viewOnly }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    coffeeType: 'arabica',
    grade: 'aa',
    quantity: 1000,
    basePrice: DEFAULT_VALUES.arabica.aa,
    processingCosts: 0.35,
    transportCosts: 2500,
    certification: 'none',
    certificationPremiums: 0,
    marginPercentage: 15,
    currency: 'USD',
  });

  const handleChange = (field, value) => {
    let updatedData = { ...formData, [field]: value };
    
    // Update base price when coffee type or grade changes
    if (field === 'coffeeType' || field === 'grade') {
      if (field === 'coffeeType') {
        // Reset grade when coffee type changes
        const firstGrade = Object.keys(COFFEE_GRADES[value])[0];
        updatedData.grade = firstGrade;
        updatedData.basePrice = DEFAULT_VALUES[value][firstGrade];
      } else {
        // Update base price when grade changes
        updatedData.basePrice = DEFAULT_VALUES[updatedData.coffeeType][value];
      }
    }
    
    // Update certification premium
    if (field === 'certification') {
      const selectedCert = CERTIFICATIONS.find(cert => cert.value === value);
      updatedData.certificationPremiums = selectedCert ? selectedCert.premium : 0;
    }
    
    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (viewOnly) {
      toast({
        title: "View Only Mode",
        description: "Price calculations are available but saving is restricted",
        variant: "warning",
      });
    }
    onCalculate(formData);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Input Parameters</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="coffeeType">Coffee Type</Label>
            <Select 
              value={formData.coffeeType} 
              onValueChange={(value) => handleChange('coffeeType', value)}
              disabled={viewOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select coffee type" />
              </SelectTrigger>
              <SelectContent>
                {COFFEE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grade">Coffee Grade</Label>
            <Select 
              value={formData.grade} 
              onValueChange={(value) => handleChange('grade', value)}
              disabled={viewOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select coffee grade" />
              </SelectTrigger>
              <SelectContent>
                {COFFEE_GRADES[formData.coffeeType].map(grade => (
                  <SelectItem key={grade.value} value={grade.value}>
                    {grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (kg)</Label>
            <Input 
              id="quantity" 
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', parseFloat(e.target.value))}
              min="1"
              required
              disabled={viewOnly}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="basePrice">Base Price per kg</Label>
            <div className="relative">
              <Input 
                id="basePrice" 
                type="number"
                value={formData.basePrice}
                onChange={(e) => handleChange('basePrice', parseFloat(e.target.value))}
                min="0.01"
                step="0.01"
                required
                disabled={viewOnly}
                className="pl-8"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                {formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : '£'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="processingCosts">Processing Costs per kg</Label>
            <div className="relative">
              <Input 
                id="processingCosts" 
                type="number"
                value={formData.processingCosts}
                onChange={(e) => handleChange('processingCosts', parseFloat(e.target.value))}
                min="0"
                step="0.01"
                required
                disabled={viewOnly}
                className="pl-8"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                {formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : '£'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transportCosts">Transport/Logistics Costs</Label>
            <div className="relative">
              <Input 
                id="transportCosts" 
                type="number"
                value={formData.transportCosts}
                onChange={(e) => handleChange('transportCosts', parseFloat(e.target.value))}
                min="0"
                step="0.01"
                required
                disabled={viewOnly}
                className="pl-8"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                {formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : '£'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="certification">Certification</Label>
            <Select 
              value={formData.certification} 
              onValueChange={(value) => handleChange('certification', value)}
              disabled={viewOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select certification" />
              </SelectTrigger>
              <SelectContent>
                {CERTIFICATIONS.map(cert => (
                  <SelectItem key={cert.value} value={cert.value}>
                    {cert.label} {cert.premium > 0 && `(+$${cert.premium.toFixed(2)}/kg)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="marginPercentage">Margin Percentage</Label>
            <div className="relative">
              <Input 
                id="marginPercentage" 
                type="number"
                value={formData.marginPercentage}
                onChange={(e) => handleChange('marginPercentage', parseFloat(e.target.value))}
                min="0"
                max="100"
                step="0.1"
                required
                disabled={viewOnly}
                className="pr-8"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Percent className="h-4 w-4" />
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select 
              value={formData.currency} 
              onValueChange={(value) => handleChange('currency', value)}
              disabled={viewOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map(currency => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-4"
          disabled={viewOnly && false} // Allow calculation in view mode, but not saving
        >
          <Calculator className="h-4 w-4 mr-2" />
          Calculate Price
        </Button>
      </form>
    </div>
  );
};

export default CalculatorForm;
