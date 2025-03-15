
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

export const useInvoiceForm = () => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      paymentStatus: 'pending',
      paymentTerms: 'bank_transfer'
    }
  });
  
  const { toast } = useToast();
  const [showInvoiceList, setShowInvoiceList] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([
    { description: '', quantity: 1, price: 0, tax: 0, discount: 0, total: 0 }
  ]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [fileUpload, setFileUpload] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch invoices on component mount and get the next invoice number
  useEffect(() => {
    fetchInvoices();
  }, []);
  
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
  
  // Fetch invoices from Supabase
  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching invoices from Supabase...');
      
      const { data, error } = await supabase
        .from('customer_invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching invoices:', error);
        toast({
          title: "Error",
          description: `Failed to fetch invoices: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      console.log('Invoices fetched successfully:', data);
      setInvoices(data || []);
    } catch (err) {
      console.error('Unexpected error fetching invoices:', err);
      toast({
        title: "Error",
        description: `Unexpected error: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle adding a new item row
  const handleAddItem = () => {
    setInvoiceItems([
      ...invoiceItems, 
      { description: '', quantity: 1, price: 0, tax: 0, discount: 0, total: 0 }
    ]);
  };
  
  // Handle removing an item row
  const handleRemoveItem = (index) => {
    if (invoiceItems.length === 1) {
      toast({
        title: "Cannot remove",
        description: "At least one item is required",
        variant: "destructive"
      });
      return;
    }
    
    const newItems = [...invoiceItems];
    newItems.splice(index, 1);
    setInvoiceItems(newItems);
  };
  
  // Handle changes to item fields
  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceItems];
    newItems[index][field] = value;
    setInvoiceItems(newItems);
  };
  
  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload JPG, PNG, or PDF files only",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setFileUpload(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(file.name); // Just show the filename for PDFs
    }
  };
  
  // Upload file to Supabase
  const uploadPaymentProof = async (file, invoiceId) => {
    if (!file) return null;
    
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${invoiceId}-payment-proof.${fileExt}`;
      const filePath = `payment-proofs/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('invoices')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      const { data: publicURL } = supabase.storage
        .from('invoices')
        .getPublicUrl(filePath);
      
      return publicURL.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "File upload failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
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
      
      console.log("Invoice data to be saved to Supabase:", invoiceData);
      
      // Save to Supabase
      const { data: savedInvoice, error } = await supabase
        .from('customer_invoices')
        .insert([invoiceData])
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log("Invoice saved successfully:", savedInvoice);
      
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      
      // Reset form
      reset();
      setInvoiceItems([{ description: '', quantity: 1, price: 0, tax: 0, discount: 0, total: 0 }]);
      setFileUpload(null);
      setFilePreview('');
      
      // Refresh invoices
      fetchInvoices();
      
      // Show the invoice list after creation
      setShowInvoiceList(true);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: `Failed to create invoice: ${error.message}`,
        variant: "destructive"
      });
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
