
import React, { useState, useEffect } from 'react';
import { useKAJONCoffees } from '@/integrations/supabase/hooks/useKAJONCoffee';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { ArrowLeft, Download, Filter, Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const CoffeeInventoryRecords = ({ onBack, isKazo }) => {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const { data: inventoryRecords, isLoading, error } = useKAJONCoffees(filters);
  const { toast } = useToast();
  const [errorState, setErrorState] = useState(null);
  
  // Additional error handling
  useEffect(() => {
    if (error) {
      console.error("Records fetch error:", error);
      setErrorState(error);
    }
  }, [error]);
  
  const locationOptions = isKazo ? [
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
  ] : [
    "Kampala Store",
    "JBER",
    "Mbarara Warehouse",
    "Kakyinga Factory",
    "Kazo - Kanoni Warehouse",
    "Kazo Coffee"
  ];

  const handleExport = () => {
    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add headers
      csvContent += "Date,Manager,Location,Coffee Type,Quality Grade,Source,Humidity,Buying Price,Currency,Quantity,Unit,Status\n";
      
      // Add data rows
      filteredRecords.forEach(record => {
        const row = [
          format(new Date(record.created_at), 'yyyy-MM-dd'),
          record.manager || '',
          record.location || '',
          record.coffeeType || '',
          record.qualityGrade || '',
          record.source || '',
          record.humidity || '',
          record.buying_price || '',
          record.currency || '',
          record.quantity || '',
          record.unit || '',
          record.status || ''
        ];
        csvContent += row.join(',') + "\n";
      });
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `coffee_inventory_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Coffee inventory records have been exported to CSV",
      });
    } catch (err) {
      console.error("Export error:", err);
      toast({
        title: "Export Failed",
        description: "Failed to export inventory records",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  // Safe filtering with error handling
  const filteredRecords = React.useMemo(() => {
    try {
      if (!inventoryRecords) return [];
      
      return inventoryRecords.filter(record => {
        if (!searchTerm) return true;
        
        const searchLower = searchTerm.toLowerCase();
        return (
          (record.manager || '').toLowerCase().includes(searchLower) ||
          (record.location || '').toLowerCase().includes(searchLower) ||
          (record.coffeeType || '').toLowerCase().includes(searchLower) ||
          (record.qualityGrade || '').toLowerCase().includes(searchLower) ||
          (record.source || '').toLowerCase().includes(searchLower)
        );
      });
    } catch (err) {
      console.error("Error filtering records:", err);
      return [];
    }
  }, [inventoryRecords, searchTerm]);

  // If there's an error state, display it
  if (errorState) {
    return (
      <div className="p-8">
        <Button onClick={onBack} variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="text-red-500">Error loading inventory records: {errorState.message}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <Button onClick={onBack} variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex justify-center p-8">Loading inventory records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h2 className="text-xl font-semibold">Coffee Inventory Records</h2>
        <Button onClick={handleExport} variant="outline" className="flex items-center gap-2" disabled={filteredRecords.length === 0}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search records..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select
          value={filters.location || ''}
          onValueChange={(value) => handleFilterChange('location', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Locations</SelectItem>
            {locationOptions.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={filters.coffeeType || ''}
          onValueChange={(value) => handleFilterChange('coffeeType', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="arabica">Arabica Coffee</SelectItem>
            <SelectItem value="robusta">Robusta Coffee</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={clearFilters} variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Coffee Type</TableHead>
              <TableHead>Quality Grade</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Humidity</TableHead>
              <TableHead>Buying Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-6">
                  No inventory records found
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.created_at ? format(new Date(record.created_at), 'yyyy-MM-dd') : 'N/A'}</TableCell>
                  <TableCell>{record.manager || 'N/A'}</TableCell>
                  <TableCell>{record.location || 'N/A'}</TableCell>
                  <TableCell>{record.coffeeType || 'N/A'}</TableCell>
                  <TableCell>{record.qualityGrade || 'N/A'}</TableCell>
                  <TableCell>{record.source || 'N/A'}</TableCell>
                  <TableCell>{record.humidity ? `${record.humidity}%` : 'N/A'}</TableCell>
                  <TableCell>
                    {record.buying_price ? `${record.buying_price} ${record.currency || 'UGX'}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {record.quantity ? `${record.quantity} ${record.unit || 'kg'}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      record.status === 'active' ? 'bg-green-100 text-green-800' : 
                      record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status || 'unknown'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CoffeeInventoryRecords;
