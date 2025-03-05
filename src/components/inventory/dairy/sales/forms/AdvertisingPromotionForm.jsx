
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Bug } from "lucide-react";
import { useAdvertisingPromotion } from './hooks/useAdvertisingPromotion';

const AdvertisingPromotionForm = ({ onBack, onViewReports }) => {
  const { isSubmitting, submitPromotion, debugPromotions } = useAdvertisingPromotion();
  const [formData, setFormData] = useState({
    title: '',
    promotion_type: 'discount',
    material_type: 'digital',
    target_audience: '',
    objectives: '',
    start_date: '',
    end_date: '',
    budget: '',
    channels: { social: false, print: false, radio: false, tv: false, email: false },
    assets_urls: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChannelChange = (channel, checked) => {
    setFormData(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: checked
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert channels object to JSON for storage
    const submissionData = {
      ...formData,
      channels: JSON.stringify(formData.channels),
      assets_urls: JSON.stringify(formData.assets_urls)
    };
    
    const result = await submitPromotion(submissionData);
    
    if (result.success) {
      // Reset form on successful submission
      setFormData({
        title: '',
        promotion_type: 'discount',
        material_type: 'digital',
        target_audience: '',
        objectives: '',
        start_date: '',
        end_date: '',
        budget: '',
        channels: { social: false, print: false, radio: false, tv: false, email: false },
        assets_urls: []
      });
    }
  };

  // Debug function to print form data to console
  const handleDebug = () => {
    console.log("Current form state:", formData);
    debugPromotions();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <h2 className="text-xl font-semibold">Advertising & Promotion</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onViewReports} className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> View Reports
          </Button>
          <Button variant="ghost" onClick={handleDebug} className="flex items-center gap-2">
            <Bug className="h-4 w-4" /> Debug
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Advertising & Promotion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Promotion Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="promotion_type">Promotion Type</Label>
                  <Select
                    name="promotion_type"
                    value={formData.promotion_type}
                    onValueChange={(value) => handleSelectChange('promotion_type', value)}
                  >
                    <SelectTrigger id="promotion_type">
                      <SelectValue placeholder="Select promotion type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="bogo">Buy One Get One</SelectItem>
                      <SelectItem value="bundle">Bundle Offer</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                      <SelectItem value="loyalty">Loyalty Program</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="material_type">Material Type</Label>
                  <Select
                    name="material_type"
                    value={formData.material_type}
                    onValueChange={(value) => handleSelectChange('material_type', value)}
                  >
                    <SelectTrigger id="material_type">
                      <SelectValue placeholder="Select material type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="print">Print</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="mixed">Mixed Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="target_audience">Target Audience</Label>
                  <Input
                    id="target_audience"
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="objectives">Objectives</Label>
                  <Textarea
                    id="objectives"
                    name="objectives"
                    value={formData.objectives}
                    onChange={handleInputChange}
                    className="h-20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="e.g., $5000"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Distribution Channels</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.channels.social}
                        onChange={(e) => handleChannelChange('social', e.target.checked)}
                        className="checkbox"
                      />
                      <span>Social Media</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.channels.print}
                        onChange={(e) => handleChannelChange('print', e.target.checked)}
                        className="checkbox"
                      />
                      <span>Print</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.channels.radio}
                        onChange={(e) => handleChannelChange('radio', e.target.checked)}
                        className="checkbox"
                      />
                      <span>Radio</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.channels.tv}
                        onChange={(e) => handleChannelChange('tv', e.target.checked)}
                        className="checkbox"
                      />
                      <span>TV</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.channels.email}
                        onChange={(e) => handleChannelChange('email', e.target.checked)}
                        className="checkbox"
                      />
                      <span>Email</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Promotion'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertisingPromotionForm;
