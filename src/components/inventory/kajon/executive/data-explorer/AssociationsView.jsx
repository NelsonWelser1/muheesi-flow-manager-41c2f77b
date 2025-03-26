
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, RefreshCcw, Download, Coffee } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssociationsData } from '@/hooks/useAssociationsData';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { exportToPDF, exportToExcel, exportToCSV } from '@/utils/coffee/coffeeExport';

const AssociationsView = ({ isLoading: parentLoading, handleRefresh: parentRefresh, timeRange, searchTerm, onExport }) => {
  const [associationTypeFilter, setAssociationTypeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });
  
  const { 
    associations, 
    loading, 
    error, 
    fetchAssociations 
  } = useAssociationsData();

  // Fetch associations when filters change
  useEffect(() => {
    fetchAssociations({ 
      timeRange, 
      searchTerm, 
      associationType: associationTypeFilter 
    });
  }, [timeRange, searchTerm, associationTypeFilter]);

  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      ascending: prevConfig.field === field ? !prevConfig.ascending : true
    }));
  };

  // Apply client-side sorting
  const sortedAssociations = React.useMemo(() => {
    if (!associations) return [];
    
    return [...associations].sort((a, b) => {
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
  }, [associations, sortConfig]);

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
    const filename = `coffee_associations_${new Date().toISOString().split('T')[0]}`;
    
    switch (format) {
      case 'pdf':
        exportToPDF(sortedAssociations, filename, 'associations');
        break;
      case 'excel':
        exportToExcel(sortedAssociations, filename);
        break;
      case 'csv':
        exportToCSV(sortedAssociations, filename);
        break;
      default:
        console.error('Unsupported export format:', format);
    }
  };

  // Function to render the association type badge
  const getAssociationTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'farmers':
        return (
          <Badge className="bg-green-100 text-green-800">
            Farmers
          </Badge>
        );
      case 'cooperative':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Cooperative
          </Badge>
        );
      case 'union':
        return (
          <Badge className="bg-purple-100 text-purple-800">
            Union
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{type || 'Unknown'}</Badge>
        );
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
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Coffee className="h-3 w-3" />
            Arabica & Robusta
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
        <h2 className="text-xl font-semibold">Kazo Coffee Associations</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchAssociations({ timeRange, searchTerm, associationType: associationTypeFilter })}
          disabled={loading}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="w-48">
          <Select 
            value={associationTypeFilter} 
            onValueChange={setAssociationTypeFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="farmers">Farmers</SelectItem>
              <SelectItem value="cooperative">Cooperative</SelectItem>
              <SelectItem value="union">Union</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              disabled={!sortedAssociations.length}
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
          <p className="ml-2 text-amber-800">Loading associations...</p>
        </div>
      ) : sortedAssociations.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
          <Users className="h-12 w-12 mx-auto text-amber-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No Associations Found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('association_name')} className="flex items-center">
                    Association Name
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('registration_number')} className="flex items-center">
                    Registration #
                  </Button>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('total_farm_area')} className="flex items-center">
                    Farm Area
                  </Button>
                </TableHead>
                <TableHead>Coffee Types</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('created_at')} className="flex items-center">
                    Registration Date
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAssociations.map((association) => (
                <TableRow key={association.id}>
                  <TableCell className="font-medium">{association.association_name}</TableCell>
                  <TableCell>{association.registration_number}</TableCell>
                  <TableCell>{getAssociationTypeBadge(association.association_type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{association.member_count || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>{association.total_farm_area ? `${association.total_farm_area} hectares` : 'N/A'}</TableCell>
                  <TableCell>{getCoffeeTypeBadge(association.coffee_types)}</TableCell>
                  <TableCell>{formatDate(association.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AssociationsView;
