
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SalesDistributionForm from '../sales/SalesDistributionForm';
import MarketingCampaignForm from '../marketing/MarketingCampaignForm';
import { supabase } from "@/integrations/supabase/supabase";
import { useEffect, useState } from 'react';

const SalesMarketingDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [campaignData, setCampaignData] = useState([]);

  const fetchData = async () => {
    try {
      const { data: salesRecords, error: salesError } = await supabase
        .from('sales_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (salesError) throw salesError;
      setSalesData(salesRecords);

      const { data: campaignRecords, error: campaignError } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignError) throw campaignError;
      setCampaignData(campaignRecords);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sales">Sales Dashboard</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date_time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Records</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.map((sale) => (
                      <tr key={sale.id}>
                        <td>{new Date(sale.date_time).toLocaleDateString()}</td>
                        <td>{sale.customer_name}</td>
                        <td>${(sale.quantity * sale.price_per_unit).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
          
          <SalesDistributionForm />
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Platform</th>
                      <th>Budget</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignData.map((campaign) => (
                      <tr key={campaign.id}>
                        <td>{campaign.campaign_name}</td>
                        <td>{campaign.platform}</td>
                        <td>${campaign.budget}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={campaignData.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="start_date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="budget" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <MarketingCampaignForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesMarketingDashboard;
