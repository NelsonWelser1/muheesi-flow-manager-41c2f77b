
import React from 'react';
import CustomerInvoiceForm from '../invoices/CustomerInvoiceForm';

// This is a wrapper component to maintain backward compatibility
export default function CustomerInvoiceFormWrapper({ onBack }) {
  return <CustomerInvoiceForm onBack={onBack} />;
}
