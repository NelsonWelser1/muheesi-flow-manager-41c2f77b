
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { ArrowLeft, FileText } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

import CustomerInfoSection from './sections/CustomerInfoSection';
import ProductsSection from './sections/ProductsSection';
import TermsConditionsSection from './sections/TermsConditionsSection';

const SalesProposalForm = ({ onBack, onViewReports }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([{ name: '', description: '', quantity: '1', price: '', total: '0' }]);

  const form = useForm({
    defaultValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      proposal_date: new Date().toISOString().split('T')[0],
      validity_period: '30',
      terms_conditions: 'Payment due within 30 days of invoice date.\nPrices are subject to change based on market conditions.\nDelivery will be arranged upon confirmation of order.',
      grand_total: '0'
    }
  });

  const updateGrandTotal = (productsList) => {
    const total = productsList.reduce((sum, product) => {
      return sum + (parseFloat(product.total) || 0);
    }, 0);
    
    form.setValue('grand_total', total.toFixed(2));
  };

  const onSubmit = async (data) => {
    if (products.some(product => !product.name || !product.price)) {
      showErrorToast(toast, "Please fill in all required product fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const proposalId = `PRO-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      const formattedData = {
        proposal_id: proposalId,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        proposal_date: data.proposal_date,
        validity_period: parseInt(data.validity_period),
        terms_conditions: data.terms_conditions,
        products: products,
        grand_total: data.grand_total,
        status: 'draft',
        created_at: new Date().toISOString(),
        created_by: userData?.user?.id || null
      };

      const { error } = await supabase
        .from('sales_proposals')
        .insert([formattedData]);

      if (error) throw error;

      showSuccessToast(toast, "Sales proposal created successfully");

      form.reset({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        proposal_date: new Date().toISOString().split('T')[0],
        validity_period: '30',
        terms_conditions: 'Payment due within 30 days of invoice date.\nPrices are subject to change based on market conditions.\nDelivery will be arranged upon confirmation of order.',
        grand_total: '0'
      });
      setProducts([{ name: '', description: '', quantity: '1', price: '', total: '0' }]);
    } catch (error) {
      console.error('Error creating sales proposal:', error);
      showErrorToast(toast, "Failed to create sales proposal: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales Proposal Form</CardTitle>
          <Button 
            variant="outline" 
            onClick={onViewReports}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" /> View Reports
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CustomerInfoSection form={form} />
              
              <ProductsSection 
                products={products} 
                setProducts={setProducts} 
                updateGrandTotal={updateGrandTotal} 
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
