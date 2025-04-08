
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Plus, Save, ArrowLeft, Download } from "lucide-react";
import { format } from 'date-fns';
import { useLocalPurchaseOrders } from '@/hooks/useLocalPurchaseOrders';

const LocalPurchaseOrderForm = ({ onBack, existingOrder = null, readonly = false }) => {
  const { toast } = useToast();
  const { saveOrder, updateOrder, generateOrderNumber, loading } = useLocalPurchaseOrders();
  const isEditMode = !!existingOrder;
  
  const [formData, setFormData] = useState({
    contract_number: generateOrderNumber(),
    agreement_date: format(new Date(), 'yyyy-MM-dd'),
    buyer_name: 'KAJON Coffee Limited',
    buyer_address: 'Kanoni, Kazo District, Uganda',
    buyer_contact: '+256 782 123456',
    supplier_name: '',
    supplier_address: '',
    supplier_contact: '',
    payment_terms: 'Payment due within 30 days of delivery',
    delivery_terms: 'Delivery to buyer\'s warehouse',
    contract_status: 'draft',
    items: [
      { id: 1, description: 'Green Coffee Beans', variety: 'Arabica', quantity: 1000, unit: 'Kg', unit_price: 2.5 }
    ],
    quality_requirements: 'Standard coffee quality as per Uganda Coffee Development Authority guidelines',
    special_terms: '',
    notes: ''
  });

  // Load existing order data if in edit mode
  useEffect(() => {
    if (existingOrder) {
      // Make sure items array is properly formatted
      let items = existingOrder.items;
      if (!items || !Array.isArray(items) || items.length === 0) {
        items = [{ id: 1, description: 'Green Coffee Beans', variety: 'Arabica', quantity: 1000, unit: 'Kg', unit_price: 2.5 }];
      }
      
      setFormData(prevData => ({
        ...prevData,
        ...existingOrder,
        items: items
      }));
    }
  }, [existingOrder]);

  const handleInputChange = (field, value) => {
    if (readonly) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    if (readonly) return;
    
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addNewItem = () => {
    if (readonly) return;
    
    const newId = Math.max(0, ...formData.items.map(item => item.id || 0)) + 1;
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: newId, description: 'Coffee Beans', variety: 'Arabica', quantity: 0, unit: 'Kg', unit_price: 0 }
      ]
    }));
  };

  const removeItem = (id) => {
    if (readonly) return;
    
    if (formData.items.length <= 1) {
      toast({
        title: "Error",
        description: "At least one item is required",
        variant: "destructive",
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const calculateTotal = () => {
    if (!formData.items || !Array.isArray(formData.items)) {
      return 0;
    }
    return formData.items.reduce(
      (total, item) => total + (parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0)), 
      0
    );
  };

  const validateForm = () => {
    // Required field validation
    if (!formData.supplier_name) {
      toast({
        title: "Missing Information",
        description: "Please provide supplier name",
        variant: "destructive",
      });
      return false;
    }
    
    // Items validation
    if (!formData.items || formData.items.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add at least one item",
        variant: "destructive",
      });
      return false;
    }
    
    // Validate each item
    for (const item of formData.items) {
      if (!item.description) {
        toast({
          title: "Missing Information",
          description: "Please provide a description for all items",
          variant: "destructive",
        });
        return false;
      }
      
      if (!item.quantity || item.quantity <= 0) {
        toast({
          title: "Invalid Information",
          description: "Quantity must be greater than zero for all items",
          variant: "destructive",
        });
        return false;
      }
      
      if (!item.unit_price || item.unit_price <= 0) {
        toast({
          title: "Invalid Information",
          description: "Price must be greater than zero for all items",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (readonly) return;
    if (!validateForm()) return;
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      total_value: calculateTotal(),
    };
    
    try {
      let result;
      
      if (isEditMode) {
        // Update existing order
        result = await updateOrder(existingOrder.id, submissionData);
      } else {
        // Create new order
        result = await saveOrder(submissionData);
      }
      
      if (result.success) {
        toast({
          title: "Success",
          description: isEditMode 
            ? "Purchase Order updated successfully" 
            : "Purchase Order created successfully",
        });
        
        // If we're in create mode, redirect back to the list
        if (!isEditMode) {
          onBack();
        }
      }
    } catch (error) {
      console.error("Error saving purchase order:", error);
      toast({
        title: "Error",
        description: `Failed to save purchase order: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Purchase Orders
        </Button>
        {!readonly && (
          <Button 
            variant="default" 
            className="flex items-center gap-1"
            onClick={handleSubmit}
            disabled={loading}
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : isEditMode ? "Update Order" : "Create Order"}
          </Button>
        )}
      </div>
      
      <div className="p-6 border rounded-md bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">LOCAL PURCHASE ORDER</h1>
          <div className="text-gray-500">Order #: {formData.contract_number}</div>
          <div className="text-gray-500">Date: {format(new Date(formData.agreement_date), 'MMMM dd, yyyy')}</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">BUYER</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-600">Company</label>
                <Input 
                  value={formData.buyer_name || ''}
                  onChange={(e) => handleInputChange('buyer_name', e.target.value)}
                  readOnly={readonly}
                  className={readonly ? "bg-gray-50" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Address</label>
                <Input 
                  value={formData.buyer_address || ''}
                  onChange={(e) => handleInputChange('buyer_address', e.target.value)}
                  readOnly={readonly}
                  className={readonly ? "bg-gray-50" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Contact</label>
                <Input 
                  value={formData.buyer_contact || ''}
                  onChange={(e) => handleInputChange('buyer_contact', e.target.value)}
                  readOnly={readonly}
                  className={readonly ? "bg-gray-50" : ""}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">SUPPLIER</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Company/Farm/Producer <span className="text-red-500">*</span>
                </label>
                <Input 
                  value={formData.supplier_name || ''}
                  onChange={(e) => handleInputChange('supplier_name', e.target.value)}
                  placeholder="Enter supplier name"
                  readOnly={readonly}
                  className={readonly ? "bg-gray-50" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Address</label>
                <Input 
                  value={formData.supplier_address || ''}
                  onChange={(e) => handleInputChange('supplier_address', e.target.value)}
                  placeholder="Enter supplier address"
                  readOnly={readonly}
                  className={readonly ? "bg-gray-50" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Contact</label>
                <Input 
                  value={formData.supplier_contact || ''}
                  onChange={(e) => handleInputChange('supplier_contact', e.target.value)}
                  placeholder="Enter supplier contact"
                  readOnly={readonly}
                  className={readonly ? "bg-gray-50" : ""}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">PRODUCTS</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left border">Description <span className="text-red-500">*</span></th>
                  <th className="px-4 py-2 text-left border">Variety/Type</th>
                  <th className="px-4 py-2 text-left border">Quantity <span className="text-red-500">*</span></th>
                  <th className="px-4 py-2 text-left border">Unit</th>
                  <th className="px-4 py-2 text-left border">Price per Unit <span className="text-red-500">*</span></th>
                  <th className="px-4 py-2 text-left border">Total</th>
                  {!readonly && (
                    <th className="px-4 py-2 text-center border">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {formData.items && formData.items.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="px-4 py-2 border">
                      {readonly ? (
                        <div>{item.description || 'N/A'}</div>
                      ) : (
                        <Input
                          value={item.description || ''}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder="Coffee beans, etc."
                          readOnly={readonly}
                          className={readonly ? "bg-gray-50" : ""}
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {readonly ? (
                        <div>{item.variety || 'N/A'}</div>
                      ) : (
                        <Input
                          value={item.variety || ''}
                          onChange={(e) => handleItemChange(index, 'variety', e.target.value)}
                          placeholder="Arabica, Robusta, etc."
                          readOnly={readonly}
                          className={readonly ? "bg-gray-50" : ""}
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {readonly ? (
                        <div>{item.quantity || '0'}</div>
                      ) : (
                        <Input
                          type="number"
                          min="0"
                          value={item.quantity || 0}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          readOnly={readonly}
                          className={readonly ? "bg-gray-50" : ""}
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {readonly ? (
                        <div>{item.unit || 'Kg'}</div>
                      ) : (
                        <Select 
                          value={item.unit || 'Kg'} 
                          onValueChange={(value) => handleItemChange(index, 'unit', value)}
                          disabled={readonly}
                        >
                          <SelectTrigger className={`w-full ${readonly ? "bg-gray-50" : ""}`}>
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Kg">Kg</SelectItem>
                            <SelectItem value="Ton">Ton</SelectItem>
                            <SelectItem value="Bag">Bag</SelectItem>
                            <SelectItem value="Sack">Sack</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {readonly ? (
                        <div>{item.unit_price || '0'}</div>
                      ) : (
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_price || 0}
                          onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          readOnly={readonly}
                          className={readonly ? "bg-gray-50" : ""}
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {((item.quantity || 0) * (item.unit_price || 0)).toFixed(2)}
                    </td>
                    {!readonly && (
                      <td className="px-4 py-2 border text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          title="Remove item"
                          disabled={readonly}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={readonly ? "5" : "5"} className="px-4 py-2 text-right font-bold">
                    TOTAL:
                  </td>
                  <td className="px-4 py-2 border font-bold">
                    {calculateTotal().toFixed(2)}
                  </td>
                  {!readonly && (
                    <td className="px-4 py-2 border text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={addNewItem}
                        title="Add item"
                        disabled={readonly}
                      >
                        <Plus className="h-4 w-4 text-green-500" />
                      </Button>
                    </td>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">PAYMENT TERMS</h2>
            {readonly ? (
              <div className="border p-3 rounded bg-gray-50 min-h-[100px]">{formData.payment_terms || 'N/A'}</div>
            ) : (
              <Textarea
                value={formData.payment_terms || ''}
                onChange={(e) => handleInputChange('payment_terms', e.target.value)}
                rows={3}
                readOnly={readonly}
                className={readonly ? "bg-gray-50" : ""}
              />
            )}
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">DELIVERY TERMS</h2>
            {readonly ? (
              <div className="border p-3 rounded bg-gray-50 min-h-[100px]">{formData.delivery_terms || 'N/A'}</div>
            ) : (
              <Textarea
                value={formData.delivery_terms || ''}
                onChange={(e) => handleInputChange('delivery_terms', e.target.value)}
                rows={3}
                readOnly={readonly}
                className={readonly ? "bg-gray-50" : ""}
              />
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">QUALITY REQUIREMENTS</h2>
          {readonly ? (
            <div className="border p-3 rounded bg-gray-50 min-h-[100px]">{formData.quality_requirements || 'N/A'}</div>
          ) : (
            <Textarea
              value={formData.quality_requirements || ''}
              onChange={(e) => handleInputChange('quality_requirements', e.target.value)}
              rows={3}
              readOnly={readonly}
              className={readonly ? "bg-gray-50" : ""}
            />
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">NOTES</h2>
          {readonly ? (
            <div className="border p-3 rounded bg-gray-50 min-h-[100px]">{formData.notes || 'N/A'}</div>
          ) : (
            <Textarea
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Enter any additional notes"
              rows={2}
              readOnly={readonly}
              className={readonly ? "bg-gray-50" : ""}
            />
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
          {readonly ? (
            <div className="inline-block px-3 py-1 rounded-full text-sm font-medium capitalize bg-gray-100">
              {formData.contract_status || 'draft'}
            </div>
          ) : (
            <Select 
              value={formData.contract_status || 'draft'} 
              onValueChange={(value) => handleInputChange('contract_status', value)}
              disabled={readonly}
            >
              <SelectTrigger className={`w-full max-w-xs ${readonly ? "bg-gray-50" : ""}`}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocalPurchaseOrderForm;
