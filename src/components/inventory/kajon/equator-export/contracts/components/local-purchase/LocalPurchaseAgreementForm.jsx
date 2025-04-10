
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Plus, Save, Calendar, ArrowLeft, Download } from "lucide-react";
import { format } from 'date-fns';
import { useLocalPurchaseAgreements } from '@/hooks/useLocalPurchaseAgreements';
import { exportContractToPDF, exportContractToJPG, exportContractToExcel } from '../../utils/contractExportUtils';
import { useLocalPurchaseAgreementForm } from '@/hooks/useLocalPurchaseAgreementForm';

const LocalPurchaseAgreementForm = ({ onBack, existingAgreement = null }) => {
  const { toast } = useToast();
  const contractRef = useRef(null);
  
  const {
    formData,
    loading,
    isEditMode,
    handleInputChange,
    handleItemChange,
    addNewItem,
    removeItem,
    calculateTotal,
    handleSubmit
  } = useLocalPurchaseAgreementForm(existingAgreement);
  
  const onSubmit = async () => {
    const result = await handleSubmit();
    if (result && result.success && !isEditMode) {
      onBack(); // Navigate back to list view on successful creation
    }
  };

  // Export functions
  const handleExportPDF = async () => {
    await exportContractToPDF(contractRef.current, `local-purchase-${formData.contract_number}`, toast);
  };

  const handleExportJPG = async () => {
    await exportContractToJPG(contractRef.current, `local-purchase-${formData.contract_number}`, toast);
  };

  const handleExportExcel = async () => {
    await exportContractToExcel(contractRef.current, formData, `local-purchase-${formData.contract_number}`, toast);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Agreements
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            className="flex items-center gap-1"
            onClick={onSubmit}
            disabled={loading}
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : isEditMode ? "Update Agreement" : "Save Agreement"}
          </Button>
          
          {/* Export Dropdown */}
          <div className="relative group">
            <Button variant="outline" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50 hidden group-hover:block">
              <div className="py-1">
                <button
                  onClick={handleExportPDF}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as PDF
                </button>
                <button
                  onClick={handleExportJPG}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as JPG
                </button>
                <button
                  onClick={handleExportExcel}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as Excel
                </button>
              </div>
            </div>
          </div>
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
                        value={item.description || ''}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Coffee beans, etc."
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <Input
                        value={item.variety || ''}
                        onChange={(e) => handleItemChange(index, 'variety', e.target.value)}
                        placeholder="Arabica, Robusta, etc."
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <Input
                        type="number"
                        min="0"
                        value={item.quantity || 0}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <Select 
                        value={item.unit || 'Kg'} 
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
                        value={item.unit_price || 0}
                        onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      {((item.quantity || 0) * (item.unit_price || 0)).toFixed(2)}
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
              value={formData.payment_terms || ''}
              onChange={(e) => handleInputChange('payment_terms', e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">DELIVERY TERMS</h2>
            <Textarea
              value={formData.delivery_terms || ''}
              onChange={(e) => handleInputChange('delivery_terms', e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">QUALITY REQUIREMENTS</h2>
          <Textarea
            value={formData.quality_requirements || ''}
            onChange={(e) => handleInputChange('quality_requirements', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">SPECIAL TERMS AND CONDITIONS</h2>
          <Textarea
            value={formData.special_terms || ''}
            onChange={(e) => handleInputChange('special_terms', e.target.value)}
            placeholder="Enter any special terms or conditions for this agreement"
            rows={3}
          />
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">NOTES</h2>
          <Textarea
            value={formData.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Enter any additional notes"
            rows={2}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">Contract Status</label>
          <Select 
            value={formData.contract_status || 'draft'} 
            onValueChange={(value) => handleInputChange('contract_status', value)}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
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
