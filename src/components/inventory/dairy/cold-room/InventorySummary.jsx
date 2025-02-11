
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InventorySummary = () => {
  const [filter, setFilter] = React.useState('');

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['coldRoomInventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cold_room_inventory')
        .select('*')
        .order('storage_date_time', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredInventory = React.useMemo(() => {
    if (!inventory) return [];
    if (!filter) return inventory;
    
    return inventory.filter(item => 
      item.batch_id.toLowerCase().includes(filter.toLowerCase()) ||
      item.cold_room_id.toLowerCase().includes(filter.toLowerCase())
    );
  }, [inventory, filter]);

  if (isLoading) {
    return <div>Loading inventory data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="filter">Filter</Label>
          <Input
            id="filter"
            placeholder="Search by Batch ID or Cold Room ID"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Cold Room ID</TableHead>
                <TableHead>Storage Date</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Humidity</TableHead>
                <TableHead>Last Movement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.batch_id}</TableCell>
                  <TableCell>{item.cold_room_id}</TableCell>
                  <TableCell>{new Date(item.storage_date_time).toLocaleString()}</TableCell>
                  <TableCell>{item.quantity_stored}</TableCell>
                  <TableCell>{item.temperature}°C</TableCell>
                  <TableCell>{item.humidity}%</TableCell>
                  <TableCell>{item.movement_action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventorySummary;
