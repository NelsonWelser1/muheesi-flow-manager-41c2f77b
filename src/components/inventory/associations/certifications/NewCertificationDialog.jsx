
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Save } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useCertifications } from "@/integrations/supabase/hooks/associations/useCertifications";

const certificationTypes = [
  "Organic Certification",
  "Fair Trade Certification",
  "Rainforest Alliance",
  "UTZ Certified",
  "Bird Friendly",
  "4C (Common Code for the Coffee Community)",
  "Carbon Neutral",
  "Direct Trade",
  "Shade Grown"
];

const certificationIssuers = [
  "ECOCERT",
  "FLO-CERT",
  "Rainforest Alliance",
  "UTZ",
  "Smithsonian Bird Center",
  "4C Association",
  "SCS Global Services",
  "Other"
];

const NewCertificationDialog = ({ open, onOpenChange, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    status: 'in-process',
    issueDate: null,
    expiryDate: null,
    notes: '',
    requirements: [
      { id: 1, name: '', status: 'pending' }
    ]
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { createCertification } = useCertifications();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleRequirementChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map(req => 
        req.id === id ? { ...req, [field]: value } : req
      )
    }));
  };

  const addRequirement = () => {
    const newId = Math.max(0, ...formData.requirements.map(r => r.id)) + 1;
    setFormData(prev => ({
      ...prev,
      requirements: [
        ...prev.requirements,
        { id: newId, name: '', status: 'pending' }
      ]
    }));
  };

  const removeRequirement = (id) => {
    if (formData.requirements.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req.id !== id)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = "Certification name is required";
    if (!formData.issuer) newErrors.issuer = "Issuer is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    
    const emptyRequirements = formData.requirements.some(req => !req.name.trim());
    if (emptyRequirements) newErrors.requirements = "All requirements must have a name";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      status: 'in-process',
      issueDate: null,
      expiryDate: null,
      notes: '',
      requirements: [
        { id: 1, name: '', status: 'pending' }
      ]
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      const result = await createCertification(formData);
      
      if (result.success) {
        // Call the parent component's onSave if provided
        if (onSave) {
          onSave(result.data);
        }
        
        // Close dialog and reset form
        resetForm();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error saving certification:", error);
      toast({
        title: "Error",
        description: "Failed to save certification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for New Certification</DialogTitle>
          <DialogDescription>
            Fill in the certification details to apply for a new certification.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="certName">Certification Name</Label>
              <Select 
                value={formData.name} 
                onValueChange={(value) => handleInputChange('name', value)}
              >
                <SelectTrigger id="certName" className={errors.name ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select certification type" />
                </SelectTrigger>
                <SelectContent>
                  {certificationTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issuer">Certification Issuer</Label>
              <Select 
                value={formData.issuer} 
                onValueChange={(value) => handleInputChange('issuer', value)}
              >
                <SelectTrigger id="issuer" className={errors.issuer ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select issuer" />
                </SelectTrigger>
                <SelectContent>
                  {certificationIssuers.map(issuer => (
                    <SelectItem key={issuer} value={issuer}>{issuer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.issuer && <p className="text-sm text-red-500">{errors.issuer}</p>}
            </div>

            <div className="space-y-2">
              <Label>Issue Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.issueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.issueDate ? format(formData.issueDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.issueDate}
                    onSelect={(date) => handleInputChange('issueDate', date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expiryDate && "text-muted-foreground",
                      errors.expiryDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? format(formData.expiryDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date) => handleInputChange('expiryDate', date)}
                    disabled={date => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea 
              placeholder="Enter any notes or additional information about this certification..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Certification Requirements</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addRequirement}
              >
                Add Requirement
              </Button>
            </div>
            
            {errors.requirements && (
              <p className="text-sm text-red-500">{errors.requirements}</p>
            )}
            
            <div className="space-y-3">
              {formData.requirements.map((req, index) => (
                <div key={req.id} className="flex items-start gap-2">
                  <Input
                    placeholder="Requirement name (e.g., No chemical inputs)"
                    value={req.name}
                    onChange={(e) => handleRequirementChange(req.id, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <Select 
                    value={req.status} 
                    onValueChange={(value) => handleRequirementChange(req.id, 'status', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complete">Complete</SelectItem>
                      <SelectItem value="in-process">In Process</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="icon"
                    onClick={() => removeRequirement(req.id)}
                    disabled={formData.requirements.length <= 1}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              resetForm();
              onOpenChange(false);
            }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Certification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewCertificationDialog;
