
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, X, Save, Calendar, Coffee, Wheat, Apple } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const CertificateTemplateForm = ({ templateType, onCancel, onSave }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    issuer: 'KAJON Coffee Limited',
    issuanceDate: format(new Date(), 'yyyy-MM-dd'),
    expiryDate: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-MM-dd'),
    recipient: '',
    recipientAddress: '',
    certificateNumber: `CRT-${Math.floor(10000 + Math.random() * 90000)}`,
    inspectionDate: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    status: 'active'
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.recipient) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
  };
  
  // Render title and icon based on template type
  const getTemplateDetails = () => {
    switch (templateType) {
      case 'coffee':
        return {
          title: 'Coffee Bean Certificate',
          icon: <Coffee className="h-5 w-5 mr-2 text-amber-600" />
        };
      case 'general':
        return {
          title: 'General Produce Certificate',
          icon: <Wheat className="h-5 w-5 mr-2 text-amber-600" />
        };
      case 'fresh':
        return {
          title: 'Fresh Produce Certificate',
          icon: <Apple className="h-5 w-5 mr-2 text-green-600" />
        };
      default:
        return {
          title: 'Quality Certificate',
          icon: null
        };
    }
  };

  const templateDetails = getTemplateDetails();

  // Custom fields for different certificate types
  const renderCustomFields = () => {
    switch (templateType) {
      case 'coffee':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="coffeeGrade">Coffee Grade</Label>
              <Select
                value={formData.coffeeGrade || 'specialty'}
                onValueChange={(value) => handleSelectChange('coffeeGrade', value)}
              >
                <SelectTrigger id="coffeeGrade">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="specialty">Specialty</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuppingScore">Cupping Score</Label>
              <Input
                id="cuppingScore"
                name="cuppingScore"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.cuppingScore || ''}
                onChange={handleInputChange}
                placeholder="Enter cupping score"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variety">Coffee Variety</Label>
              <Input
                id="variety"
                name="variety"
                value={formData.variety || ''}
                onChange={handleInputChange}
                placeholder="Enter coffee variety"
              />
            </div>
          </>
        );
      case 'general':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="produceType">Produce Type</Label>
              <Input
                id="produceType"
                name="produceType"
                value={formData.produceType || ''}
                onChange={handleInputChange}
                placeholder="Enter produce type"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin">Place of Origin</Label>
              <Input
                id="origin"
                name="origin"
                value={formData.origin || ''}
                onChange={handleInputChange}
                placeholder="Enter place of origin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purityLevel">Purity Level (%)</Label>
              <Input
                id="purityLevel"
                name="purityLevel"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.purityLevel || ''}
                onChange={handleInputChange}
                placeholder="Enter purity level"
              />
            </div>
          </>
        );
      case 'fresh':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="harvestDate">Harvest Date</Label>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 absolute ml-3" />
                <Input
                  id="harvestDate"
                  name="harvestDate"
                  type="date"
                  value={formData.harvestDate || ''}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="freshnessPeriod">Freshness Period (days)</Label>
              <Input
                id="freshnessPeriod"
                name="freshnessPeriod"
                type="number"
                min="1"
                value={formData.freshnessPeriod || ''}
                onChange={handleInputChange}
                placeholder="Enter freshness period"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storageConditions">Storage Conditions</Label>
              <Select
                value={formData.storageConditions || 'ambient'}
                onValueChange={(value) => handleSelectChange('storageConditions', value)}
              >
                <SelectTrigger id="storageConditions">
                  <SelectValue placeholder="Select storage conditions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refrigerated">Refrigerated</SelectItem>
                  <SelectItem value="frozen">Frozen</SelectItem>
                  <SelectItem value="ambient">Ambient</SelectItem>
                  <SelectItem value="controlled">Controlled Atmosphere</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          {templateDetails.icon}
          {templateDetails.title}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Certificate Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter certificate name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="certificateNumber">Certificate Number</Label>
              <Input
                id="certificateNumber"
                name="certificateNumber"
                value={formData.certificateNumber}
                onChange={handleInputChange}
                placeholder="Enter certificate number"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuer">Issuer</Label>
              <Input
                id="issuer"
                name="issuer"
                value={formData.issuer}
                onChange={handleInputChange}
                placeholder="Enter issuer name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient *</Label>
              <Input
                id="recipient"
                name="recipient"
                value={formData.recipient}
                onChange={handleInputChange}
                placeholder="Enter recipient name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuanceDate">Issuance Date</Label>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 absolute ml-3" />
                <Input
                  id="issuanceDate"
                  name="issuanceDate"
                  type="date"
                  value={formData.issuanceDate}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 absolute ml-3" />
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Custom fields based on template type */}
            {renderCustomFields()}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="recipientAddress">Recipient Address</Label>
              <Textarea
                id="recipientAddress"
                name="recipientAddress"
                value={formData.recipientAddress}
                onChange={handleInputChange}
                placeholder="Enter recipient address"
                rows={2}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter additional notes"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Save Certificate
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CertificateTemplateForm;
