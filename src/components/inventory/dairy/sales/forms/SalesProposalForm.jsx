
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Bug } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

import CustomerInfoSection from './sections/CustomerInfoSection';
import ProductsSection from './sections/ProductsSection';
import TermsConditionsSection from './sections/TermsConditionsSection';
import { useSalesProposalForm } from './hooks/useSalesProposalForm';

const SalesProposalForm = ({ onBack, onViewReports }) => {
  const { 
    form, 
    products, 
    setProducts, 
    handleProductChange,
    addProduct,
    removeProduct,
    onSubmit, 
    isSubmitting, 
    debugState 
  } = useSalesProposalForm();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales Proposal Form</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => console.log(debugState())}
              className="flex items-center gap-2"
              type="button"
            >
              <Bug className="h-4 w-4" /> Debug
            </Button>
            <Button 
              variant="outline" 
              onClick={onViewReports}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" /> View Reports
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CustomerInfoSection form={form} />
              
              <ProductsSection 
                products={products} 
                setProducts={setProducts}
                handleProductChange={handleProductChange}
                addProduct={addProduct}
                removeProduct={removeProduct}
              />
              
              <TermsConditionsSection form={form} />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Create Sales Proposal"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesProposalForm;
