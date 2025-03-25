
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Eye } from 'lucide-react';
import RequisitionRecordsView from './requisitions/RequisitionRecordsView';
import { useRequisitions } from '@/hooks/useRequisitions';

const MakeRequisitions = () => {
  const [requisitionType, setRequisitionType] = useState('tools');
  const [showRecords, setShowRecords] = useState(false);
  const [formData, setFormData] = useState({
    requesterName: '',
    department: '',
    requisitionType: 'tools',
    tools: '',
    repairs: '',
    justification: '',
    urgencyLevel: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { submitRequisition } = useRequisitions();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    if (id === 'requisitionType') {
      setRequisitionType(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Check for empty required fields
      const requiredFields = ['requesterName', 'department', 'justification', 'urgencyLevel'];
      const emptyFields = requiredFields.filter(field => !formData[field]);
      
      if (emptyFields.length > 0) {
        toast.error(`Please fill in all required fields`);
        return;
      }
      
      // Submit the form data
      await submitRequisition(formData);
      
      // Reset form on success
      setFormData({
        requesterName: '',
        department: '',
        requisitionType: 'tools',
        tools: '',
        repairs: '',
        justification: '',
        urgencyLevel: ''
      });
      setRequisitionType('tools');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Error: ${error.message || 'Failed to submit requisition'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showRecords) {
    return <RequisitionRecordsView onBack={() => setShowRecords(false)} />;
  }

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Make Requisitions</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowRecords(true)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Records
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tools, Machinery, and Repair Requisitions</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="requesterName">Requester Name</Label>
              <Input 
                id="requesterName" 
                placeholder="Enter your name" 
                value={formData.requesterName}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                placeholder="Enter your department" 
                value={formData.department}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div>
              <Label htmlFor="requisitionType">Requisition Type</Label>
              <Select 
                value={requisitionType} 
                onValueChange={(value) => handleSelectChange('requisitionType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select requisition type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tools">Tools and Machinery</SelectItem>
                  <SelectItem value="repairs">Repair Requisition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {requisitionType === 'tools' && (
              <div>
                <Label htmlFor="tools">Tools and Machinery</Label>
                <Textarea 
                  id="tools" 
                  placeholder="List any tools or machinery needed" 
                  value={formData.tools}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {requisitionType === 'repairs' && (
              <div>
                <Label htmlFor="repairs">Repair Requisitions</Label>
                <Textarea 
                  id="repairs" 
                  placeholder="Describe any repairs needed" 
                  value={formData.repairs}
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div>
              <Label htmlFor="justification">Justification</Label>
              <Textarea 
                id="justification" 
                placeholder="Provide justification for the requisition" 
                value={formData.justification}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div>
              <Label htmlFor="urgencyLevel">Urgency Level</Label>
              <Select 
                value={formData.urgencyLevel}
                onValueChange={(value) => handleSelectChange('urgencyLevel', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
            >
              {isSubmitting ? "Submitting..." : "Submit Requisition"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MakeRequisitions;
