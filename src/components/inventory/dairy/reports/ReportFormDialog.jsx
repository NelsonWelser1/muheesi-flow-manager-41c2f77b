
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitReport } from './hooks/useSubmitReport';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
  const { submitReport, isSubmitting } = useSubmitReport();

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
  };

  const handleSelectChange = (name, value) => {
    setReport(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setReport(prev => ({ ...prev, productionDate: newDate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="batchId">Batch ID</Label>
              <Input 
                id="batchId" 
                name="batchId" 
                value={report.batchId} 
                onChange={handleChange}
                required
              />
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
                required
              />
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
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Production Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                required
              />
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
                required
              />
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
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportFormDialog;
