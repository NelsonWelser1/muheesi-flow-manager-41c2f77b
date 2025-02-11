
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const MovementTracking = () => {
  const [dateFilter, setDateFilter] = React.useState('');

  const { data: movements, isLoading } = useQuery({
    queryKey: ['coldRoomMovements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cold_room_inventory')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredMovements = React.useMemo(() => {
    if (!movements) return [];
    if (!dateFilter) return movements;
    
    const filterDate = new Date(dateFilter);
    return movements.filter(movement => {
      const movementDate = new Date(movement.created_at);
      return movementDate.toDateString() === filterDate.toDateString();
    });
  }, [movements, dateFilter]);

  if (isLoading) {
    return <div>Loading movement data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="dateFilter">Filter by Date</Label>
          <Input
            id="dateFilter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Movement History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{new Date(movement.created_at).toLocaleString()}</TableCell>
                  <TableCell>{movement.batch_id}</TableCell>
                  <TableCell>
                    <Badge variant={movement.movement_action === 'In' ? 'default' : 'secondary'}>
                      {movement.movement_action}
                    </Badge>
                  </TableCell>
                  <TableCell>{movement.quantity_stored}</TableCell>
                  <TableCell>{movement.operator_id}</TableCell>
                  <TableCell>{movement.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovementTracking;

