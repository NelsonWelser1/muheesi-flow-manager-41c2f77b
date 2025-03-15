
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const useInvoiceState = () => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      paymentStatus: 'pending',
      paymentTerms: 'bank_transfer'
    }
  });
  
  const [invoiceItems, setInvoiceItems] = useState([
    { description: '', quantity: 1, price: 0, tax: 0, discount: 0, total: 0 }
  ]);
  
  const [totalAmount, setTotalAmount] = useState(0);
  const [fileUpload, setFileUpload] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showInvoiceList, setShowInvoiceList] = useState(false);
  
  // Auto-calculate totals when invoice items change
  useEffect(() => {
    let sum = 0;
    const updatedItems = invoiceItems.map(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      const discount = parseFloat(item.discount) || 0;
      const tax = parseFloat(item.tax) || 0;
      
      // Calculate item total: (price * quantity - discount) * (1 + tax/100)
      const baseAmount = price * quantity;
      const afterDiscount = baseAmount - discount;
      const withTax = afterDiscount * (1 + tax/100);
      const total = Math.round(withTax * 100) / 100; // Round to 2 decimal places
      
      sum += total;
      return { ...item, total };
    });
    
    setInvoiceItems(updatedItems);
    setTotalAmount(Math.round(sum * 100) / 100); // Round to 2 decimal places
  }, [invoiceItems]);

  // Invoice item management functions
  const handleAddItem = () => {
    setInvoiceItems([
      ...invoiceItems, 
      { description: '', quantity: 1, price: 0, tax: 0, discount: 0, total: 0 }
    ]);
  };
  
  const handleRemoveItem = (index) => {
    if (invoiceItems.length === 1) {
      return;
    }
    
    const newItems = [...invoiceItems];
    newItems.splice(index, 1);
    setInvoiceItems(newItems);
  };
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceItems];
    newItems[index][field] = value;
    setInvoiceItems(newItems);
  };

  return {
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
  };
};
