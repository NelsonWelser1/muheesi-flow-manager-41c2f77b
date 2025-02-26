
import React, { useEffect, useState } from 'react';
import { useColdRoomInventory } from './hooks/useColdRoomInventory';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

const InventorySummary = () => {
  const { loading, error, getStockLevelsByBatch } = useColdRoomInventory();
  const [stockByBatch, setStockByBatch] = useState({});
  const [stockList, setStockList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStockLevels = async () => {
      setIsLoading(true);
      try {
        const stockData = await getStockLevelsByBatch();
        setStockByBatch(stockData);
        
        // Convert object to array for easier rendering
        const stockArray = Object.values(stockData).filter(item => item.current > 0);
        setStockList(stockArray);
      } catch (err) {
        console.error('Error in InventorySummary:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStockLevels();
    
    // Set up interval for periodic refresh
    const intervalId = setInterval(fetchStockLevels, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [getStockLevelsByBatch]);

  // Generate placeholder rows for loading state
  const renderSkeletonRows = () => {
    return Array(5).fill(0).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-3 w-[80px] mt-1" />
        </TableCell>
        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Current Cold Room Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative min-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Cold Room</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  renderSkeletonRows()
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-red-500">
                      Error loading inventory: {error}
                    </TableCell>
                  </TableRow>
                ) : stockList.length > 0 ? (
                  stockList.map((item, index) => (
                    <TableRow key={item.batch_id || index}>
                      <TableCell className="font-mono text-xs">
                        {item.batch_id}
                        {item.production_batch_id && (
                          <span className="block text-xs text-muted-foreground">
                            Prod: {item.production_batch_id}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.product_type}
                        <span className="block text-xs text-muted-foreground capitalize">
                          {item.product_category}
                        </span>
                      </TableCell>
                      <TableCell>{item.cold_room_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {item.received}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          {item.issued}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary">
                          {item.current}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.lastUpdated ? format(new Date(item.lastUpdated), 'PPp') : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventorySummary;
