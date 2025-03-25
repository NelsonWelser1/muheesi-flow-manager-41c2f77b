import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import ExportActions from './components/ExportActions';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const productionStats = [
  { name: 'Jan', Robusta: 2400, Arabica: 1398, amt: 2210 },
  { name: 'Feb', Robusta: 2210, Arabica: 2800, amt: 2290 },
  { name: 'Mar', Robusta: 2290, Arabica: 2000, amt: 2000 },
  { name: 'Apr', Robusta: 2000, Arabica: 2780, amt: 2181 },
  { name: 'May', Robusta: 2181, Arabica: 2390, amt: 2500 },
  { name: 'Jun', Robusta: 2500, Arabica: 3490, amt: 2100 },
  { name: 'Jul', Robusta: 2100, Arabica: 4300, amt: 2100 },
];

const membershipStats = [
  { name: 'Farmers', value: 400 },
  { name: 'Processors', value: 300 },
  { name: 'Retailers', value: 300 },
  { name: 'Exporters', value: 200 },
  { name: 'Other', value: 278 },
];

const qualityStats = [
  { name: 'Excellent', value: 40 },
  { name: 'Good', value: 30 },
  { name: 'Average', value: 20 },
  { name: 'Poor', value: 10 },
];

const financialStats = [
  { name: 'Revenue', value: 2400 },
  { name: 'Costs', value: 1398 },
  { name: 'Profit', value: 989 },
  { name: 'Expenses', value: 3908 },
];

const impactStats = [
  { name: 'Community Programs', value: 40 },
  { name: 'Sustainability Initiatives', value: 30 },
  { name: 'Economic Empowerment', value: 20 },
  { name: 'Environmental Conservation', value: 10 },
];

const AssociationAnalytics = () => {
  const [productionData, setProductionData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);
  const [qualityData, setQualityData] = useState([]);
  const [financialData, setFinancialData] = useState([]);
  const [impactData, setImpactData] = useState([]);
  const [isLoading, setIsLoading] = useState({
    production: false,
    membership: false,
    quality: false,
    financial: false,
    impact: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProductionData();
    fetchMembershipData();
    fetchQualityData();
    fetchFinancialData();
    fetchImpactData();
  }, []);

  const fetchProductionData = async () => {
    setIsLoading(prev => ({ ...prev, production: true }));
    try {
      // Fetch data from Supabase or use sample data
      setProductionData(productionStats);
    } catch (error) {
      console.error("Error fetching production data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch production data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, production: false }));
    }
  };

  const fetchMembershipData = async () => {
    setIsLoading(prev => ({ ...prev, membership: true }));
    try {
      // Fetch data from Supabase or use sample data
      setMembershipData(membershipStats);
    } catch (error) {
      console.error("Error fetching membership data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch membership data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, membership: false }));
    }
  };

  const fetchQualityData = async () => {
    setIsLoading(prev => ({ ...prev, quality: true }));
    try {
      // Fetch data from Supabase or use sample data
      setQualityData(qualityStats);
    } catch (error) {
      console.error("Error fetching quality data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch quality data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, quality: false }));
    }
  };

  const fetchFinancialData = async () => {
    setIsLoading(prev => ({ ...prev, financial: true }));
    try {
      // Fetch data from Supabase or use sample data
      setFinancialData(financialStats);
    } catch (error) {
      console.error("Error fetching financial data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch financial data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, financial: false }));
    }
  };

  const fetchImpactData = async () => {
    setIsLoading(prev => ({ ...prev, impact: true }));
    try {
      // Fetch data from Supabase or use sample data
      setImpactData(impactStats);
    } catch (error) {
      console.error("Error fetching impact data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch impact data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, impact: false }));
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="production">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Production Analytics</CardTitle>
                <CardDescription>Coffee production statistics over time</CardDescription>
              </div>
              <ExportActions 
                data={productionData} 
                title="Production_Analytics" 
                onRefresh={fetchProductionData}
                isLoading={isLoading.production}
              />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Robusta" fill="#8884d8" />
                  <Bar dataKey="Arabica" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membership" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Membership Statistics</CardTitle>
                <CardDescription>Association membership growth and distribution</CardDescription>
              </div>
              <ExportActions 
                data={membershipData} 
                title="Membership_Statistics" 
                onRefresh={fetchMembershipData}
                isLoading={isLoading.membership}
              />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={membershipData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {membershipData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>Coffee quality scores and distribution</CardDescription>
              </div>
              <ExportActions 
                data={qualityData} 
                title="Quality_Metrics" 
                onRefresh={fetchQualityData}
                isLoading={isLoading.quality}
              />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={qualityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Financial Performance</CardTitle>
                <CardDescription>Revenue, costs, and profit margins</CardDescription>
              </div>
              <ExportActions 
                data={financialData} 
                title="Financial_Performance" 
                onRefresh={fetchFinancialData}
                isLoading={isLoading.financial}
              />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Social Impact</CardTitle>
                <CardDescription>Community development and sustainability metrics</CardDescription>
              </div>
              <ExportActions 
                data={impactData} 
                title="Social_Impact" 
                onRefresh={fetchImpactData}
                isLoading={isLoading.impact}
              />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={impactData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssociationAnalytics;
