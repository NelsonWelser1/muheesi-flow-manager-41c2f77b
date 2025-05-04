
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save, FileText, Download } from "lucide-react";
import { format } from 'date-fns';

const PriceBreakdown = ({ calculation, onSave, viewOnly }) => {
  if (!calculation) {
    return (
      <div className="h-full flex items-center justify-center p-12 text-center">
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-500">No calculation performed yet</p>
          <p className="text-sm text-gray-400">Fill in the parameters and click Calculate</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: calculation.currency
    }).format(value);
  };

  const getCertificationName = () => {
    if (calculation.certification === 'none') return 'None';
    
    const certMap = {
      'organic': 'Organic',
      'fairtrade': 'Fair Trade',
      'rainforest': 'Rainforest Alliance',
      'utz': 'UTZ Certified',
      '4c': '4C Certification'
    };
    
    return certMap[calculation.certification] || calculation.certification;
  };

  const handleExport = () => {
    // Create a text representation of the calculation
    const exportContent = `
COFFEE PRICE CALCULATION
------------------------
Date: ${format(new Date(calculation.date), 'PPpp')}

PARAMETERS:
Coffee Type: ${calculation.coffeeType === 'arabica' ? 'Arabica' : 'Robusta'}
Grade: ${calculation.grade.toUpperCase()}
Quantity: ${calculation.quantity.toLocaleString()} kg
Certification: ${getCertificationName()}

COSTS (${calculation.currency}):
Base Price: ${formatCurrency(calculation.basePrice)}/kg (Total: ${formatCurrency(calculation.baseTotal)})
Processing: ${formatCurrency(calculation.processingCosts)}/kg (Total: ${formatCurrency(calculation.processingTotal)})
Transport/Logistics: ${formatCurrency(calculation.transportCosts)} (Flat rate)
Certification Premium: ${formatCurrency(calculation.certificationPremiums)}/kg (Total: ${formatCurrency(calculation.certificationTotal)})

CALCULATION:
Subtotal: ${formatCurrency(calculation.subtotal)}
Margin (${calculation.marginPercentage}%): ${formatCurrency(calculation.margin)}
FINAL PRICE: ${formatCurrency(calculation.finalPrice)}
Price per kg: ${formatCurrency(calculation.pricePerKg)}

KAJON Coffee Limited
Export Price Calculator
    `;
    
    // Create a blob and download
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coffee-price-calculation-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Price Breakdown</h3>
        <div className="space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          
          <Button 
            size="sm"
            onClick={onSave}
            disabled={viewOnly}
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center py-1 border-b">
          <span className="text-gray-600">Coffee Type:</span>
          <span className="font-medium">{calculation.coffeeType === 'arabica' ? 'Arabica' : 'Robusta'}</span>
        </div>
        
        <div className="flex justify-between items-center py-1 border-b">
          <span className="text-gray-600">Grade:</span>
          <span className="font-medium">{calculation.grade.toUpperCase()}</span>
        </div>
        
        <div className="flex justify-between items-center py-1 border-b">
          <span className="text-gray-600">Quantity:</span>
          <span className="font-medium">{calculation.quantity.toLocaleString()} kg</span>
        </div>
        
        <div className="flex justify-between items-center py-1 border-b">
          <span className="text-gray-600">Certification:</span>
          <span className="font-medium">{getCertificationName()}</span>
        </div>
        
        <div className="pt-2 font-medium">Cost Components ({calculation.currency}):</div>
        
        <div className="flex justify-between items-center py-1 pl-4 border-b">
          <span className="text-gray-600">Base Price:</span>
          <div className="text-right">
            <div>{formatCurrency(calculation.basePrice)}/kg</div>
            <div className="text-sm text-gray-500">Total: {formatCurrency(calculation.baseTotal)}</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-1 pl-4 border-b">
          <span className="text-gray-600">Processing:</span>
          <div className="text-right">
            <div>{formatCurrency(calculation.processingCosts)}/kg</div>
            <div className="text-sm text-gray-500">Total: {formatCurrency(calculation.processingTotal)}</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-1 pl-4 border-b">
          <span className="text-gray-600">Transport/Logistics:</span>
          <div>{formatCurrency(calculation.transportCosts)}</div>
        </div>
        
        {calculation.certificationPremiums > 0 && (
          <div className="flex justify-between items-center py-1 pl-4 border-b">
            <span className="text-gray-600">Certification Premium:</span>
            <div className="text-right">
              <div>{formatCurrency(calculation.certificationPremiums)}/kg</div>
              <div className="text-sm text-gray-500">Total: {formatCurrency(calculation.certificationTotal)}</div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center py-1 border-b">
          <span className="text-gray-600 font-medium">Subtotal:</span>
          <span className="font-medium">{formatCurrency(calculation.subtotal)}</span>
        </div>
        
        <div className="flex justify-between items-center py-1 border-b">
          <span className="text-gray-600">Margin ({calculation.marginPercentage}%):</span>
          <span>{formatCurrency(calculation.margin)}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 mt-2 border-t-2 border-b-2 border-gray-400">
          <span className="text-lg font-bold">Final Price:</span>
          <span className="text-lg font-bold">{formatCurrency(calculation.finalPrice)}</span>
        </div>
        
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-600">Price per kg:</span>
          <span className="font-semibold">{formatCurrency(calculation.pricePerKg)}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;
