import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ComplianceQualityControl = () => {
  const [formData, setFormData] = useState({
    productName: '',
    batchNumber: '',
    qualityScore: '',
    complianceStatus: '',
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Quality control report:", formData);
    // Implement quality control report submission logic
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Compliance & Quality Control Officer</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="productName">Product Name</Label>
          <Input id="productName" name="productName" value={formData.productName} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="batchNumber">Batch Number</Label>
          <Input id="batchNumber" name="batchNumber" value={formData.batchNumber} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="qualityScore">Quality Score (0-100)</Label>
          <Input id="qualityScore" name="qualityScore" type="number" min="0" max="100" value={formData.qualityScore} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="complianceStatus">Compliance Status</Label>
          <Select name="complianceStatus" onValueChange={(value) => handleInputChange({ target: { name: 'complianceStatus', value } })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select compliance status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compliant">Compliant</SelectItem>
              <SelectItem value="non-compliant">Non-Compliant</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} required />
        </div>
        <Button type="submit">Submit Quality Control Report</Button>
      </form>
    </div>
  );
};

export default ComplianceQualityControl;