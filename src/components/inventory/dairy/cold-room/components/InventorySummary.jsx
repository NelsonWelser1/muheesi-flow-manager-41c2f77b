
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/supabase';

const InventorySummary = () => {
  const { data: inventory, isLoading } = useQuery({
    queryKey: ['coldRoomInventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cold_room_inventory')
        .select('*')
        .order('storage_date_time', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading inventory data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch ID</TableHead>
              <TableHead>Cold Room</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Temperature</TableHead>
              <TableHead>Humidity</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.batch_id}</TableCell>
                <TableCell>{item.cold_room_id}</TableCell>
                <TableCell>{item.quantity_stored}</TableCell>
                <TableCell>{item.temperature}°C</TableCell>
                <TableCell>{item.humidity}%</TableCell>
                <TableCell>
                  {new Date(item.updated_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InventorySummary;
