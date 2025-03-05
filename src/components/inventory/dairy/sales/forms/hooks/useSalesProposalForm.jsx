
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";

export const useSalesProposalForm = () => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [proposalId, setProposalId] = useState('');
  const [currency, setCurrency] = useState('UGX');

  // Watch for changes to calculate totals
  const productQty = watch('product_quantity') || 0;
  const productPrice = watch('product_price') || 0;

  // Generate a unique proposal ID on component mount
  useEffect(() => {
    const timestamp = format(new Date(), 'yyyyMMddHHmmss');
    const uniqueId = `PROP-${timestamp}-${Math.floor(Math.random() * 1000)}`;
    setProposalId(uniqueId);
    setValue('proposal_id', uniqueId);
  }, [setValue]);

  // Format number with commas and currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    // Remove any non-numeric characters except decimal point
    const numericValue = value.toString().replace(/[^0-9.]/g, '');
    const number = parseFloat(numericValue);
    if (isNaN(number)) return '';
    
    // Format with commas
    const parts = number.toFixed(2).toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Add currency symbol
    return currency === 'USD' ? `$${parts.join('.')}` : `UGX ${parts.join('.')}`;
  };

  // Parse currency string back to number
  const parseCurrency = (value) => {
    if (!value) return '';
    return value.toString().replace(/[^0-9.]/g, '');
  };

  // Auto-calculate total amount whenever quantity or price changes
  useEffect(() => {
    if (productQty && productPrice) {
      const numericPrice = parseCurrency(productPrice);
      const totalAmount = Number(productQty) * Number(numericPrice);
      setValue('total_amount', formatCurrency(totalAmount));
    }
  }, [productQty, productPrice, setValue, currency]);

  // Fetch products from cold_room_inventory for auto-fill
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cold_room_inventory')
          .select('*')
          .order('storage_date_time', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log('Products fetched:', data);
          setProducts(data);
        } else {
          console.log('No products found, using sample data');
          setProducts([
            { id: 1, product_type: 'Cheese', batch_id: 'BATCH-001', unit_quantity: 50, unit_weight: 250 },
            { id: 2, product_type: 'Milk', batch_id: 'BATCH-002', unit_quantity: 100, unit_weight: 1000 },
          ]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products: " + error.message,
          variant: "destructive",
        });
        // Use sample data on error
        setProducts([
          { id: 1, product_type: 'Cheese', batch_id: 'BATCH-001', unit_quantity: 50, unit_weight: 250 },
          { id: 2, product_type: 'Milk', batch_id: 'BATCH-002', unit_quantity: 100, unit_weight: 1000 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Handle price input formatting
  const handlePriceChange = (e) => {
    const input = e.target.value;
    const numericValue = parseCurrency(input);
    if (numericValue === '' || !isNaN(numericValue)) {
      setValue('product_price', formatCurrency(numericValue));
    }
  };

  // Handle product selection
  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === Number(productId));
    if (product) {
      setValue('product_type', product.product_type);
      setValue('batch_id', product.batch_id);
      setValue('product_quantity', product.unit_quantity);
      setValue('unit_weight', product.unit_weight);
    }
  };

  // Add product to the list
  const handleAddProduct = () => {
    const productType = watch('product_type');
    const quantity = watch('product_quantity');
    const price = watch('product_price');
    const totalAmount = watch('total_amount');
    
    if (!productType || !quantity || !price) {
      toast({
        title: "Error",
        description: "Please fill in all product details",
        variant: "destructive",
      });
      return;
    }
    
    const newProduct = {
      id: selectedProducts.length + 1,
      product_type: productType,
      quantity: Number(quantity),
      price: price,
      total_amount: totalAmount
    };
    
    setSelectedProducts([...selectedProducts, newProduct]);
    
    // Clear product fields for next entry
    setValue('product_type', '');
    setValue('batch_id', '');
    setValue('product_quantity', '');
    setValue('product_price', '');
    setValue('total_amount', '');
  };

  // Remove product from the list
  const removeProduct = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    if (selectedProducts.length === 0) return 0;
    
    return selectedProducts.reduce((total, product) => {
      const amount = parseCurrency(product.total_amount);
      return total + Number(amount);
    }, 0);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Prepare data for submission
      const proposal = {
        proposal_id: data.proposal_id,
        customer_name: data.customer_name,
        customer_email: data.contact_email,
        customer_phone: data.contact_phone,
        proposal_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        validity_period: parseInt(data.validity_period),
        terms_conditions: data.terms_conditions,
        products: selectedProducts,
        grand_total: calculateGrandTotal(),
        status: 'draft',
        created_by: user?.id || null
      };
      
      console.log('Submitting proposal:', proposal);
      
      // Insert into sales_proposals table
      const { error } = await supabase
        .from('sales_proposals')
        .insert([proposal]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Sales proposal saved successfully",
      });
      
      // Reset form and state
      reset();
      setSelectedProducts([]);
      
      // Generate new proposal ID
      const timestamp = format(new Date(), 'yyyyMMddHHmmss');
      const uniqueId = `PROP-${timestamp}-${Math.floor(Math.random() * 1000)}`;
      setProposalId(uniqueId);
      setValue('proposal_id', uniqueId);
      
    } catch (error) {
      console.error('Error saving proposal:', error);
      toast({
        title: "Error",
        description: "Failed to save proposal: " + error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
    setValue,
    watch,
  };
};

export default useSalesProposalForm;
