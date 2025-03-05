
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import SalesProposalsDisplay from './displays/SalesProposalsDisplay';
import CustomerInfoSection from './sections/CustomerInfoSection';
import ProductSelectionSection from './sections/ProductSelectionSection';
import SelectedProductsSection from './sections/SelectedProductsSection';
import TermsSection from './sections/TermsSection';
import { useSalesProposalForm } from './hooks/useSalesProposalForm';

const SalesProposalForm = ({ onBack }) => {
  const [showDisplay, setShowDisplay] = useState(false);
  
  const {
    register,
    handleSubmit,
    errors,
    loading,
    submitting,
    products,
    selectedProducts,
    currency,
    setCurrency,
    proposalId,
    handleProductSelect,
    handlePriceChange,
    handleAddProduct,
    removeProduct,
    onSubmit,
    calculateGrandTotal,
    formatCurrency,
  } = useSalesProposalForm();

  if (showDisplay) {
    return <SalesProposalsDisplay onBack={() => setShowDisplay(false)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">New Sales Proposal/Quotation</h2>
        <Button 
          variant="outline"
          onClick={() => setShowDisplay(true)}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" /> View Proposals
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>New Sales Proposal/Quotation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CustomerInfoSection
              register={register}
              errors={errors}
              proposalId={proposalId}
              currency={currency}
              setCurrency={setCurrency}
            />
            
            <ProductSelectionSection
              register={register}
              loading={loading}
              products={products}
              handleProductSelect={handleProductSelect}
              handlePriceChange={handlePriceChange}
              handleAddProduct={handleAddProduct}
            />
            
            <SelectedProductsSection
              selectedProducts={selectedProducts}
              formatCurrency={formatCurrency}
              calculateGrandTotal={calculateGrandTotal}
              removeProduct={removeProduct}
            />
            
            <TermsSection register={register} />
            
            <div className="flex space-x-4 justify-end">
              <Button 
                type="button" 
                variant="outline"
                onClick={onBack}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Submit Proposal'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesProposalForm;
