
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/supabase';

const MovementTracking = () => {
  const { data: movements, isLoading } = useQuery({
    queryKey: ['movement-tracking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cold_room_inventory')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading movement data...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Movement Log</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Batch ID</TableHead>
              <TableHead>Cold Room</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements?.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>{new Date(movement.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    movement.movement_action === 'In' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {movement.movement_action}
                  </span>
                </TableCell>
                <TableCell>{movement.batch_id}</TableCell>
                <TableCell>{movement.cold_room_id}</TableCell>
                <TableCell>{movement.quantity_stored}</TableCell>
                <TableCell>{movement.operator_id}</TableCell>
                <TableCell>{movement.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MovementTracking;
