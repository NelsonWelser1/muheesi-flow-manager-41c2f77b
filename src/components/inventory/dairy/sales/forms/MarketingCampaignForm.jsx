
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Search, Calendar, Target, Users, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import MarketingCampaignsDisplay from './displays/MarketingCampaignsDisplay';

const MarketingCampaignForm = ({ onBack }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDisplay, setShowDisplay] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignId, setCampaignId] = useState('');
  const [strategies, setStrategies] = useState([
    { id: 1, name: '', description: '', status: false }
  ]);
  const [kpis, setKpis] = useState([
    { id: 1, name: '', target: '', unit: '', status: false }
  ]);

  // Generate a unique campaign ID on component mount
  useEffect(() => {
    const timestamp = format(new Date(), 'yyyyMMddHHmmss');
    const uniqueId = `CAMP-${timestamp}-${Math.floor(Math.random() * 1000)}`;
    setCampaignId(uniqueId);
    setValue('campaign_id', uniqueId);
  }, [setValue]);

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '';
    // Remove any non-numeric characters except decimal point
    const numericValue = value.toString().replace(/[^0-9.]/g, '');
    const number = parseFloat(numericValue);
    if (isNaN(number)) return '';
    
    // Format with commas
    const parts = number.toFixed(2).toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return `UGX ${parts.join('.')}`;
  };

  // Parse currency string back to number
  const parseCurrency = (value) => {
    if (!value) return '';
    return value.toString().replace(/[^0-9.]/g, '');
  };

  // Handle budget input formatting
  const handleBudgetChange = (e) => {
    const input = e.target.value;
    const numericValue = parseCurrency(input);
    if (numericValue === '' || !isNaN(numericValue)) {
      setValue('budget', formatCurrency(numericValue));
    }
  };

  // Add strategy
  const handleAddStrategy = () => {
    setStrategies([
      ...strategies,
      {
        id: strategies.length + 1,
        name: '',
        description: '',
        status: false
      }
    ]);
  };

  // Update strategy
  const handleStrategyChange = (id, field, value) => {
    const updatedStrategies = strategies.map(strategy => {
      if (strategy.id === id) {
        return { ...strategy, [field]: value };
      }
      return strategy;
    });
    setStrategies(updatedStrategies);
  };

  // Add KPI
  const handleAddKpi = () => {
    setKpis([
      ...kpis,
      {
        id: kpis.length + 1,
        name: '',
        target: '',
        unit: '',
        status: false
      }
    ]);
  };

  // Update KPI
  const handleKpiChange = (id, field, value) => {
    const updatedKpis = kpis.map(kpi => {
      if (kpi.id === id) {
        return { ...kpi, [field]: value };
      }
      return kpi;
    });
    setKpis(updatedKpis);
  };

  // Fetch campaigns on component mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('marketing_campaigns')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          console.log('Campaigns fetched:', data);
          setCampaigns(data);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast({
          title: "Error",
          description: "Failed to load campaigns: " + error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [toast]);

  // Handle form submission
  const onSubmit = async (data) => {
    setSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Validate strategies and KPIs
      if (strategies.length === 0 || strategies.some(s => !s.name || !s.description)) {
        throw new Error("Please fill in all strategy details");
      }
      
      if (kpis.length === 0 || kpis.some(k => !k.name || !k.target || !k.unit)) {
        throw new Error("Please fill in all KPI details");
      }
      
      // Prepare data for submission
      const campaign = {
        campaign_id: data.campaign_id,
        campaign_name: data.campaign_name,
        objectives: data.objectives,
        target_audience: data.target_audience,
        start_date: data.start_date,
        end_date: data.end_date,
        budget: parseCurrency(data.budget),
        strategies: strategies,
        kpis: kpis,
        progress_status: "Planned",
        created_by: user?.id || 'anonymous',
        created_at: new Date().toISOString(),
      };
      
      // Insert into marketing_campaigns table
      const { error } = await supabase
        .from('marketing_campaigns')
        .insert([campaign]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Marketing campaign saved successfully",
      });
      
      // Reset form and state
      reset();
      setStrategies([{ id: 1, name: '', description: '', status: false }]);
      setKpis([{ id: 1, name: '', target: '', unit: '', status: false }]);
      
      // Generate new campaign ID
      const timestamp = format(new Date(), 'yyyyMMddHHmmss');
      const uniqueId = `CAMP-${timestamp}-${Math.floor(Math.random() * 1000)}`;
      setCampaignId(uniqueId);
      setValue('campaign_id', uniqueId);
      
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        title: "Error",
        description: "Failed to save campaign: " + error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (showDisplay) {
    return <MarketingCampaignsDisplay onBack={() => setShowDisplay(false)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => setShowDisplay(true)}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" /> View Campaigns
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>New Marketing Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaign_id">Campaign ID</Label>
                <Input 
                  id="campaign_id" 
                  {...register("campaign_id", { required: true })} 
                  readOnly 
                  className="bg-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign_name">Campaign Name</Label>
                <Input 
                  id="campaign_name" 
                  {...register("campaign_name", { required: true })} 
                  placeholder="Enter campaign name"
                />
                {errors.campaign_name && <p className="text-red-500 text-sm">This field is required</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <div className="relative">
                  <Input 
                    id="start_date" 
                    type="date"
                    {...register("start_date", { required: true })} 
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {errors.start_date && <p className="text-red-500 text-sm">This field is required</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <div className="relative">
                  <Input 
                    id="end_date" 
                    type="date"
                    {...register("end_date", { required: true })} 
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {errors.end_date && <p className="text-red-500 text-sm">This field is required</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="objectives">Campaign Objectives</Label>
              <Textarea 
                id="objectives" 
                {...register("objectives", { required: true })} 
                rows={3}
                placeholder="Enter the primary objectives of this marketing campaign"
              />
              {errors.objectives && <p className="text-red-500 text-sm">This field is required</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target_audience">Target Audience</Label>
              <div className="relative">
                <Textarea 
                  id="target_audience" 
                  {...register("target_audience", { required: true })} 
                  rows={2}
                  placeholder="Describe the target audience for this campaign"
                />
                <Users className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              {errors.target_audience && <p className="text-red-500 text-sm">This field is required</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <div className="relative">
                <Input 
                  id="budget" 
                  {...register("budget", { required: true })} 
                  onChange={handleBudgetChange}
                  placeholder="UGX 0.00"
                />
                <DollarSign className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              {errors.budget && <p className="text-red-500 text-sm">This field is required</p>}
            </div>
            
            <div className="border p-4 rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                  <Target className="h-4 w-4 mr-2" /> Marketing Strategies
                </h3>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleAddStrategy}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Strategy
                </Button>
              </div>
              
              {strategies.map((strategy, index) => (
                <div key={strategy.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor={`strategy_name_${strategy.id}`}>Strategy Name</Label>
                    <Input 
                      id={`strategy_name_${strategy.id}`}
                      value={strategy.name}
                      onChange={(e) => handleStrategyChange(strategy.id, 'name', e.target.value)}
                      placeholder="E.g., Social Media, Email Marketing, Events"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`strategy_description_${strategy.id}`}>Description</Label>
                    <Input 
                      id={`strategy_description_${strategy.id}`}
                      value={strategy.description}
                      onChange={(e) => handleStrategyChange(strategy.id, 'description', e.target.value)}
                      placeholder="Brief explanation of the strategy"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <Checkbox 
                      id={`strategy_status_${strategy.id}`}
                      checked={strategy.status}
                      onCheckedChange={(checked) => 
                        handleStrategyChange(strategy.id, 'status', checked)
                      }
                    />
                    <label
                      htmlFor={`strategy_status_${strategy.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Mark as completed
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border p-4 rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Key Performance Indicators (KPIs)</h3>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleAddKpi}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add KPI
                </Button>
              </div>
              
              {kpis.map((kpi, index) => (
                <div key={kpi.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor={`kpi_name_${kpi.id}`}>KPI Name</Label>
                    <Input 
                      id={`kpi_name_${kpi.id}`}
                      value={kpi.name}
                      onChange={(e) => handleKpiChange(kpi.id, 'name', e.target.value)}
                      placeholder="E.g., Leads Generated, Conversion Rate"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`kpi_target_${kpi.id}`}>Target</Label>
                    <Input 
                      id={`kpi_target_${kpi.id}`}
                      value={kpi.target}
                      onChange={(e) => handleKpiChange(kpi.id, 'target', e.target.value)}
                      placeholder="Numerical target"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`kpi_unit_${kpi.id}`}>Unit</Label>
                    <Input 
                      id={`kpi_unit_${kpi.id}`}
                      value={kpi.unit}
                      onChange={(e) => handleKpiChange(kpi.id, 'unit', e.target.value)}
                      placeholder="E.g., %, count, UGX"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 md:col-span-3">
                    <Checkbox 
                      id={`kpi_status_${kpi.id}`}
                      checked={kpi.status}
                      onCheckedChange={(checked) => 
                        handleKpiChange(kpi.id, 'status', checked)
                      }
                    />
                    <label
                      htmlFor={`kpi_status_${kpi.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Target achieved
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Campaign'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingCampaignForm;
