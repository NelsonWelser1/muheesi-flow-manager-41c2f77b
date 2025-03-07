
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase";

const LogisticsOverview = () => {
  const navigate = useNavigate();

  // Sample data for demonstration
  const deliveryData = [
    { date: '2024-03-01', deliveries: 24 },
    { date: '2024-03-02', deliveries: 31 },
    { date: '2024-03-03', deliveries: 28 },
    { date: '2024-03-04', deliveries: 35 },
    { date: '2024-03-05', deliveries: 29 },
  ];

  // Fetch summary metrics
  const { data: summaryMetrics = { total: 0, onTime: 0, delayed: 0 } } = useQuery({
    queryKey: ['deliveryMetrics'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('logistics_deliveries')
          .select('status');
        
        if (error) throw error;
        
        return {
          total: data.length,
          onTime: data.filter(d => d.status === 'Completed').length,
          delayed: data.filter(d => d.status === 'Delayed').length
        };
      } catch (error) {
        console.error('Error fetching delivery metrics:', error);
        return { total: 0, onTime: 0, delayed: 0 };
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Logistics Overview</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate('/manage-inventory/logistics')}
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On-Time Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.onTime}</div>
            <p className="text-xs text-muted-foreground">
              {summaryMetrics.total ? Math.round((summaryMetrics.onTime / summaryMetrics.total) * 100) : 0}% success rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delayed Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.delayed}</div>
            <p className="text-xs text-muted-foreground">
              {summaryMetrics.total ? Math.round((summaryMetrics.delayed / summaryMetrics.total) * 100) : 0}% delay rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="deliveries" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsOverview;
