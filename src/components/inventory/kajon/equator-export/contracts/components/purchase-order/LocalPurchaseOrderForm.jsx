import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, Plus, Trash, Save, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useLocalPurchaseOrders } from '@/hooks/useLocalPurchaseOrders';

const LocalPurchaseOrderForm = ({ onBack, existingOrder, readonly = false }) => {
  const { toast } = useToast();
  const { saveOrder, updateOrder, generateOrderNumber } = useLocalPurchaseOrders();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      contract_number: existingOrder?.contract_number || generateOrderNumber(),
      agreement_date: existingOrder?.agreement_date || new Date().toISOString().split('T')[0],
      buyer_name: existingOrder?.buyer_name || 'KAJON Coffee Limited',
      buyer_address: existingOrder?.buyer_address || 'Kanoni, Kazo District, Uganda',
      buyer_contact: existingOrder?.buyer_contact || '+256 776 670680',
      supplier_name: existingOrder?.supplier_name || '',
      supplier_address: existingOrder?.supplier_address || '',
      supplier_contact: existingOrder?.supplier_contact || '',
      payment_terms: existingOrder?.payment_terms || 'Net 30',
      delivery_terms: existingOrder?.delivery_terms || '',
      quality_requirements: existingOrder?.quality_requirements || '',
      special_terms: existingOrder?.special_terms || '',
      notes: existingOrder?.notes || '',
      contract_status: existingOrder?.contract_status || 'draft'
    }
  });

  useEffect(() => {
    if (existingOrder) {
      // Reset form with existing order data
      reset({
        contract_number: existingOrder.contract_number,
        agreement_date: existingOrder.agreement_date,
        buyer_name: existingOrder.buyer_name,
        buyer_address: existingOrder.buyer_address,
        buyer_contact: existingOrder.buyer_contact,
        supplier_name: existingOrder.supplier_name,
        supplier_address: existingOrder.supplier_address,
        supplier_contact: existingOrder.supplier_contact,
        payment_terms: existingOrder.payment_terms,
        delivery_terms: existingOrder.delivery_terms,
        quality_requirements: existingOrder.quality_requirements,
        special_terms: existingOrder.special_terms,
        notes: existingOrder.notes,
        contract_status: existingOrder.contract_status || 'draft'
      });
      
      // Set items if any
      if (existingOrder.items && Array.isArray(existingOrder.items)) {
        setItems(existingOrder.items);
      } else {
        setItems([]);
      }
    } else {
      // Default values for new purchase order
      reset({
        contract_number: generateOrderNumber(),
        agreement_date: new Date().toISOString().split('T')[0],
        buyer_name: 'KAJON Coffee Limited',
        buyer_address: 'Kanoni, Kazo District, Uganda',
        buyer_contact: '+256 776 670680',
        supplier_name: '',
        supplier_address: '',
        supplier_contact: '',
        payment_terms: 'Net 30',
        delivery_terms: '',
        quality_requirements: '',
        special_terms: '',
        notes: '',
        contract_status: 'draft'
      });
      setItems([]);
    }
  }, [existingOrder, reset, generateOrderNumber]);

  const addItem = () => {
    setItems([...items, { 
      description: '',
      quantity: 0,
      unit: 'kg',
      unit_price: 0,
      total: 0
    }]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    
    // Update the total price
    if (field === 'quantity' || field === 'unit_price') {
      item.total = Number(item.quantity || 0) * Number(item.unit_price || 0);
    }
    
    newItems[index] = item;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.total || 0), 0);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Add items to the data
      const orderData = {
        ...data,
        items: items,
        total_value: calculateTotal()
      };
      
      // If this is an existing order, update it
      if (existingOrder) {
        const result = await updateOrder(existingOrder.id, orderData);
        if (result.success) {
          toast({
            title: "Success",
            description: `Purchase order "${data.contract_number}" updated successfully`,
          });
          onBack();
        }
      } else {
        // Otherwise create a new order
        const result = await saveOrder(orderData);
        if (result.success) {
          toast({
            title: "Success",
            description: `Purchase order "${data.contract_number}" created successfully`,
          });
          onBack();
        }
      }
    } catch (error) {
      console.error("Error saving purchase order:", error);
      toast({
        title: "Error",
        description: "Failed to save purchase order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <CardTitle>
          {readonly ? 'View Purchase Order' : existingOrder ? 'Edit Purchase Order' : 'New Purchase Order'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Purchase Order Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="contract_number">Order Number</Label>
                <Input 
                  id="contract_number" 
                  {...register("contract_number", { required: "Order number is required" })}
                  readOnly
                  disabled={readonly}
                />
                {errors.contract_number && (
                  <p className="text-sm text-red-500">{errors.contract_number.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agreement_date">Date</Label>
                <Input 
                  id="agreement_date" 
                  type="date" 
                  {...register("agreement_date", { required: "Date is required" })}
                  disabled={readonly}
                />
                {errors.agreement_date && (
                  <p className="text-sm text-red-500">{errors.agreement_date.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contract_status">Status</Label>
                <Select 
                  defaultValue={watch("contract_status")} 
                  onValueChange={(value) => setValue("contract_status", value)}
                  disabled={readonly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("contract_status")} />
              </div>
            </div>
            
            <div className="md:border-l md:pl-4 space-y-4">
              <h3 className="text-lg font-semibold">Buyer Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="buyer_name">Buyer Name</Label>
                <Input 
                  id="buyer_name" 
                  {...register("buyer_name", { required: "Buyer name is required" })}
                  disabled={readonly}
                />
                {errors.buyer_name && (
                  <p className="text-sm text-red-500">{errors.buyer_name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buyer_address">Buyer Address</Label>
                <Input 
                  id="buyer_address" 
                  {...register("buyer_address")}
                  disabled={readonly}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buyer_contact">Buyer Contact</Label>
                <Input 
                  id="buyer_contact" 
                  {...register("buyer_contact")}
                  disabled={readonly}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Supplier Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="supplier_name">Supplier Name</Label>
                <Input 
                  id="supplier_name" 
                  {...register("supplier_name", { required: "Supplier name is required" })}
                  disabled={readonly}
                />
                {errors.supplier_name && (
                  <p className="text-sm text-red-500">{errors.supplier_name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier_address">Supplier Address</Label>
                <Input 
                  id="supplier_address" 
                  {...register("supplier_address")}
                  disabled={readonly}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier_contact">Supplier Contact</Label>
                <Input 
                  id="supplier_contact" 
                  {...register("supplier_contact")}
                  disabled={readonly}
                />
              </div>
            </div>
            
            <div className="md:border-l md:pl-4 space-y-4">
              <h3 className="text-lg font-semibold">Terms & Conditions</h3>
              
              <div className="space-y-2">
                <Label htmlFor="payment_terms">Payment Terms</Label>
                <Input 
                  id="payment_terms" 
                  {...register("payment_terms")}
                  disabled={readonly}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery_terms">Delivery Terms</Label>
                <Input 
                  id="delivery_terms" 
                  {...register("delivery_terms")}
                  disabled={readonly}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quality_requirements">Quality Requirements</Label>
                <Input 
                  id="quality_requirements" 
                  {...register("quality_requirements")}
                  disabled={readonly}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Order Items</h3>
              {!readonly && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addItem}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Description</th>
                    <th className="text-center p-2">Quantity</th>
                    <th className="text-center p-2">Unit</th>
                    <th className="text-center p-2">Unit Price</th>
                    <th className="text-right p-2">Total</th>
                    {!readonly && <th className="w-10"></th>}
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={readonly ? 5 : 6} className="text-center py-4 text-gray-500">
                        No items added to this purchase order
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">
                          <Input 
                            value={item.description || ''} 
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            disabled={readonly}
                            placeholder="Item description"
                          />
                        </td>
                        <td className="p-2">
                          <Input 
                            type="number" 
                            value={item.quantity || ''} 
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                            disabled={readonly}
                            className="text-center"
                            placeholder="0"
                          />
                        </td>
                        <td className="p-2">
                          <Select 
                            value={item.unit || 'kg'} 
                            onValueChange={(value) => updateItem(index, 'unit', value)}
                            disabled={readonly}
                          >
                            <SelectTrigger className="text-center">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="ton">ton</SelectItem>
                              <SelectItem value="bag">bag</SelectItem>
                              <SelectItem value="unit">unit</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2">
                          <Input 
                            type="number" 
                            value={item.unit_price || ''} 
                            onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                            disabled={readonly}
                            className="text-center"
                            placeholder="0.00"
                          />
                        </td>
                        <td className="p-2 text-right font-medium">
                          {(item.total || 0).toLocaleString()}
                        </td>
                        {!readonly && (
                          <td className="p-2">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              onClick={() => removeItem(index)}
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                  <tr className="font-semibold">
                    <td colSpan={readonly ? 4 : 5} className="text-right p-2">
                      Total:
                    </td>
                    <td className="text-right p-2">{calculateTotal().toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              {...register("notes")}
              disabled={readonly}
              rows={3}
            />
          </div>
          
          {!readonly && (
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Purchase Order
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
      
      {readonly && (
        <CardFooter className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default LocalPurchaseOrderForm;
