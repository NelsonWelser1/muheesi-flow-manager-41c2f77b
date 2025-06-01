import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, FileDown, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

const KAZO_LOCATIONS = [
  "Kanoni-Mbogo",
  "Kanoni-Rwakahaya",
  "Engari-Kaichumu",
  "Engari-Kyengando",
  "Migina",
  "Kagarama",
  "Kyampangara",
  "Nkungu",
  "Buremba",
  "Kazo Town council",
  "Burunga",
  "Rwemikoma"
];

const CoffeeInventoryRecords = ({ onBack, isKazo = false }) => {
  const [inventoryRecords, setInventoryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'updated_at', direction: 'desc' });
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchInventoryRecords = async () => {
      setIsLoading(true);
      try {
        const sources = [
          { table: 'inventory_items', filter: { column: 'item_name', pattern: '%coffee%' } },
          { table: 'inventory_items', filter: { column: 'section', pattern: '%coffee%' } }
        ];
        
        let foundRecords = [];
        
        for (const source of sources) {
          let query = supabase
            .from(source.table)
            .select('*')
            .ilike(source.filter.column, source.filter.pattern)
            .order('updated_at', { ascending: false });
            
          if (isKazo) {
            query = query.or(KAZO_LOCATIONS.map(loc => `location.ilike.%${loc}%,section.ilike.%${loc}%`).join(','));
          }
            
          const { data, error } = await query;
            
          if (!error && data && data.length > 0) {
            foundRecords = transformRecords(data, source.table);
            break;
          }
        }
        
        if (foundRecords.length === 0) {
          let transferQuery = supabase
            .from('coffee_stock_transfers')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (isKazo) {
            transferQuery = transferQuery.or(
              KAZO_LOCATIONS.map(loc => 
                `source_location.ilike.%${loc}%,destination_location.ilike.%${loc}%`
              ).join(',')
            );
          }
            
          const { data: transferData, error: transferError } = await transferQuery;
            
          if (!transferError && transferData && transferData.length > 0) {
            foundRecords = transformTransferRecords(transferData);
          } else {
            toast({
              title: "No Data Found",
              description: isKazo 
                ? "No coffee inventory records were found for Kazo Coffee Development Project."
                : "No coffee inventory records were found in the database.",
              variant: "destructive",
            });
          }
        }
        
        setInventoryRecords(foundRecords);
      } catch (err) {
        console.error("Error fetching inventory records:", err);
        toast({
          title: "Error Loading Records",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInventoryRecords();
  }, [toast, isKazo]);
  
  const transformRecords = (data, sourceTable) => {
    if (sourceTable === 'inventory_items') {
      return data.map(item => ({
        id: item.id,
        coffeeType: item.item_name || 'Coffee',
        location: item.section || item.location || 'Warehouse',
        quantity: item.quantity || 0,
        unit: item.unit || 'kg',
        status: determineStatus(item),
        date: item.updated_at || item.created_at || new Date().toISOString(),
        notes: item.notes || '',
        sourceTable
      }));
    } else if (sourceTable === 'company_stocks') {
      return data.map(item => ({
        id: item.id,
        coffeeType: item.product || 'Coffee',
        location: isKazo ? 'Kazo Warehouse' : 'KAJON Warehouse',
        quantity: item.quantity || 0,
        unit: 'kg',
        status: 'active',
        date: item.updated_at || new Date().toISOString(),
        notes: `${item.company} stock`,
        sourceTable
      }));
    }
    return [];
  };
  
  const transformTransferRecords = (data) => {
    return data.map(item => ({
      id: item.id,
      coffeeType: item.coffee_type || item.product_type || 'Coffee',
      location: item.destination_location || 'Warehouse',
      quantity: item.quantity || 0,
      unit: item.unit || 'kg',
      status: item.status || 'completed',
      date: item.transfer_date || item.created_at || new Date().toISOString(),
      notes: item.notes || `From: ${item.source_location || 'Unknown'}`,
      sourceTable: 'transfers'
    }));
  };
  
  const determineStatus = (item) => {
    if (item.status) return item.status;
    
    const stockLevel = Number(item.quantity) || 0;
    const maxCapacity = Number(item.max_capacity) || stockLevel * 1.5;
    const ratio = stockLevel / maxCapacity;
    
    if (ratio < 0.3) return 'low';
    if (ratio > 0.9) return 'full';
    return 'active';
  };
  
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const filteredAndSortedRecords = React.useMemo(() => {
    let filtered = [...inventoryRecords];
    
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.coffeeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [inventoryRecords, searchTerm, statusFilter, sortConfig]);
  
  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'low':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'full':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <h2 className="text-2xl font-bold">
          {isKazo ? "Kazo Coffee Development Project - Inventory Records" : "Coffee Inventory Records"}
        </h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Current Inventory Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by coffee type, location, or notes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select onValueChange={setStatusFilter} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <span>Filter by Status</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="full">Full Stock</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <FileDown size={16} />
              Export
            </Button>
          </div>
          
          {isLoading ? (
            <div className="py-10 text-center">
              <p>Loading inventory records...</p>
            </div>
          ) : filteredAndSortedRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('coffeeType')}>
                      Coffee Type
                      {sortConfig.key === 'coffeeType' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('location')}>
                      Location
                      {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('quantity')}>
                      Quantity
                      {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                      Status
                      {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                      Date
                      {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                    </TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedRecords.map((record) => (
                    <TableRow key={`${record.id}-${record.sourceTable}`}>
                      <TableCell className="font-medium">{record.coffeeType}</TableCell>
                      <TableCell>{record.location}</TableCell>
                      <TableCell>
                        {record.quantity} {record.unit}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeStyle(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{record.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-10 text-center bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              <p className="font-medium">No Inventory Records Found</p>
              <p className="mt-2">No coffee inventory records match your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoffeeInventoryRecords;
