import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const QualityControlPanel = () => {
  const { data: qualityChecks, isLoading } = useQuery({
    queryKey: ['qualityChecks'],
    queryFn: async () => {
      console.log('Fetching quality control data');
      const { data, error } = await supabase
        .from('quality_control')
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

  return (
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {qualityChecks?.map((check) => (
                <TableRow key={check.id}>
                  <TableCell>{check.batch_id}</TableCell>
                  <TableCell>{check.parameter}</TableCell>
                  <TableCell>{check.value}</TableCell>
                  <TableCell>{check.standard_value}</TableCell>
                  <TableCell>
                    <Badge className={check.status === 'passed' ? 'bg-green-500' : 'bg-red-500'}>
                      {check.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default QualityControlPanel;