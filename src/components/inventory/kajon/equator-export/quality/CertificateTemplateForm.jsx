
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar as CalendarIcon,
  Coffee,
  Wheat,
  Apple
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CertificateTemplateForm = ({ templateType, onCancel, onSave }) => {
  // Template type will be 'coffee', 'general', or 'fresh'
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    recipient: '',
    issueDate: new Date(),
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    description: '',
    // Coffee-specific fields
    coffeeType: templateType === 'coffee' ? 'arabica' : '',
    cuppingScore: templateType === 'coffee' ? '85' : '',
    processingMethod: templateType === 'coffee' ? 'washed' : '',
    // General produce fields
    produceType: templateType === 'general' ? 'grains' : '',
    gradeClassification: templateType === 'general' ? 'grade-1' : '',
    moistureContent: templateType === 'general' ? '12.5' : '',
    // Fresh produce fields
    freshProduceType: templateType === 'fresh' ? 'fruits' : '',
    shelfLife: templateType === 'fresh' ? '7' : '',
    storageConditions: templateType === 'fresh' ? 'refrigerated' : '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const getTemplateTitle = () => {
    switch(templateType) {
      case 'coffee':
        return 'Coffee Bean Certificate';
      case 'general':
        return 'General Produce Certificate';
      case 'fresh':
        return 'Fresh Produce Certificate';
      default:
        return 'Certificate';
    }
  };

  const getTemplateIcon = () => {
    switch(templateType) {
      case 'coffee':
        return <Coffee className="h-5 w-5 text-amber-600" />;
      case 'general':
        return <Wheat className="h-5 w-5 text-amber-600" />;
      case 'fresh':
        return <Apple className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        {getTemplateIcon()}
        <CardTitle>{getTemplateTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Certificate Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter certificate name"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issuer">Issuing Authority*</Label>
                <Input
                  id="issuer"
                  value={formData.issuer}
                  onChange={(e) => handleChange('issuer', e.target.value)}
                  placeholder="Enter issuing authority"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient*</Label>
                <Input
                  id="recipient"
                  value={formData.recipient}
                  onChange={(e) => handleChange('recipient', e.target.value)}
                  placeholder="Enter recipient"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Issue Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.issueDate ? format(formData.issueDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.issueDate}
                      onSelect={(date) => date && handleChange('issueDate', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Expiry Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expiryDate ? format(formData.expiryDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.expiryDate}
                      onSelect={(date) => date && handleChange('expiryDate', date)}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Template-specific Fields */}
          {templateType === 'coffee' && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium text-lg">Coffee Quality Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coffeeType">Coffee Type</Label>
                  <Select 
                    value={formData.coffeeType} 
                    onValueChange={(value) => handleChange('coffeeType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select coffee type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arabica">Arabica</SelectItem>
                      <SelectItem value="robusta">Robusta</SelectItem>
                      <SelectItem value="liberica">Liberica</SelectItem>
                      <SelectItem value="blend">Blend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuppingScore">Cupping Score</Label>
                  <div className="flex items-center">
                    <Input
                      id="cuppingScore"
                      value={formData.cuppingScore}
                      onChange={(e) => handleChange('cuppingScore', e.target.value)}
                      placeholder="0-100"
                      type="number"
                      min="0"
                      max="100"
                      className="flex-1"
                    />
                    <span className="ml-2">/100</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processingMethod">Processing Method</Label>
                  <Select 
                    value={formData.processingMethod} 
                    onValueChange={(value) => handleChange('processingMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="washed">Washed</SelectItem>
                      <SelectItem value="natural">Natural/Dry</SelectItem>
                      <SelectItem value="honey">Honey/Pulped Natural</SelectItem>
                      <SelectItem value="wet-hulled">Wet-Hulled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {templateType === 'general' && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium text-lg">General Produce Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="produceType">Produce Type</Label>
                  <Select 
                    value={formData.produceType} 
                    onValueChange={(value) => handleChange('produceType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select produce type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grains">Grains</SelectItem>
                      <SelectItem value="seeds">Seeds</SelectItem>
                      <SelectItem value="pulses">Pulses</SelectItem>
                      <SelectItem value="nuts">Nuts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradeClassification">Grade Classification</Label>
                  <Select 
                    value={formData.gradeClassification} 
                    onValueChange={(value) => handleChange('gradeClassification', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grade-1">Grade 1 (Premium)</SelectItem>
                      <SelectItem value="grade-2">Grade 2 (Standard)</SelectItem>
                      <SelectItem value="grade-3">Grade 3 (Commercial)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moistureContent">Moisture Content (%)</Label>
                  <div className="flex items-center">
                    <Input
                      id="moistureContent"
                      value={formData.moistureContent}
                      onChange={(e) => handleChange('moistureContent', e.target.value)}
                      placeholder="Enter percentage"
                      type="number"
                      step="0.1"
                      min="0"
                      className="flex-1"
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {templateType === 'fresh' && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium text-lg">Fresh Produce Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freshProduceType">Fresh Produce Type</Label>
                  <Select 
                    value={formData.freshProduceType} 
                    onValueChange={(value) => handleChange('freshProduceType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select produce type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="herbs">Herbs</SelectItem>
                      <SelectItem value="flowers">Flowers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shelfLife">Shelf Life (days)</Label>
                  <Input
                    id="shelfLife"
                    value={formData.shelfLife}
                    onChange={(e) => handleChange('shelfLife', e.target.value)}
                    placeholder="Enter days"
                    type="number"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storageConditions">Storage Conditions</Label>
                  <Select 
                    value={formData.storageConditions} 
                    onValueChange={(value) => handleChange('storageConditions', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room-temperature">Room Temperature</SelectItem>
                      <SelectItem value="refrigerated">Refrigerated</SelectItem>
                      <SelectItem value="frozen">Frozen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Additional Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter additional details about the certificate"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Save Certificate
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CertificateTemplateForm;
