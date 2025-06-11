
import { useState, useEffect } from 'react';
import { useLocalPurchaseAgreements } from './useLocalPurchaseAgreements';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export const useLocalPurchaseAgreementForm = (existingAgreement = null) => {
  const { toast } = useToast();
  const { saveAgreement, updateAgreement, generateContractNumber, loading } = useLocalPurchaseAgreements();
  const isEditMode = !!existingAgreement;
  
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

  // Load existing agreement data if in edit mode
  useEffect(() => {
    if (existingAgreement) {
      setFormData(prevData => ({
        ...prevData,
        ...existingAgreement
      }));
    }
  }, [existingAgreement]);

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
    if (!validateForm()) return;
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      total_value: calculateTotal(),
    };
    
    try {
      let result;
      
      if (isEditMode) {
        // Update existing agreement
        result = await updateAgreement(existingAgreement.id, submissionData);
      } else {
        // Create new agreement
        result = await saveAgreement(submissionData);
      }
      
      if (result.success) {
        toast({
          title: "Success",
          description: isEditMode 
            ? "Agreement updated successfully" 
            : "Agreement saved successfully",
        });
        
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error saving agreement:", error);
      toast({
        title: "Error",
        description: `Failed to save agreement: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
      
      return { success: false, error };
    }
  };

  return {
    formData,
    loading,
    isEditMode,
    handleInputChange,
    handleItemChange,
    addNewItem,
    removeItem,
    calculateTotal,
    handleSubmit
  };
};
