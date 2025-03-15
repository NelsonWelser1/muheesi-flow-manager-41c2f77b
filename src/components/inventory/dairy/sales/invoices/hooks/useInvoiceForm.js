
import { useEffect } from 'react';
import { useInvoiceState } from './invoice/useInvoiceState';
import { useFileUpload } from './invoice/useFileUpload';
import { useInvoiceData } from './invoice/useInvoiceData';

export const useInvoiceForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    reset,
    invoiceItems,
    totalAmount,
    fileUpload,
    setFileUpload,
    filePreview,
    setFilePreview,
    isUploading,
    setIsUploading,
    showInvoiceList,
    setShowInvoiceList,
    handleAddItem,
    handleRemoveItem,
    handleItemChange
  } = useInvoiceState();

  const {
    handleFileChange,
    uploadPaymentProof
  } = useFileUpload(setFileUpload, setFilePreview, setIsUploading);

  const {
    invoices,
    isLoading,
    fetchInvoices,
    submitInvoice
  } = useInvoiceData();
  
  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);
  
  // Submit form and save to Supabase
  const onSubmit = async (data) => {
    try {
      console.log("Form data before submission:", { ...data, items: invoiceItems, totalAmount });
      
      // Upload payment proof if exists
      let paymentProofUrl = null;
      if (fileUpload) {
        paymentProofUrl = await uploadPaymentProof(fileUpload, data.invoiceNumber);
      }
      
      // Prepare invoice data
      const invoiceData = {
        id: data.invoiceNumber,
        customer_name: data.customerName,
        customer_contact: data.customerContact,
        billing_address: data.billingAddress,
        invoice_date: data.invoiceDate,
        due_date: data.dueDate,
        items: invoiceItems,
        tax: parseFloat(data.tax) || 0,
        discount: parseFloat(data.discount) || 0,
        total_amount: totalAmount,
        payment_terms: data.paymentTerms,
        payment_status: data.paymentStatus,
        payment_proof_url: paymentProofUrl,
        created_at: new Date().toISOString()
      };
      
      // Submit to Supabase
      const success = await submitInvoice(invoiceData);
      
      if (success) {
        // Reset form
        reset();
        setInvoiceItems([{ description: '', quantity: 1, price: 0, tax: 0, discount: 0, total: 0 }]);
        setFileUpload(null);
        setFilePreview('');
        
        // Refresh invoices and show the invoice list
        fetchInvoices();
        setShowInvoiceList(true);
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  return {
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
  };
};
