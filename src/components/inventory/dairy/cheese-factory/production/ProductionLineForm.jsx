import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";
import { supabase } from "@/integrations/supabase/supabase";

// Import the hook for milk reception data
import { useMilkReception } from '../../milk-reception/hooks/useMilkReceptionForm';

const ProductionLineForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    batchNumber: '',
    productType: '',
    milkBatch: '',
    targetQuantity: '',
    actualQuantity: '',
    productionDate: '',
    expiryDate: '',
    qualityGrade: '',
    market: 'Local and International', // Pre-filled value
    productionLine: '',
    operator: '',
    supervisor: '',
    shiftDetails: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Use the milk reception hook to get available batches
  const { 
    milkReceptionData, 
    loading: milkReceptionLoading, 
    error: milkReceptionError,
    fetchMilkReceptionData 
  } = useMilkReception();

  useEffect(() => {
    fetchMilkReceptionData();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.batchNumber || !formData.productType || !formData.milkBatch) {
      showErrorToast(toast, "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('cheese_production_batches')
        .insert([{
          batch_number: formData.batchNumber,
          product_type: formData.productType,
          milk_batch_id: formData.milkBatch,
          target_quantity: parseFloat(formData.targetQuantity) || 0,
          actual_quantity: parseFloat(formData.actualQuantity) || 0,
          production_date: formData.productionDate,
          expiry_date: formData.expiryDate,
          quality_grade: formData.qualityGrade,
          market: formData.market,
          production_line: formData.productionLine,
          operator: formData.operator,
          supervisor: formData.supervisor,
          shift_details: formData.shiftDetails,
          notes: formData.notes,
          status: 'active'
        }]);

      if (error) throw error;

      showSuccessToast(toast, "Production batch created successfully!");
      
      // Reset form
      setFormData({
        batchNumber: '',
        productType: '',
        milkBatch: '',
        targetQuantity: '',
        actualQuantity: '',
        productionDate: '',
        expiryDate: '',
        qualityGrade: '',
        market: 'Local and International', // Keep pre-filled value
        productionLine: '',
        operator: '',
        supervisor: '',
        shiftDetails: '',
        notes: ''
      });
      
    } catch (error) {
      console.error('Error creating production batch:', error);
      showErrorToast(toast, `Error creating production batch: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transform milk reception data for the dropdown
  const availableMilkBatches = milkReceptionData?.map(record => ({
    id: record.id,
    label: `Batch ${record.batch_number || record.id} - ${record.supplier_name || 'Unknown Supplier'} (${record.quantity_received || 0}L)`,
    value: record.id.toString()
  })) || [];

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Production
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Production Line Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="batchNumber">Batch Number *</Label>
                <Input
                  id="batchNumber"
                  value={formData.batchNumber}
                  onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                  placeholder="Enter batch number"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="productType">Product Type *</Label>
                <Select 
                  value={formData.productType} 
                  onValueChange={(value) => handleInputChange('productType', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mozzarella">Mozzarella</SelectItem>
                    <SelectItem value="cheddar">Cheddar</SelectItem>
                    <SelectItem value="gouda">Gouda</SelectItem>
                    <SelectItem value="swiss">Swiss</SelectItem>
                    <SelectItem value="parmesan">Parmesan</SelectItem>
                    <SelectItem value="blue_cheese">Blue Cheese</SelectItem>
                    <SelectItem value="cream_cheese">Cream Cheese</SelectItem>
                    <SelectItem value="cottage_cheese">Cottage Cheese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="milkBatch">Select Milk Batch *</Label>
                {milkReceptionLoading ? (
                  <Input value="Loading batches..." disabled />
                ) : milkReceptionError ? (
                  <Input value="Error loading batches" disabled />
                ) : (
                  <Select 
                    value={formData.milkBatch} 
                    onValueChange={(value) => handleInputChange('milkBatch', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select milk batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMilkBatches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.value}>
                          {batch.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <div>
                <Label htmlFor="targetQuantity">Target Quantity (kg)</Label>
                <Input
                  id="targetQuantity"
                  type="number"
                  value={formData.targetQuantity}
                  onChange={(e) => handleInputChange('targetQuantity', e.target.value)}
                  placeholder="Enter target quantity"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="actualQuantity">Actual Quantity (kg)</Label>
                <Input
                  id="actualQuantity"
                  type="number"
                  value={formData.actualQuantity}
                  onChange={(e) => handleInputChange('actualQuantity', e.target.value)}
                  placeholder="Enter actual quantity"
                />
              </div>
              
              <div>
                <Label htmlFor="productionDate">Production Date</Label>
                <Input
                  id="productionDate"
                  type="date"
                  value={formData.productionDate}
                  onChange={(e) => handleInputChange('productionDate', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="qualityGrade">Quality Grade</Label>
                <Select 
                  value={formData.qualityGrade} 
                  onValueChange={(value) => handleInputChange('qualityGrade', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Grade A</SelectItem>
                    <SelectItem value="B">Grade B</SelectItem>
                    <SelectItem value="C">Grade C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Market field - Pre-filled and uneditable */}
            <div className="mb-4">
              <div>
                <Label htmlFor="market">Market</Label>
                <Input
                  id="market"
                  value={formData.market}
                  readOnly
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                  placeholder="Market selection"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Market is pre-selected for Local and International distribution
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productionLine">Production Line</Label>
                <Input
                  id="productionLine"
                  value={formData.productionLine}
                  onChange={(e) => handleInputChange('productionLine', e.target.value)}
                  placeholder="Enter production line"
                />
              </div>
              
              <div>
                <Label htmlFor="operator">Operator</Label>
                <Input
                  id="operator"
                  value={formData.operator}
                  onChange={(e) => handleInputChange('operator', e.target.value)}
                  placeholder="Enter operator name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supervisor">Supervisor</Label>
                <Input
                  id="supervisor"
                  value={formData.supervisor}
                  onChange={(e) => handleInputChange('supervisor', e.target.value)}
                  placeholder="Enter supervisor name"
                />
              </div>
              
              <div>
                <Label htmlFor="shiftDetails">Shift Details</Label>
                <Input
                  id="shiftDetails"
                  value={formData.shiftDetails}
                  onChange={(e) => handleInputChange('shiftDetails', e.target.value)}
                  placeholder="Enter shift details"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Enter any additional notes"
                rows={3}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Production Batch...' : 'Create Production Batch'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionLineForm;
