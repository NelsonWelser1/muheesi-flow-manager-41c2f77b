
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useProductionReports } from './hooks/useProductionReports';

const ReportFormDialog = ({ open, onOpenChange, onReportSubmitted }) => {
  const [report, setReport] = useState({
    productType: '',
    batchId: `BATCH-${Date.now().toString().slice(-6)}`,
    rawMaterial: '',
    finishedProduct: '',
    productionDate: new Date(),
    efficiency: '',
    qualityScore: '',
    notes: ''
  });
  const [date, setDate] = useState(new Date());
  const { submitReport, isSubmitting } = useProductionReports();
  const [validationErrors, setValidationErrors] = useState({});

  const productTypes = [
    'Fresh Milk',
    'Yogurt',
    'Cheese',
    'Butter',
    'Cream',
    'Ghee',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectChange = (name, value) => {
    setReport(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setReport(prev => ({ ...prev, productionDate: newDate }));
    
    // Clear validation error for production date
    if (validationErrors.productionDate) {
      setValidationErrors(prev => ({ ...prev, productionDate: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!report.productType) errors.productType = 'Product type is required';
    if (!report.batchId) errors.batchId = 'Batch ID is required';
    if (!report.rawMaterial) errors.rawMaterial = 'Raw material amount is required';
    if (!report.finishedProduct) errors.finishedProduct = 'Finished product amount is required';
    if (!report.productionDate) errors.productionDate = 'Production date is required';
    
    // Additional validation for numeric fields
    if (report.rawMaterial && isNaN(parseFloat(report.rawMaterial))) {
      errors.rawMaterial = 'Raw material must be a valid number';
    }
    
    if (report.finishedProduct && isNaN(parseFloat(report.finishedProduct))) {
      errors.finishedProduct = 'Finished product must be a valid number';
    }
    
    if (report.efficiency && (isNaN(parseInt(report.efficiency)) || parseInt(report.efficiency) < 0 || parseInt(report.efficiency) > 100)) {
      errors.efficiency = 'Efficiency must be a number between 0 and 100';
    }
    
    if (report.qualityScore && (isNaN(parseInt(report.qualityScore)) || parseInt(report.qualityScore) < 0 || parseInt(report.qualityScore) > 100)) {
      errors.qualityScore = 'Quality score must be a number between 0 and 100';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log form data for debugging
    console.log('Form data to be submitted:', report);
    
    // Validate form
    if (!validateForm()) {
      console.log('Validation errors:', validationErrors);
      return;
    }
    
    const result = await submitReport(report);
    
    if (result.success) {
      // Reset form
      setReport({
        productType: '',
        batchId: `BATCH-${Date.now().toString().slice(-6)}`,
        rawMaterial: '',
        finishedProduct: '',
        productionDate: new Date(),
        efficiency: '',
        qualityScore: '',
        notes: ''
      });
      
      // Notify parent component
      if (onReportSubmitted) {
        onReportSubmitted();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>New Production Report</DialogTitle>
          <DialogDescription>
            Enter details about the production batch to add a new report.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Select 
                value={report.productType} 
                onValueChange={(value) => handleSelectChange('productType', value)}
                required
              >
                <SelectTrigger className={validationErrors.productType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.productType && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.productType}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="batchId">Batch ID</Label>
              <Input 
                id="batchId" 
                name="batchId" 
                value={report.batchId} 
                onChange={handleChange}
                className={validationErrors.batchId ? "border-red-500" : ""}
                required
              />
              {validationErrors.batchId && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.batchId}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rawMaterial">Raw Material Used (kg/L)</Label>
              <Input 
                id="rawMaterial" 
                name="rawMaterial" 
                type="number" 
                min="0" 
                step="0.01" 
                value={report.rawMaterial} 
                onChange={handleChange}
                className={validationErrors.rawMaterial ? "border-red-500" : ""}
                required
              />
              {validationErrors.rawMaterial && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.rawMaterial}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="finishedProduct">Finished Product (kg/L)</Label>
              <Input 
                id="finishedProduct" 
                name="finishedProduct" 
                type="number" 
                min="0" 
                step="0.01" 
                value={report.finishedProduct} 
                onChange={handleChange}
                className={validationErrors.finishedProduct ? "border-red-500" : ""}
                required
              />
              {validationErrors.finishedProduct && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.finishedProduct}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Production Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`w-full justify-start text-left font-normal ${validationErrors.productionDate ? "border-red-500" : ""}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {validationErrors.productionDate && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.productionDate}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="efficiency">Efficiency (%)</Label>
              <Input 
                id="efficiency" 
                name="efficiency" 
                type="number" 
                min="0" 
                max="100" 
                value={report.efficiency} 
                onChange={handleChange}
                className={validationErrors.efficiency ? "border-red-500" : ""}
              />
              {validationErrors.efficiency && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.efficiency}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="qualityScore">Quality Score (0-100)</Label>
              <Input 
                id="qualityScore" 
                name="qualityScore" 
                type="number" 
                min="0" 
                max="100" 
                value={report.qualityScore} 
                onChange={handleChange}
                className={validationErrors.qualityScore ? "border-red-500" : ""}
              />
              {validationErrors.qualityScore && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.qualityScore}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              placeholder="Enter any additional details about this production run." 
              value={report.notes} 
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportFormDialog;
