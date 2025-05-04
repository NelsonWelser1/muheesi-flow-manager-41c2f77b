
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Calculator } from "lucide-react";
import CalculatorForm from './CalculatorForm';
import PriceBreakdown from './PriceBreakdown';
import MarketRatesTable from './MarketRatesTable';
import SavedCalculations from './SavedCalculations';

const CoffeePriceCalculator = ({ viewOnly = false }) => {
  const [activeTab, setActiveTab] = useState('calculate');
  const [calculation, setCalculation] = useState(null);
  const { toast } = useToast();

  const handleCalculate = (calculationData) => {
    // Calculate the final price based on the input parameters
    const {
      coffeeType,
      grade,
      quantity,
      basePrice,
      processingCosts,
      transportCosts,
      certificationPremiums,
      marginPercentage,
      currency
    } = calculationData;

    // Calculate components
    const baseTotal = basePrice * quantity;
    const processingTotal = processingCosts * quantity;
    const transportTotal = transportCosts;
    const certificationTotal = certificationPremiums * quantity;
    const subtotal = baseTotal + processingTotal + transportTotal + certificationTotal;
    const margin = subtotal * (marginPercentage / 100);
    const finalPrice = subtotal + margin;
    const pricePerKg = finalPrice / quantity;

    const result = {
      ...calculationData,
      baseTotal,
      processingTotal,
      transportTotal,
      certificationTotal,
      subtotal,
      margin,
      finalPrice,
      pricePerKg,
      date: new Date().toISOString(),
    };

    setCalculation(result);
    
    toast({
      title: "Price Calculation Complete",
      description: `Final quote price: ${currency} ${finalPrice.toFixed(2)} (${currency} ${pricePerKg.toFixed(2)}/kg)`,
    });

    return result;
  };

  const handleSaveCalculation = () => {
    if (viewOnly) {
      toast({
        title: "Access Restricted",
        description: "You don't have permission to save calculations in view-only mode",
        variant: "destructive",
      });
      return;
    }

    if (!calculation) return;
    
    // Get existing saved calculations from localStorage
    const existingSaved = JSON.parse(localStorage.getItem('savedCalculations') || '[]');
    
    // Add new calculation with unique ID
    const updatedSaved = [
      {
        id: `calc-${Date.now()}`,
        ...calculation
      },
      ...existingSaved
    ];
    
    // Save back to localStorage
    localStorage.setItem('savedCalculations', JSON.stringify(updatedSaved));
    
    toast({
      title: "Calculation Saved",
      description: "Your price calculation has been saved for future reference",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Coffee Price Calculator</h2>
      <p className="text-gray-600">Calculate detailed coffee export prices based on market rates, processing costs, logistics, and desired margins.</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="calculate" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span>Calculate</span>
          </TabsTrigger>
          <TabsTrigger value="market">Market Rates</TabsTrigger>
          <TabsTrigger value="saved">Saved Calculations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculate" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <CalculatorForm onCalculate={handleCalculate} viewOnly={viewOnly} />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <PriceBreakdown 
                  calculation={calculation} 
                  onSave={handleSaveCalculation} 
                  viewOnly={viewOnly} 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="market" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <MarketRatesTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="saved" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <SavedCalculations viewOnly={viewOnly} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoffeePriceCalculator;
