
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Warehouse, RefreshCcw, Download, Coffee, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFarmData } from '@/hooks/useFarmData';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { exportToPDF, exportToExcel, exportToCSV } from '@/utils/coffee/coffeeExport';

const FarmInformationView = ({ isLoading: parentLoading, handleRefresh: parentRefresh, timeRange, searchTerm, onExport }) => {
  const [coffeeTypeFilter, setCoffeeTypeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });
  
  const {
    farms,
    loading,
    error,
    fetchFarmData
  } = useFarmData();

  // Fetch farm data when filters change
  useEffect(() => {
    fetchFarmData({ 
      timeRange, 
      searchTerm, 
      coffeeType: coffeeTypeFilter !== 'all' ? coffeeTypeFilter : undefined
    });
  }, [timeRange, searchTerm, coffeeTypeFilter]);

  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      ascending: prevConfig.field === field ? !prevConfig.ascending : true
    }));
  };

  // Apply client-side sorting
  const sortedFarms = React.useMemo(() => {
    if (!farms) return [];
    
    return [...farms].sort((a, b) => {
      const aValue = a[sortConfig.field] || '';
      const bValue = b[sortConfig.field] || '';
      
      if (aValue < bValue) {
        return sortConfig.ascending ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.ascending ? 1 : -1;
      }
      return 0;
    });
  }, [farms, sortConfig]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(date);
  };

  // Handle local exports
  const handleExport = (format) => {
    const filename = `farm_information_${new Date().toISOString().split('T')[0]}`;
    
    switch (format) {
      case 'pdf':
        exportToPDF(sortedFarms, filename, 'farms');
        break;
      case 'excel':
        exportToExcel(sortedFarms, filename);
        break;
      case 'csv':
        exportToCSV(sortedFarms, filename);
        break;
      default:
        console.error('Unsupported export format:', format);
    }
  };

  // Function to render the coffee type badge
  const getCoffeeTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'arabica':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <Coffee className="h-3 w-3" />
            Arabica
          </Badge>
        );
      case 'robusta':
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <Coffee className="h-3 w-3" />
            Robusta
          </Badge>
        );
      case 'both':
      case 'mixed':
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Coffee className="h-3 w-3" />
            Mixed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{type || 'Unknown'}</Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Kazo Coffee Farm Information</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchFarmData({ timeRange, searchTerm, coffeeType: coffeeTypeFilter !== 'all' ? coffeeTypeFilter : undefined })}
          disabled={loading}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="w-48">
          <Select 
            value={coffeeTypeFilter} 
            onValueChange={setCoffeeTypeFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by coffee type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="arabica">Arabica</SelectItem>
              <SelectItem value="robusta">Robusta</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              disabled={!sortedFarms.length}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport('pdf')}>
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('excel')}>
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              Export as CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
          <p className="ml-2 text-amber-800">Loading farm data...</p>
        </div>
      ) : sortedFarms.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
          <Warehouse className="h-12 w-12 mx-auto text-amber-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No Farm Information Found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('farm_name')} className="flex items-center">
                    Farm Name
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('manager_name')} className="flex items-center">
                    Manager
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('supervisor_name')} className="flex items-center">
                    Supervisor
                  </Button>
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('farm_size')} className="flex items-center">
                    Farm Size
                  </Button>
                </TableHead>
                <TableHead>Coffee Type</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('created_at')} className="flex items-center">
                    Registration Date
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFarms.map((farm) => (
                <TableRow key={farm.id}>
                  <TableCell className="font-medium">{farm.farm_name}</TableCell>
                  <TableCell>{farm.manager_name}</TableCell>
                  <TableCell>{farm.supervisor_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{farm.location || 'Unknown'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{farm.farm_size ? `${farm.farm_size} hectares` : 'N/A'}</TableCell>
                  <TableCell>{getCoffeeTypeBadge(farm.coffee_type)}</TableCell>
                  <TableCell>{formatDate(farm.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FarmInformationView;
