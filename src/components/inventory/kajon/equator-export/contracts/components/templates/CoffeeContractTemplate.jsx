import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Save, Loader2 } from 'lucide-react';
import { useCoffeeExportContract } from '@/integrations/supabase/hooks/contracts/useCoffeeExportContract';
import { showSuccessToast, showErrorToast, showLoadingToast } from "@/components/ui/notifications";
import { dismissToast } from "@/components/ui/notifications";

const CoffeeContractTemplate = ({ contractData = {}, onDataChange, onSave }) => {
  const [formData, setFormData] = useState({
    contract_number: contractData.contract_number || '',
    contract_date: contractData.contract_date || '',
    seller_name: contractData.seller_name || '',
    seller_address: contractData.seller_address || '',
    seller_registration: contractData.seller_registration || '',
    buyer_name: contractData.buyer_name || '',
    buyer_address: contractData.buyer_address || '',
    buyer_registration: contractData.buyer_registration || '',
    products: contractData.products || [{ id: uuidv4(), description: '', quantity: '', unit_price: '', total_price: '' }],
    payment_terms_items: contractData.payment_terms_items || [{ id: uuidv4(), description: '', due_date: '', amount: '' }],
    shipping_left_label1: contractData.shipping_left_label1 || 'Incoterm:',
    shipping_left_value1: contractData.shipping_left_value1 || 'FOB Mombasa',
    shipping_left_label2: contractData.shipping_left_label2 || 'Packaging:',
    shipping_left_value2: contractData.shipping_left_value2 || '60kg jute bags with GrainPro liners',
    shipping_left_label3: contractData.shipping_left_label3 || 'Loading Port:',
    shipping_left_value3: contractData.shipping_left_value3 || 'Mombasa, Kenya',
    shipping_right_label1: contractData.shipping_right_label1 || 'Destination:',
    shipping_right_value1: contractData.shipping_right_value1 || 'Hamburg, Germany',
    shipping_right_label2: contractData.shipping_right_label2 || 'Latest Shipment Date:',
    shipping_right_value2: contractData.shipping_right_value2 || 'October 15, 2024',
    shipping_right_label3: contractData.shipping_right_label3 || 'Delivery Timeline:',
    shipping_right_value3: contractData.shipping_right_value3 || '30-45 days from loading',
    additional_shipping_terms_label: contractData.additional_shipping_terms_label || 'Additional Shipping Terms:',
    additional_shipping_terms: contractData.additional_shipping_terms || '',
    for_seller_label: contractData.for_seller_label || 'For and on behalf of SELLER',
    seller_name_label: contractData.seller_name_label || 'Name:',
    seller_name_value: contractData.seller_name_value || '',
    seller_title_label: contractData.seller_title_label || 'Title:',
    seller_title_value: contractData.seller_title_value || '',
    seller_date_label: contractData.seller_date_label || 'Date:',
    seller_date_value: contractData.seller_date_value || '',
    seller_signature_label: contractData.seller_signature_label || 'Signature:',
    seller_signature_value: contractData.seller_signature_value || '',
    for_buyer_label: contractData.for_buyer_label || 'For and on behalf of BUYER',
    buyer_signature_name_label: contractData.buyer_signature_name_label || 'Name:',
    buyer_signature_name_value: contractData.buyer_signature_name_value || '',
    buyer_signature_title_label: contractData.buyer_signature_title_label || 'Title:',
    buyer_signature_title_value: contractData.buyer_signature_title_value || '',
    buyer_signature_date_label: contractData.buyer_signature_date_label || 'Date:',
    buyer_signature_date_value: contractData.buyer_signature_date_value || '',
    buyer_signature_label: contractData.buyer_signature_label || 'Signature:',
    buyer_signature_value: contractData.buyer_signature_value || '',
    company_stamp: contractData.company_stamp || '[Company Seal/Stamp]',
    total_contract_value: contractData.total_contract_value || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [contractDate, setContractDate] = useState(contractData.contract_date ? new Date(contractData.contract_date) : undefined);
  const { toast } = useToast();
  const { saveContract } = useCoffeeExportContract();
  const productsSectionRef = useRef(null);
  const paymentTermsRef = useRef(null);

  useEffect(() => {
    if (contractData) {
      setFormData({
        contract_number: contractData.contract_number || '',
        contract_date: contractData.contract_date || '',
        seller_name: contractData.seller_name || '',
        seller_address: contractData.seller_address || '',
        seller_registration: contractData.seller_registration || '',
        buyer_name: contractData.buyer_name || '',
        buyer_address: contractData.buyer_address || '',
        buyer_registration: contractData.buyer_registration || '',
        products: contractData.products || [{ id: uuidv4(), description: '', quantity: '', unit_price: '', total_price: '' }],
        payment_terms_items: contractData.payment_terms_items || [{ id: uuidv4(), description: '', due_date: '', amount: '' }],
        shipping_left_label1: contractData.shipping_left_label1 || 'Incoterm:',
        shipping_left_value1: contractData.shipping_left_value1 || 'FOB Mombasa',
        shipping_left_label2: contractData.shipping_left_label2 || 'Packaging:',
        shipping_left_value2: contractData.shipping_left_value2 || '60kg jute bags with GrainPro liners',
        shipping_left_label3: contractData.shipping_left_label3 || 'Loading Port:',
        shipping_left_value3: contractData.shipping_left_value3 || 'Mombasa, Kenya',
        shipping_right_label1: contractData.shipping_right_label1 || 'Destination:',
        shipping_right_value1: contractData.shipping_right_value1 || 'Hamburg, Germany',
        shipping_right_label2: contractData.shipping_right_label2 || 'Latest Shipment Date:',
        shipping_right_value2: contractData.shipping_right_value2 || 'October 15, 2024',
        shipping_right_label3: contractData.shipping_right_label3 || 'Delivery Timeline:',
        shipping_right_value3: contractData.shipping_right_value3 || '30-45 days from loading',
        additional_shipping_terms_label: contractData.additional_shipping_terms_label || 'Additional Shipping Terms:',
        additional_shipping_terms: contractData.additional_shipping_terms || '',
        for_seller_label: contractData.for_seller_label || 'For and on behalf of SELLER',
        seller_name_label: contractData.seller_name_label || 'Name:',
        seller_name_value: contractData.seller_name_value || '',
        seller_title_label: contractData.seller_title_label || 'Title:',
        seller_title_value: contractData.seller_title_value || '',
        seller_date_label: contractData.seller_date_label || 'Date:',
        seller_date_value: contractData.seller_date_value || '',
        seller_signature_label: contractData.seller_signature_label || 'Signature:',
        seller_signature_value: contractData.seller_signature_value || '',
        for_buyer_label: contractData.for_buyer_label || 'For and on behalf of BUYER',
        buyer_signature_name_label: contractData.buyer_signature_name_label || 'Name:',
        buyer_signature_name_value: contractData.buyer_signature_name_value || '',
        buyer_signature_title_label: contractData.buyer_signature_title_label || 'Title:',
        buyer_signature_title_value: contractData.buyer_signature_title_value || '',
        buyer_signature_date_label: contractData.buyer_signature_date_label || 'Date:',
        buyer_signature_date_value: contractData.buyer_signature_date_value || '',
        buyer_signature_label: contractData.buyer_signature_label || 'Signature:',
        buyer_signature_value: contractData.buyer_signature_value || '',
        company_stamp: contractData.company_stamp || '[Company Seal/Stamp]',
        total_contract_value: contractData.total_contract_value || '',
      });
      setContractDate(contractData.contract_date ? new Date(contractData.contract_date) : undefined);
    }
  }, [contractData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (onDataChange) {
      onDataChange({ ...formData, [name]: value });
    }
  };

  const handleProductChange = useCallback((index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = value;
    setFormData(prev => ({ ...prev, products: updatedProducts }));
    if (onDataChange) {
      onDataChange({ ...formData, products: updatedProducts });
    }
  }, [formData, onDataChange]);

  const handleAddProduct = useCallback(() => {
    const newProducts = [...formData.products, { id: uuidv4(), description: '', quantity: '', unit_price: '', total_price: '' }];
    setFormData(prev => ({ ...prev, products: newProducts }));
    if (onDataChange) {
      onDataChange({ ...formData, products: newProducts });
    }
    // Scroll to the products section
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [formData, onDataChange]);

  const handleRemoveProduct = useCallback((id) => {
    const updatedProducts = formData.products.filter(product => product.id !== id);
    setFormData(prev => ({ ...prev, products: updatedProducts }));
    if (onDataChange) {
      onDataChange({ ...formData, products: updatedProducts });
    }
  }, [formData, onDataChange]);

  const handlePaymentTermsChange = useCallback((index, field, value) => {
    const updatedPaymentTerms = [...formData.payment_terms_items];
    updatedPaymentTerms[index][field] = value;
    setFormData(prev => ({ ...prev, payment_terms_items: updatedPaymentTerms }));
    if (onDataChange) {
      onDataChange({ ...formData, payment_terms_items: updatedPaymentTerms });
    }
  }, [formData, onDataChange]);

  const handleAddPaymentTerm = useCallback(() => {
    const newPaymentTerms = [...formData.payment_terms_items, { id: uuidv4(), description: '', due_date: '', amount: '' }];
    setFormData(prev => ({ ...prev, payment_terms_items: newPaymentTerms }));
    if (onDataChange) {
      onDataChange({ ...formData, payment_terms_items: newPaymentTerms });
    }
    // Scroll to the payment terms section
    paymentTermsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [formData, onDataChange]);

  const handleRemovePaymentTerm = useCallback((id) => {
    const updatedPaymentTerms = formData.payment_terms_items.filter(item => item.id !== id);
    setFormData(prev => ({ ...prev, payment_terms_items: updatedPaymentTerms }));
    if (onDataChange) {
      onDataChange({ ...formData, payment_terms_items: updatedPaymentTerms });
    }
  }, [formData, onDataChange]);

  const handleContractDateChange = (date) => {
    setContractDate(date);
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
    setFormData(prev => ({ ...prev, contract_date: formattedDate }));
    if (onDataChange) {
      onDataChange({ ...formData, contract_date: formattedDate });
    }
  };

  const handleSaveContract = async () => {
    try {
      console.log("Attempting to save contract with data:", formData);
      setIsSaving(true);
      
      // Validate required fields
      if (!formData.contract_number) {
        showErrorToast(toast, "Contract number is required");
        setIsSaving(false);
        return;
      }
      
      if (!formData.contract_date) {
        showErrorToast(toast, "Contract date is required");
        setIsSaving(false);
        return;
      }
      
      if (!formData.seller_name) {
        showErrorToast(toast, "Seller name is required");
        setIsSaving(false);
        return;
      }
      
      if (!formData.buyer_name) {
        showErrorToast(toast, "Buyer name is required");
        setIsSaving(false);
        return;
      }
      
      // Create a loading toast
      const loadingToastId = showLoadingToast(toast, "Saving contract...");
      
      // Format products for database storage
      const processedProducts = formData.products.map(product => {
        // Ensure each product has a unique ID
        if (!product.id) {
          return { ...product, id: `product-${uuidv4()}` };
        }
        return product;
      });
      
      // Prepare contract data for saving
      const contractToSave = {
        ...formData,
        products: processedProducts,
        submission_id: uuidv4() // Use submission_id instead of submitted_flag
      };
      
      console.log("Saving contract with processed data:", contractToSave);
      
      // Save to Supabase using the useCoffeeExportContract hook
      const { success, error, data } = await saveContract(contractToSave);
      
      // Dismiss the loading toast
      dismissToast(loadingToastId);
      
      if (success) {
        console.log("Contract saved successfully:", data);
        showSuccessToast(toast, "Contract saved successfully");
        
        // Call the onSave callback if provided
        if (onSave && typeof onSave === 'function') {
          onSave(data);
        }
      } else {
        console.error("Error saving contract:", error);
        showErrorToast(toast, `Error saving contract: ${error.message || error}`);
      }
    } catch (err) {
      console.error("Exception in handleSaveContract:", err);
      showErrorToast(toast, `An unexpected error occurred: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Contract Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contract_number">Contract Number</Label>
          <Input
            type="text"
            id="contract_number"
            name="contract_number"
            value={formData.contract_number}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="contract_date">Contract Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !contractDate && "text-muted-foreground"
                )}
              >
                {contractDate ? (
                  format(contractDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={contractDate}
                onSelect={handleContractDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Seller Details */}
      <div className="border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">Seller Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="seller_name">Seller Name</Label>
            <Input
              type="text"
              id="seller_name"
              name="seller_name"
              value={formData.seller_name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="seller_address">Seller Address</Label>
            <Input
              type="text"
              id="seller_address"
              name="seller_address"
              value={formData.seller_address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="seller_registration">Seller Registration</Label>
            <Input
              type="text"
              id="seller_registration"
              name="seller_registration"
              value={formData.seller_registration}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Buyer Details */}
      <div className="border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">Buyer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="buyer_name">Buyer Name</Label>
            <Input
              type="text"
              id="buyer_name"
              name="buyer_name"
              value={formData.buyer_name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="buyer_address">Buyer Address</Label>
            <Input
              type="text"
              id="buyer_address"
              name="buyer_address"
              value={formData.buyer_address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="buyer_registration">Buyer Registration</Label>
            <Input
              type="text"
              id="buyer_registration"
              name="buyer_registration"
              value={formData.buyer_registration}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="border-t pt-4" ref={productsSectionRef}>
        <h3 className="text-xl font-semibold mb-2">Products</h3>
        {formData.products.map((product, index) => (
          <div key={product.id} className="grid grid-cols-5 gap-4 mb-4">
            <div>
              <Label htmlFor={`description-${product.id}`}>Description</Label>
              <Input
                type="text"
                id={`description-${product.id}`}
                name={`description-${product.id}`}
                value={product.description}
                onChange={(e) => handleProductChange(index, 'description', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`quantity-${product.id}`}>Quantity</Label>
              <Input
                type="number"
                id={`quantity-${product.id}`}
                name={`quantity-${product.id}`}
                value={product.quantity}
                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`unit_price-${product.id}`}>Unit Price</Label>
              <Input
                type="number"
                id={`unit_price-${product.id}`}
                name={`unit_price-${product.id}`}
                value={product.unit_price}
                onChange={(e) => handleProductChange(index, 'unit_price', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`total_price-${product.id}`}>Total Price</Label>
              <Input
                type="number"
                id={`total_price-${product.id}`}
                name={`total_price-${product.id}`}
                value={product.total_price}
                onChange={(e) => handleProductChange(index, 'total_price', e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                onClick={() => handleRemoveProduct(product.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          onClick={handleAddProduct}
        >
          Add Product
        </button>
      </div>

      {/* Payment Terms */}
      <div className="border-t pt-4" ref={paymentTermsRef}>
        <h3 className="text-xl font-semibold mb-2">Payment Terms</h3>
        {formData.payment_terms_items.map((item, index) => (
          <div key={item.id} className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor={`description-${item.id}`}>Description</Label>
              <Input
                type="text"
                id={`description-${item.id}`}
                name={`description-${item.id}`}
                value={item.description}
                onChange={(e) => handlePaymentTermsChange(index, 'description', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`due_date-${item.id}`}>Due Date</Label>
              <Input
                type="date"
                id={`due_date-${item.id}`}
                name={`due_date-${item.id}`}
                value={item.due_date}
                onChange={(e) => handlePaymentTermsChange(index, 'due_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`amount-${item.id}`}>Amount</Label>
              <Input
                type="number"
                id={`amount-${item.id}`}
                name={`amount-${item.id}`}
                value={item.amount}
                onChange={(e) => handlePaymentTermsChange(index, 'amount', e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                onClick={() => handleRemovePaymentTerm(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          onClick={handleAddPaymentTerm}
        >
          Add Payment Term
        </button>
      </div>

      {/* Shipping Terms */}
      <div className="border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">Shipping Terms</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div>
            <div>
              <Label htmlFor="shipping_left_label1">Left Label 1</Label>
              <Input
                type="text"
                id="shipping_left_label1"
                name="shipping_left_label1"
                value={formData.shipping_left_label1}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="shipping_left_value1">Left Value 1</Label>
              <Input
                type="text"
                id="shipping_left_value1"
                name="shipping_left_value1"
                value={formData.shipping_left_value1}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="shipping_left_label2">Left Label 2</Label>
              <Input
                type="text"
                id="shipping_left_label2"
                name="shipping_left_label2"
                value={formData.shipping_left_label2}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="shipping_left_value2">Left Value 2</Label>
              <Input
                type="text"
                id="shipping_left_value2"
                name="shipping_left_value2"
                value={formData.shipping_left_value2}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="shipping_left_label3">Left Label 3</Label>
              <Input
                type="text"
                id="shipping_left_label3"
                name="shipping_left_label3"
                value={formData.shipping_left_label3}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="shipping_left_value3">Left Value 3</Label>
              <Input
                type="text"
                id="shipping_left_value3"
                name="shipping_left_value3"
                value={formData.shipping_left_value3}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div>
              <Label htmlFor="shipping_right_label1">Right Label 1</Label>
              <Input
                type="text"
                id="shipping_right_label1"
                name="shipping_right_label1"
                value={formData.shipping_right_label1}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="shipping_right_value1">Right Value 1</Label>
              <Input
                type="text"
                id="shipping_right_value1"
                name="shipping_right_value1"
                value={formData.shipping_right_value1}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="shipping_right_label2">Right Label 2</Label>
              <Input
                type="text"
                id="shipping_right_label2"
                name="shipping_right_label2"
                value={formData.shipping_right_label2}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="shipping_right_value2">Right Value 2</Label>
              <Input
                type="text"
                id="shipping_right_value2"
                name="shipping_right_value2"
                value={formData.shipping_right_value2}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="shipping_right_label3">Right Label 3</Label>
              <Input
                type="text"
                id="shipping_right_label3"
                name="shipping_right_label3"
                value={formData.shipping_right_label3}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="shipping_right_value3">Right Value 3</Label>
              <Input
                type="text"
                id="shipping_right_value3"
                name="shipping_right_value3"
                value={formData.shipping_right_value3}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Additional Shipping Terms */}
        <div className="mt-4">
          <Label htmlFor="additional_shipping_terms_label">Additional Shipping Terms Label</Label>
          <Input
            type="text"
            id="additional_shipping_terms_label"
            name="additional_shipping_terms_label"
            value={formData.additional_shipping_terms_label}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="additional_shipping_terms">Additional Shipping Terms</Label>
          <Textarea
            id="additional_shipping_terms"
            name="additional_shipping_terms"
            value={formData.additional_shipping_terms}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Signature Fields */}
      <div className="border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">Signature Fields</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Seller Signature */}
          <div>
            <Label htmlFor="for_seller_label">For Seller Label</Label>
            <Input
              type="text"
              id="for_seller_label"
              name="for_seller_label"
              value={formData.for_seller_label}
              onChange={handleInputChange}
            />
            <Label htmlFor="seller_name_label">Seller Name Label</Label>
            <Input
              type="text"
              id="seller_name_label"
              name="seller_name_label"
              value={formData.seller_name_label}
              onChange={handleInputChange}
            />
            <Label htmlFor="seller_name_value">Seller Name Value</Label>
            <Input
              type="text"
              id="seller_name_value"
              name="seller_name_value"
              value={formData.seller_name_value}
              onChange={handleInputChange}
            />
            <Label htmlFor="seller_title_label">Seller Title Label</Label>
            <Input
              type="text"
              id="seller_title_label"
              name="seller_title_label"
              value={formData.seller_title_label}
              onChange={handleInputChange}
            />
            <Label htmlFor="seller_title_value">Seller Title Value</Label>
            <Input
              type="text"
              id="seller_title_value"
              name="seller_title_value"
              value={formData.seller_title_value}
              onChange={handleInputChange}
            />
            <Label htmlFor="seller_date_label">Seller Date Label</Label>
            <Input
              type="text"
              id="seller_date_label"
              name="seller_date_label"
              value={formData.seller_date_label}
              onChange={handleInputChange}
            />
            <Label htmlFor="seller_date_value">Seller Date Value</Label>
            <Input
              type="text"
              id="seller_date_value"
              name="seller_date_value"
              value={formData.seller_date_value}
              onChange={handleInputChange}
            />
            <Label htmlFor="seller_signature_label">Seller Signature Label</Label>
            <Input
              type="text"
              id="seller_signature_label"
              name="seller_signature_label"
              value={formData.seller_signature_label}
              onChange={handleInputChange}
            />
            <Label htmlFor="seller_signature_value">Seller Signature Value</Label>
            <Input
              type="text"
              id="seller_signature_value"
              name="seller_signature_value"
              value={formData.seller_signature_value}
              onChange={handleInputChange}
            />
          </div>

          {/* Buyer Signature */}
          <div>
            <Label htmlFor="for_buyer_label">For Buyer Label</Label>
            <Input
              type="text"
              id="for_buyer_label"
              name="for_buyer_label"
              value={formData.for_buyer_label}
              onChange={handleInputChange}
            />
            <Label htmlFor="buyer_signature_name_label">Buyer Name Label</Label>
            <Input
              type="text"
              id="buyer_signature_name_label"
              name="buyer_signature_name_label"
              value={formData.buyer_signature_name_label}
              onChange={handleInputChange}
            />
            <Label htmlFor="buyer_signature_name_value">Buyer Name Value</Label>
            <Input
              type="text"
              id="buyer_signature_name_value"
              name="buyer_signature_name_value"
              value={formData.buyer_signature_name_value}
              onChange={handleInputChange}
            />
            <Label htmlFor="buyer_signature_title_label">Buyer Title Label</Label>
            <Input
              type="text"
              id="buyer_signature_title_label"
              name="buyer_signature_title_label"
              value={formData.buyer_signature_title_label}
              onChange={handleInputChange}
            />
            <Label htmlFor="buyer_signature_title_value">Buyer Title Value</Label>
            <Input
              type="text"
              id="buyer_signature_title_value"
              name="buyer_signature_title_value"
              value={formData.buyer_signature_title_value}
              onChange={handleInputChange}
            />
            <Label htmlFor="buyer_signature_date_label">Buyer Date Label</Label>
            <Input
              type="text"
              id="buyer_signature_date_label"
              name="buyer_signature_date_label"
              value={formData.buyer_signature_date_label}
              onChange={handleInputChange}
            />
            <Label htmlFor="buyer_signature_date_value">Buyer Date Value</Label>
            <Input
              type="text"
              id="buyer_signature_date_value"
              name="buyer_signature_date_value"
              value={formData.buyer_signature_date_value}
