import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQualityControlChecks } from '@/integrations/supabase/hooks/useGrandBernaDairies';

const QualityControl = ({ batches }) => {
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const { data: qualityChecks } = useQualityControlChecks(selectedBatchId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Batch for Quality Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {batches?.filter(b => !b.end_time).map((batch) => (
              <Card 
                key={batch.id}
                className={`cursor-pointer ${selectedBatchId === batch.id ? 'border-primary' : ''}`}
                onClick={() => setSelectedBatchId(batch.id)}
              >
                <CardContent className="pt-6">
                  <p className="font-semibold">{batch.batch_number}</p>
                  <p className="text-sm text-muted-foreground capitalize">{batch.product_type}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedBatchId && (
        <Card>
          <CardHeader>
            <CardTitle>Quality Control Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Expected Value</TableHead>
                  <TableHead>Actual Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Checked By</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qualityChecks?.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell>{check.parameter}</TableCell>
                    <TableCell>{check.expected_value}</TableCell>
                    <TableCell>{check.actual_value}</TableCell>
                    <TableCell>
                      <Badge className={check.passed ? 'bg-green-500' : 'bg-red-500'}>
                        {check.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </TableCell>
                    <TableCell>{check.checked_by}</TableCell>
                    <TableCell>
                      {new Date(check.checked_at).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QualityControl;