import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const QualityTrends = () => {
  const { data: qualityTests, isLoading } = useQuery({
    queryKey: ['qualityTests'],
    queryFn: async () => {
      console.log('Fetching quality tests data');
      const { data, error } = await supabase
        .from('cheese_quality_tests')
        .select('*')
        .order('test_date', { ascending: true });

      if (error) {
        console.error('Error fetching quality tests:', error);
        throw error;
      }

      return data.map(test => ({
        ...test,
        date: format(new Date(test.test_date), 'MMM d'),
      }));
    }
  });

  if (isLoading) {
    return <div>Loading quality trends...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>pH Level Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityTests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ph_level" stroke="#8884d8" name="pH Level" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Moisture & Salt Content Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityTests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="moisture_content" stroke="#82ca9d" name="Moisture %" />
                <Line type="monotone" dataKey="salt_content" stroke="#ffc658" name="Salt %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Texture & Flavor Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityTests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="texture_score" stroke="#8884d8" name="Texture" />
                <Line type="monotone" dataKey="flavor_score" stroke="#82ca9d" name="Flavor" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityTrends;