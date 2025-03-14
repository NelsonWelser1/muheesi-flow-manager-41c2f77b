
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Upload, Plus, Trash } from "lucide-react";
import CustomerInvoiceList from '../CustomerInvoiceList';
import { supabase } from '@/integrations/supabase/supabase';

const CustomerInvoiceForm = ({ onBack }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
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
  
  const onSubmit = async (data) => {
    try {
      // Generate invoice ID
      const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
      
      // Upload payment proof if exists
      let paymentProofUrl = null;
      if (fileUpload) {
        paymentProofUrl = await uploadPaymentProof(fileUpload, invoiceId);
      }
      
      // Prepare invoice data
      const invoiceData = {
        id: invoiceId,
        customerName: data.customerName,
        customerContact: data.customerContact,
        billingAddress: data.billingAddress,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        items: invoiceItems,
        tax: data.tax || 0,
        discount: data.discount || 0,
        totalAmount: totalAmount,
        paymentTerms: data.paymentTerms,
        paymentStatus: data.paymentStatus,
        paymentProofUrl: paymentProofUrl,
        createdAt: new Date().toISOString()
      };
      
      console.log("Invoice data to be saved:", invoiceData);
      
      // Here you would normally save to database
      // For demo, we'll just show a success message
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      
      // Reset form
      setInvoiceItems([{ description: '', quantity: 1, price: 0, tax: 0, discount: 0, total: 0 }]);
      setFileUpload(null);
      setFilePreview('');
      
      // Show the invoice list after creation
      setShowInvoiceList(true);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive"
      });
    }
  };

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
          onClick={() => setShowInvoiceList(true)}
          className="flex items-center gap-2"
        >
          View Invoices
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Invoice Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Invoice Number</Label>
                <Input 
                  defaultValue={`INV-${Date.now().toString().slice(-6)}`} 
                  readOnly 
                  className="bg-gray-50"
                  {...register("invoiceNumber")} 
                />
              </div>

              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input {...register("customerName", { required: "Customer name is required" })} />
                {errors.customerName && (
                  <p className="text-sm text-red-500">{errors.customerName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Customer Contact</Label>
                <Input {...register("customerContact")} />
              </div>

              <div className="space-y-2">
                <Label>Billing Address</Label>
                <Input {...register("billingAddress", { required: "Billing address is required" })} />
                {errors.billingAddress && (
                  <p className="text-sm text-red-500">{errors.billingAddress.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Invoice Date</Label>
                <Input type="date" {...register("invoiceDate", { required: "Invoice date is required" })} />
                {errors.invoiceDate && (
                  <p className="text-sm text-red-500">{errors.invoiceDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" {...register("dueDate", { required: "Due date is required" })} />
                {errors.dueDate && (
                  <p className="text-sm text-red-500">{errors.dueDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Itemized Products/Services</Label>
              <div className="border rounded-lg p-4 space-y-4">
                {invoiceItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Input 
                        placeholder="Item description" 
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Quantity</Label>
                      <Input 
                        type="number" 
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Unit Price</Label>
                      <Input 
                        type="number" 
                        placeholder="Unit price"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Discount</Label>
                      <Input 
                        type="number" 
                        placeholder="Discount"
                        value={item.discount}
                        onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Tax (%)</Label>
                      <Input 
                        type="number" 
                        placeholder="Tax %"
                        value={item.tax}
                        onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-grow">
                        <Label className="text-xs">Total</Label>
                        <Input 
                          value={item.total.toLocaleString()} 
                          readOnly 
                          className="bg-gray-50"
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                        className="self-end"
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddItem}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tax (%)</Label>
                <Input 
                  type="number" 
                  {...register("tax", { 
                    min: { value: 0, message: "Tax cannot be negative" },
                    max: { value: 100, message: "Tax cannot exceed 100%" }
                  })} 
                  defaultValue="0"
                />
                {errors.tax && (
                  <p className="text-sm text-red-500">{errors.tax.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input 
                  type="number" 
                  {...register("discount", { 
                    min: { value: 0, message: "Discount cannot be negative" },
                    max: { value: 100, message: "Discount cannot exceed 100%" }
                  })} 
                  defaultValue="0"
                />
                {errors.discount && (
                  <p className="text-sm text-red-500">{errors.discount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Payment Terms</Label>
                <Select 
                  defaultValue="bank_transfer"
                  onValueChange={(value) => setValue("paymentTerms", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("paymentTerms")} />
              </div>

              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select 
                  defaultValue="pending"
                  onValueChange={(value) => setValue("paymentStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partially_paid">Partially Paid</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("paymentStatus")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Total Amount (Auto-calculated)</Label>
              <Input 
                readOnly 
                className="bg-gray-50 font-bold" 
                value={`UGX ${totalAmount.toLocaleString()}`} 
              />
            </div>

            <div className="space-y-2">
              <Label>Attach Payment Proof (JPG, PNG, PDF, max 5MB)</Label>
              <div className="flex flex-col gap-3">
                <Input 
                  type="file" 
                  accept=".jpg,.jpeg,.png,.pdf" 
                  onChange={handleFileChange}
                  className="max-w-md"
                />
                
                {filePreview && (
                  <div className="p-2 border rounded-md max-w-md">
                    {filePreview.startsWith('data:image') ? (
                      <img 
                        src={filePreview} 
                        alt="Payment proof preview" 
                        className="h-24 object-contain"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <Upload className="h-4 w-4" />
                        {filePreview}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="bg-[#0000a0] hover:bg-[#00008b]"
                disabled={isUploading}
              >
                {isUploading ? "Creating Invoice..." : "Create Invoice"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => {
                  document.querySelector('input[type="file"]').click();
                }}
              >
                <Upload className="h-4 w-4" />
                Attach Payment Proof
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <CustomerInvoiceList
        isOpen={showInvoiceList} 
        onClose={() => setShowInvoiceList(false)}
      />
    </div>
  );
};

export default CustomerInvoiceForm;
