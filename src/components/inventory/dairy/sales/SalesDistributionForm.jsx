
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import QRCodeGenerator from '../qr/QRCodeGenerator';
import { formatCurrency } from './distribution/utils/formatters';

// Custom hooks
import { useBatchEntries } from './distribution/hooks/useBatchEntries';
import { useSalesForm } from './distribution/hooks/useSalesForm';
import { usePricingCalculations } from './distribution/hooks/usePricingCalculations';

// Component imports
import BatchSelector from './distribution/components/BatchSelector';
import CustomerInfoFields from './distribution/components/CustomerInfoFields';
import ProductFields from './distribution/components/ProductFields';
import PricingFields from './distribution/components/PricingFields';
import LogisticsFields from './distribution/components/LogisticsFields';
import CurrencySelector from './distribution/components/CurrencySelector';
import FormActions from './distribution/components/FormActions';

// Make batchEntries available globally for the batch selector
window.batchEntries = [];

const SalesDistributionForm = ({ onBack }) => {
  const [showQR, setShowQR] = useState(false);
  
  // Fetch batch entries using custom hook
  const { batchEntries, loading, fetchBatchEntries } = useBatchEntries();
  
  // Store batchEntries in window for the batch selector to access
  window.batchEntries = batchEntries;
  
  // Form state and handlers
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formData,
    quantity,
    pricePerUnit,
    currency,
    setCurrency,
    batchSelected,
    handleBatchSelect,
    handleFormSubmit
  } = useSalesForm(fetchBatchEntries);
  
  // Price calculations
  const { handlePricePerUnitChange } = usePricingCalculations({
    quantity,
    pricePerUnit,
    currency,
    setValue,
    getValues
  });

  if (showQR) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setShowQR(false)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Form
        </Button>
        <QRCodeGenerator 
          data={formData} 
          title="Sales Distribution"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Sales & Marketing
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Sales & Distribution Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Customer Information */}
              <CustomerInfoFields register={register} />
              
              {/* Batch Selection */}
              <BatchSelector 
                batchEntries={batchEntries} 
                loading={loading} 
                handleBatchSelect={handleBatchSelect}
                register={register}
              />
              
              {/* Product Information */}
              <ProductFields 
                register={register} 
                batchSelected={batchSelected} 
              />
              
              {/* Currency Selection */}
              <CurrencySelector 
                currency={currency} 
                setCurrency={setCurrency} 
              />
              
              {/* Pricing Information */}
              <PricingFields 
                register={register}
                handlePricePerUnitChange={handlePricePerUnitChange}
                currency={currency}
              />
              
              {/* Logistics Information */}
              <LogisticsFields register={register} />
            </div>

            {/* Form Actions */}
            <FormActions setShowQR={setShowQR} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDistributionForm;
