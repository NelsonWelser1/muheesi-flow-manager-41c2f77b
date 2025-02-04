import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import QualityCheckEntryForm from './quality-control/QualityCheckEntryForm';

const QualityControlPanel = () => {
  const { data: qualityChecks, isLoading } = useQuery({
    queryKey: ['qualityChecks'],
    queryFn: async () => {
      console.log('Fetching quality control data');
      const { data, error } = await supabase
        .from('quality_checks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quality control data:', error);
        throw error;
      }

      console.log('Quality control data:', data);
      return data;
    },
  });

  const { data: qualityTrends } = useQuery({
    queryKey: ['qualityTrends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quality_trends')
        .select('*')
        .order('date', { ascending: true })
        .limit(7);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((qualityChecks?.filter(check => check.status === 'passed').length || 0) / 
                (qualityChecks?.length || 1) * 100)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qualityChecks?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Failed Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {qualityChecks?.filter(check => check.status === 'failed').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <QualityCheckEntryForm />

      <Card>
        <CardHeader>
          <CardTitle>Quality Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qualityTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="pass_rate" stroke="#10b981" name="Pass Rate (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quality Control Checks</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading quality control data...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Standard</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qualityChecks?.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell>{check.batch_id}</TableCell>
                    <TableCell>{check.parameter}</TableCell>
                    <TableCell>{check.actual_value}</TableCell>
                    <TableCell>{check.standard_value}</TableCell>
                    <TableCell>
                      <Badge className={check.status === 'passed' ? 'bg-green-500' : 'bg-red-500'}>
                        {check.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(check.created_at).toLocaleTimeString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityControlPanel;