
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Search, Download, Printer, FileDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import SalesProposalsDisplay from './displays/SalesProposalsDisplay';

const SalesProposalsForm = ({ onBack }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDisplay, setShowDisplay] = useState(false);
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
    if (!value) return '';
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

  // Calculate grand total
  const calculateGrandTotal = () => {
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
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        products: selectedProducts,
        validity_period: data.validity_period,
        terms_conditions: data.terms_conditions,
        grand_total: formatCurrency(calculateGrandTotal()),
        created_by: user?.id || 'anonymous',
        created_at: new Date().toISOString(),
      };
      
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

  if (showDisplay) {
    return <SalesProposalsDisplay onBack={() => setShowDisplay(false)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => setShowDisplay(true)}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" /> View Proposals
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>New Sales Proposal/Quotation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proposal_id">Proposal ID</Label>
                <Input 
                  id="proposal_id" 
                  {...register("proposal_id", { required: true })} 
                  readOnly 
                  className="bg-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select 
                  value={currency}
                  onValueChange={setCurrency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="UGX">UGX (Shilling)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customer_name">Customer Name</Label>
                <Input 
                  id="customer_name" 
                  {...register("customer_name", { required: true })} 
                />
                {errors.customer_name && <p className="text-red-500 text-sm">This field is required</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input 
                  id="contact_email" 
                  type="email"
                  {...register("contact_email", { 
                    required: true,
                    pattern: /^\S+@\S+$/i
                  })} 
                />
                {errors.contact_email && <p className="text-red-500 text-sm">Please enter a valid email</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input 
                  id="contact_phone" 
                  {...register("contact_phone", { required: true })} 
                />
                {errors.contact_phone && <p className="text-red-500 text-sm">This field is required</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="validity_period">Validity Period (days)</Label>
                <Input 
                  id="validity_period" 
                  type="number"
                  min="1"
                  defaultValue="30"
                  {...register("validity_period", { 
                    required: true,
                    valueAsNumber: true,
                    min: 1
                  })} 
                />
                {errors.validity_period && <p className="text-red-500 text-sm">Please enter a valid number of days</p>}
              </div>
            </div>
            
            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">Add Products</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_type">Product Type</Label>
                  <Select onValueChange={handleProductSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : products.length > 0 ? (
                        products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.product_type} - {product.batch_id}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-products" disabled>No products found</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Input 
                    {...register("product_type")} 
                    className="mt-2"
                    placeholder="Or type manually"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="product_quantity">Quantity</Label>
                  <Input 
                    id="product_quantity" 
                    type="number"
                    min="1"
                    {...register("product_quantity")} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="product_price">Price Per Unit</Label>
                  <Input 
                    id="product_price" 
                    {...register("product_price")} 
                    onChange={handlePriceChange}
                    placeholder={currency === 'USD' ? '$0.00' : 'UGX 0'}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="batch_id">Batch ID</Label>
                  <Input 
                    id="batch_id" 
                    {...register("batch_id")} 
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit_weight">Unit Weight (g)</Label>
                  <Input 
                    id="unit_weight" 
                    {...register("unit_weight")} 
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="total_amount">Total Amount</Label>
                  <Input 
                    id="total_amount" 
                    {...register("total_amount")} 
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
              </div>
              
              <Button 
                type="button" 
                onClick={handleAddProduct}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </div>
            
            {selectedProducts.length > 0 && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Added Products</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No.</TableHead>
                      <TableHead>Product Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.product_type}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.total_amount}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-bold">Grand Total:</TableCell>
                      <TableCell className="font-bold">{formatCurrency(calculateGrandTotal())}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="terms_conditions">Terms & Conditions</Label>
              <Textarea 
                id="terms_conditions" 
                {...register("terms_conditions")} 
                rows={5}
                placeholder="Enter the terms and conditions for this proposal..."
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Submit Proposal'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesProposalsForm;
