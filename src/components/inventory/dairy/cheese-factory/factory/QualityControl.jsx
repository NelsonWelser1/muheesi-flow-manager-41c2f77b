
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const QualityControl = () => {
  const { data: qualityChecks, isLoading, error } = useQuery({
    queryKey: ['quality-checks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quality_checks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'passed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading quality control data: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4">Loading quality control data...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quality Control Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>pH Level</TableHead>
                <TableHead>Moisture Content</TableHead>
                <TableHead>Fat Content</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qualityChecks?.map((check) => (
                <TableRow key={check.id}>
                  <TableCell>{check.batch_id}</TableCell>
                  <TableCell>
                    {check.temperature_value}°C
                    <Badge className={getStatusColor(check.temperature_status)} className="ml-2">
                      {check.temperature_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {check.ph_level_value}
                    <Badge className={getStatusColor(check.ph_level_status)} className="ml-2">
                      {check.ph_level_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {check.moisture_content_value}%
                    <Badge className={getStatusColor(check.moisture_content_status)} className="ml-2">
                      {check.moisture_content_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {check.fat_content_value}%
                    <Badge className={getStatusColor(check.fat_content_status)} className="ml-2">
                      {check.fat_content_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={getStatusColor(
                        [
                          check.temperature_status,
                          check.ph_level_status,
                          check.moisture_content_status,
                          check.fat_content_status
                        ].every(status => status === 'passed') ? 'passed' : 'failed'
                      )}
                    >
                      {[
                        check.temperature_status,
                        check.ph_level_status,
                        check.moisture_content_status,
                        check.fat_content_status
                      ].every(status => status === 'passed') ? 'Passed' : 'Failed'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityControl;
