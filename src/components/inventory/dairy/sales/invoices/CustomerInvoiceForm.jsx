
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoiceForm } from './hooks/useInvoiceForm';
import InvoiceHeader from './components/InvoiceHeader';
import CustomerDetailsSection from './components/CustomerDetailsSection';
import InvoiceItemsSection from './components/InvoiceItemsSection';
import PaymentDetailsSection from './components/PaymentDetailsSection';
import TotalAmountSection from './components/TotalAmountSection';
import FileUploadSection from './components/FileUploadSection';
import FormActions from './components/FormActions';
import CustomerInvoiceList from './CustomerInvoiceList';

const CustomerInvoiceForm = ({ onBack }) => {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    invoiceItems,
    totalAmount,
    filePreview,
    isUploading,
    showInvoiceList,
    invoices,
    isLoading,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleFileChange,
    onSubmit,
    setShowInvoiceList,
    fetchInvoices
  } = useInvoiceForm();

  return (
    <div className="space-y-4">
      <InvoiceHeader 
        onBack={onBack}
        onViewInvoices={() => setShowInvoiceList(true)}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Invoice Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <CustomerDetailsSection 
              register={register} 
              errors={errors} 
              setValue={setValue} 
            />

            <InvoiceItemsSection 
              invoiceItems={invoiceItems}
              handleAddItem={handleAddItem}
              handleItemChange={handleItemChange}
              handleRemoveItem={handleRemoveItem}
            />

            <PaymentDetailsSection register={register} errors={errors} setValue={setValue} />

            <TotalAmountSection totalAmount={totalAmount} />

            <FileUploadSection 
              filePreview={filePreview}
              handleFileChange={handleFileChange}
            />

            <FormActions 
              isUploading={isUploading}
              onAttachFile={() => {
                document.querySelector('input[type="file"]').click();
              }}
            />
          </form>
        </CardContent>
      </Card>
      
      <CustomerInvoiceList
        isOpen={showInvoiceList} 
        onClose={() => setShowInvoiceList(false)}
        invoices={invoices}
        isLoading={isLoading}
        onRefresh={fetchInvoices}
      />
    </div>
  );
};

export default CustomerInvoiceForm;
