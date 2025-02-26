
import React, { useEffect, useState } from 'react';
import { useColdRoomInventory } from './hooks/useColdRoomInventory';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const InventorySummary = () => {
  const { loading, error, getStockLevelsByBatch } = useColdRoomInventory();
  const [stockLevels, setStockLevels] = useState({});
  const [groupedStock, setGroupedStock] = useState({});

  useEffect(() => {
    const fetchStockLevels = async () => {
      const levels = await getStockLevelsByBatch();
      setStockLevels(levels);
      
      // Group stock by product category and type
      const grouped = {};
      Object.values(levels).forEach(item => {
        if (item.current <= 0) return; // Skip items with no stock
        
        const category = item.product_category || 'unknown';
        const type = item.product_type || 'unknown';
        
        if (!grouped[category]) {
          grouped[category] = {};
        }
        
        if (!grouped[category][type]) {
          grouped[category][type] = {
            total: 0,
            batches: []
          };
        }
        
        grouped[category][type].total += item.current;
        grouped[category][type].batches.push(item);
      });
      
      setGroupedStock(grouped);
    };
    
    fetchStockLevels();
  }, [getStockLevelsByBatch]);

  if (loading) return <div>Loading inventory data...</div>;
  if (error) return <div>Error loading inventory: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedStock).map(([category, types]) => (
          <Card key={category} className="overflow-hidden">
            <CardHeader className="bg-muted">
              <CardTitle className="capitalize">{category}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {Object.entries(types).map(([type, data]) => (
                <div key={type} className="mb-4">
                  <h3 className="font-medium text-lg mb-2">{type}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total in stock: <Badge variant="outline">{data.total} units</Badge>
                  </p>
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Batches:</p>
                    <div className="max-h-24 overflow-y-auto space-y-1">
                      {data.batches.map((batch, idx) => (
                        <div key={idx} className="text-xs border-l-2 border-primary pl-2">
                          <p><span className="font-medium">Batch:</span> {batch.batch_id}</p>
                          <p><span className="font-medium">Cold Room:</span> {batch.cold_room_id}</p>
                          <p><span className="font-medium">Units:</span> {batch.current}</p>
                          <p><span className="font-medium">Weight:</span> {batch.unit_weight} kg</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detailed Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Cold Room</TableHead>
                <TableHead className="text-right">In Stock</TableHead>
                <TableHead className="text-right">Received</TableHead>
                <TableHead className="text-right">Issued</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(stockLevels)
                .filter(item => item.current > 0) // Only show items with stock
                .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
                .map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.batch_id}</TableCell>
                    <TableCell>
                      {item.product_type} 
                      <span className="block text-xs text-muted-foreground capitalize">
                        {item.product_category}
                      </span>
                    </TableCell>
                    <TableCell>{item.cold_room_id}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={item.current > 10 ? "default" : "destructive"}>
                        {item.current}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.received}</TableCell>
                    <TableCell className="text-right">{item.issued}</TableCell>
                    <TableCell>
                      {item.lastUpdated ? format(new Date(item.lastUpdated), 'PPp') : 'N/A'}
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

export default InventorySummary;
