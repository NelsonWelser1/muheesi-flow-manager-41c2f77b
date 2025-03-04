
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

const MarketingCampaignForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    campaign_name: '',
    objectives: '',
    target_audience: '',
    start_date: null,
    end_date: null,
    budget: '',
    strategies: [],
    status: 'planning'
  });

  const [strategy, setStrategy] = useState('');
  const [kpi, setKpi] = useState('');
  const [kpiValue, setKpiValue] = useState('');
  const [kpis, setKpis] = useState([]);

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

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const addStrategy = () => {
    if (strategy.trim()) {
      setFormData(prev => ({
        ...prev,
        strategies: [...prev.strategies, strategy]
      }));
      setStrategy('');
    }
  };

  const removeStrategy = (index) => {
    setFormData(prev => ({
      ...prev,
      strategies: prev.strategies.filter((_, i) => i !== index)
    }));
  };

  const addKpi = () => {
    if (kpi.trim() && kpiValue.trim()) {
      setKpis(prev => [...prev, { metric: kpi, target: kpiValue }]);
      setKpi('');
      setKpiValue('');
    }
  };

  const removeKpi = (index) => {
    setKpis(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.campaign_name || !formData.objectives || 
        !formData.target_audience || !formData.start_date || 
        !formData.end_date || !formData.budget) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const campaign = {
        campaign_id: `CAMP-${uuidv4().slice(0, 8)}`,
        campaign_name: formData.campaign_name,
        objectives: formData.objectives,
        target_audience: formData.target_audience,
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget: parseFloat(formData.budget),
        strategies: formData.strategies,
        kpis: kpis,
        progress_status: formData.status
      };

      const { error } = await supabase.from('marketing_campaigns').insert([campaign]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Marketing campaign created successfully"
      });

      // Reset form
      setFormData({
        campaign_name: '',
        objectives: '',
        target_audience: '',
        start_date: null,
        end_date: null,
        budget: '',
        strategies: [],
        status: 'planning'
      });
      setKpis([]);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create marketing campaign",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create Marketing Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="campaign_name">Campaign Name*</Label>
                <Input
                  id="campaign_name"
                  name="campaign_name"
                  value={formData.campaign_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Campaign Objectives*</Label>
              <Textarea
                id="objectives"
                name="objectives"
                value={formData.objectives}
                onChange={handleInputChange}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_audience">Target Audience*</Label>
              <Textarea
                id="target_audience"
                name="target_audience"
                value={formData.target_audience}
                onChange={handleInputChange}
                required
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date*</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => handleDateChange('start_date', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date*</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) => handleDateChange('end_date', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)*</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Marketing Strategies</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a strategy"
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                />
                <Button type="button" onClick={addStrategy} className="flex-shrink-0">
                  Add
                </Button>
              </div>
              {formData.strategies.length > 0 && (
                <ul className="space-y-2">
                  {formData.strategies.map((strat, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{strat}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStrategy(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-4">
              <Label>Key Performance Indicators (KPIs)</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="KPI Metric"
                  value={kpi}
                  onChange={(e) => setKpi(e.target.value)}
                />
                <Input
                  placeholder="Target Value"
                  value={kpiValue}
                  onChange={(e) => setKpiValue(e.target.value)}
                />
                <Button type="button" onClick={addKpi} className="flex-shrink-0">
                  Add KPI
                </Button>
              </div>
              {kpis.length > 0 && (
                <ul className="space-y-2">
                  {kpis.map((item, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>
                        <strong>{item.metric}:</strong> {item.target}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKpi(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Create Campaign'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingCampaignForm;
