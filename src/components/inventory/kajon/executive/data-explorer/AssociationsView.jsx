
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, RefreshCcw, Download, Filter, Coffee } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssociationsData } from '@/hooks/useAssociationsData';

const AssociationsView = ({ isLoading: parentLoading, handleRefresh: parentRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [associationTypeFilter, setAssociationTypeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });
  
  const { 
    associations, 
    loading, 
    error, 
    fetchAssociations 
  } = useAssociationsData();

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchAssociations({ searchTerm: term, associationType: associationTypeFilter });
  };

  const handleAssociationTypeChange = (type) => {
    setAssociationTypeFilter(type);
    fetchAssociations({ searchTerm, associationType: type });
  };

  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      ascending: prevConfig.field === field ? !prevConfig.ascending : true
    }));
  };

  useEffect(() => {
    // Sort the data client-side based on sort config
    // This is just for client-side sorting visualization
    // The actual data fetching with server-side sorting is happening in the hook
  }, [sortConfig]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(date);
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
          onClick={fetchAssociations}
          disabled={loading}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search associations..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pr-10"
          />
        </div>
        <div className="w-48">
          <Select 
            value={associationTypeFilter} 
            onValueChange={handleAssociationTypeChange}
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
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
          <p className="ml-2 text-amber-800">Loading associations...</p>
        </div>
      ) : associations.length === 0 ? (
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
              {associations.map((association) => (
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
