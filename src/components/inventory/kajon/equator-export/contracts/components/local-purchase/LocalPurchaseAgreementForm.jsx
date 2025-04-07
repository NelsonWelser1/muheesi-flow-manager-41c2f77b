import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Plus, Save, Calendar, FileText } from "lucide-react";
import { format } from 'date-fns';
import { useLocalPurchaseAgreements } from '@/integrations/supabase/hooks/useLocalPurchaseAgreements';
import ContractExportButtons from '../export-buttons/ContractExportButtons';

const LocalPurchaseAgreementForm = ({ onBack }) => {
  const { toast } = useToast();
  const { saveAgreement, loading, generateContractNumber } = useLocalPurchaseAgreements();
  const contractRef = useRef(null);
  
  const [formData, setFormData] = useState({
    contract_number: generateContractNumber(),
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
      { id: 1, description: '', variety: '', quantity: 0, unit: 'Kg', unit_price: 0 }
    ],
    quality_requirements: 'Standard coffee quality as per Uganda Coffee Development Authority guidelines',
    special_terms: '',
    notes: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addNewItem = () => {
    const newId = Math.max(0, ...formData.items.map(item => item.id)) + 1;
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: newId, description: '', variety: '', quantity: 0, unit: 'Kg', unit_price: 0 }
      ]
    }));
  };

  const removeItem = (id) => {
    if (formData.items.length <= 1) {
      toast({
        title: "Cannot Remove",
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
    return formData.items.reduce(
      (total, item) => total + (parseFloat(item.quantity) * parseFloat(item.unit_price) || 0), 
      0
    );
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.supplier_name) {
      toast({
        title: "Missing Information",
        description: "Please provide supplier name",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.items.some(item => !item.description || !item.quantity || !item.unit_price)) {
      toast({
        title: "Missing Information",
        description: "Please complete all item details",
        variant: "destructive",
      });
      return;
    }
    
    // Save to database
    const result = await saveAgreement(formData);
    
    if (result.success) {
      // Reset form after successful save or keep fields for export
      // You might want to redirect or just keep the form as is
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          Back to Contracts
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            className="flex items-center gap-1"
            onClick={handleSubmit}
            disabled={loading}
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Agreement"}
          </Button>
          <ContractExportButtons
            templateRef={contractRef}
            contractData={formData}
            filename={`local-purchase-${formData.contract_number}`}
            showDropdown={false}
            disabled={loading}
          />
        </div>
      </div>
      
      <div ref={contractRef} className="print-container p-6 border rounded-md bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">LOCAL PURCHASE AGREEMENT</h1>
          <div className="text-gray-500">Contract #: {formData.contract_number}</div>
          <div className="text-gray-500">Date: {format(new Date(formData.agreement_date), 'MMMM dd, yyyy')}</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">BUYER</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-600">Company</label>
                <Input 
                  value={formData.buyer_name} 
                  onChange={(e) => handleInputChange('buyer_name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Address</label>
                <Input 
                  value={formData.buyer_address} 
                  onChange={(e) => handleInputChange('buyer_address', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Contact</label>
                <Input 
                  value={formData.buyer_contact} 
                  onChange={(e) => handleInputChange('buyer_contact', e.target.value)}
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
                  value={formData.supplier_name} 
                  onChange={(e) => handleInputChange('supplier_name', e.target.value)}
                  placeholder="Enter supplier name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Address</label>
                <Input 
                  value={formData.supplier_address} 
                  onChange={(e) => handleInputChange('supplier_address', e.target.value)}
                  placeholder="Enter supplier address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Contact</label>
                <Input 
                  value={formData.supplier_contact} 
                  onChange={(e) => handleInputChange('supplier_contact', e.target.value)}
                  placeholder="Enter supplier contact"
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
                  <th className="px-4 py-2 text-center border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 border">
                      <Input
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Coffee beans, etc."
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <Input
                        value={item.variety}
                        onChange={(e) => handleItemChange(index, 'variety', e.target.value)}
                        placeholder="Arabica, Robusta, etc."
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <Input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <Select 
                        value={item.unit} 
                        onValueChange={(value) => handleItemChange(index, 'unit', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kg">Kg</SelectItem>
                          <SelectItem value="Ton">Ton</SelectItem>
                          <SelectItem value="Bag">Bag</SelectItem>
                          <SelectItem value="Sack">Sack</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 border">
                      <Input
                        type="number"
                        min="0"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      {(item.quantity * item.unit_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-right font-bold">
                    TOTAL:
                  </td>
                  <td className="px-4 py-2 border font-bold">
                    {calculateTotal().toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={addNewItem}
                      title="Add item"
                    >
                      <Plus className="h-4 w-4 text-green-500" />
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">PAYMENT TERMS</h2>
            <Textarea
              value={formData.payment_terms}
              onChange={(e) => handleInputChange('payment_terms', e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">DELIVERY TERMS</h2>
            <Textarea
              value={formData.delivery_terms}
              onChange={(e) => handleInputChange('delivery_terms', e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">QUALITY REQUIREMENTS</h2>
          <Textarea
            value={formData.quality_requirements}
            onChange={(e) => handleInputChange('quality_requirements', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">SPECIAL TERMS AND CONDITIONS</h2>
          <Textarea
            value={formData.special_terms}
            onChange={(e) => handleInputChange('special_terms', e.target.value)}
            placeholder="Enter any special terms or conditions for this agreement"
            rows={3}
          />
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">NOTES</h2>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Enter any additional notes"
            rows={2}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 mb-6">
          <div className="border-t pt-4">
            <p className="font-semibold">For and on behalf of BUYER:</p>
            <div className="mt-6 h-10 border-b border-dashed"></div>
            <p className="text-sm text-gray-500">Authorized Signature, Date</p>
          </div>
          
          <div className="border-t pt-4">
            <p className="font-semibold">For and on behalf of SUPPLIER:</p>
            <div className="mt-6 h-10 border-b border-dashed"></div>
            <p className="text-sm text-gray-500">Authorized Signature, Date</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalPurchaseAgreementForm;
