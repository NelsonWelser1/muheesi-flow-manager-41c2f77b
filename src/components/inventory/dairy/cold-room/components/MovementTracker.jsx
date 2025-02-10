
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/supabase';

const MovementTracker = () => {
  const { data: movements, isLoading } = useQuery({
    queryKey: ['coldRoomMovements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cold_room_inventory')
        .select('*')
        .order('storage_date_time', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading movement data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Batch ID</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements?.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>
                  {new Date(movement.storage_date_time).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={movement.movement_action === 'In' ? 'default' : 'secondary'}
                  >
                    {movement.movement_action}
                  </Badge>
                </TableCell>
                <TableCell>{movement.batch_id}</TableCell>
                <TableCell>{movement.quantity_stored}</TableCell>
                <TableCell>{movement.username}</TableCell>
                <TableCell>{movement.remarks || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MovementTracker;
