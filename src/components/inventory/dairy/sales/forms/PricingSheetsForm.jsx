
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Bug, FileText } from "lucide-react";
import { PricingSheetsDisplay } from './displays/PricingSheetsDisplay';
import { usePricingSheetsForm } from './hooks/usePricingSheetsForm';
import PricingSheetBasicInfoSection from './sections/PricingSheetBasicInfoSection';
import ProductsSection from './sections/ProductsSection';

const PricingSheetsForm = ({ onBack }) => {
  const [showDisplay, setShowDisplay] = useState(false);
  const { 
    form, 
    products, 
    setProducts, 
    isSubmitting, 
    handleDebug, 
    onSubmit 
  } = usePricingSheetsForm();

  if (showDisplay) {
    return <PricingSheetsDisplay onBack={() => setShowDisplay(false)} />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pricing Sheets Form</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleDebug}
              className="flex items-center gap-2"
            >
              <Bug className="h-4 w-4" /> Debug Form
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowDisplay(true)}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" /> View Reports
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PricingSheetBasicInfoSection form={form} />
              
              <ProductsSection 
                products={products} 
                setProducts={setProducts} 
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Create Pricing Sheet"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingSheetsForm;
