import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { ScrollArea } from "@/components/ui/scroll-area";
import QualityCheckEntryForm from './quality-control/QualityCheckEntryForm';
const QualityControlPanel = () => {
  const {
    data: qualityChecks,
    isLoading
  } = useQuery({
    queryKey: ['qualityChecks'],
    queryFn: async () => {
      console.log('Fetching quality control data');
      const {
        data,
        error
      } = await supabase.from('quality_checks').select('*').order('created_at', {
        ascending: false
      });
      if (error) {
        console.error('Error fetching quality control data:', error);
        throw error;
      }
      console.log('Quality control data:', data);
      return data;
    }
  });

  // Group quality checks by batch_id
  const groupedChecks = React.useMemo(() => {
    if (!qualityChecks) return {};
    return qualityChecks.reduce((acc, check) => {
      if (!acc[check.batch_id]) {
        acc[check.batch_id] = [];
      }
      acc[check.batch_id].push(check);
      return acc;
    }, {});
  }, [qualityChecks]);
  return <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((qualityChecks?.filter(check => check.status === 'passed').length || 0) / (qualityChecks?.length || 1) * 100)}%
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

      
    </div>;
};
export default QualityControlPanel;