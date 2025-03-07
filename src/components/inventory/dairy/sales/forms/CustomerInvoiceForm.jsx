
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CustomerInvoiceFormFields from './components/CustomerInvoiceFormFields';
import CustomerInvoiceFormActions from './components/CustomerInvoiceFormActions';
import { useCustomerInvoiceForm } from './hooks/useCustomerInvoiceForm';

const CustomerInvoiceForm = ({ onBack }) => {
  const { 
    register, 
    handleSubmit, 
    setValue, 
    errors, 
    onSubmit,
    generateInvoiceNumber,
    invoiceStatus
  } = useCustomerInvoiceForm();

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Customer Invoice Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <CustomerInvoiceFormFields 
              register={register}
              errors={errors}
              setValue={setValue}
              generateInvoiceNumber={generateInvoiceNumber}
            />
            <CustomerInvoiceFormActions status={invoiceStatus} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerInvoiceForm;
