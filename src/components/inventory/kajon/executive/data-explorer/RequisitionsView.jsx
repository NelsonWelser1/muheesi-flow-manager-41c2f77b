
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { List, RefreshCcw, Download, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRequisitions } from '@/hooks/useRequisitions';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { exportToPDF, exportToExcel, exportToCSV } from '@/utils/coffee/coffeeExport';

const RequisitionsView = ({ isLoading: parentLoading, handleRefresh: parentRefresh, timeRange, searchTerm, onExport }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });
  
  const {
    requisitions,
    loading,
    error,
    fetchRequisitions
  } = useRequisitions();

  // Fetch requisitions when filters change
  useEffect(() => {
    fetchRequisitions({ 
      timeRange, 
      searchTerm, 
      status: statusFilter !== 'all' ? statusFilter : undefined,
      requisitionType: typeFilter !== 'all' ? typeFilter : undefined
    });
  }, [timeRange, searchTerm, statusFilter, typeFilter]);

  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      ascending: prevConfig.field === field ? !prevConfig.ascending : true
    }));
  };

  // Apply client-side sorting
  const sortedRequisitions = React.useMemo(() => {
    if (!requisitions) return [];
    
    return [...requisitions].sort((a, b) => {
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
  }, [requisitions, sortConfig]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Handle local exports
  const handleExport = (format) => {
    const filename = `requisitions_${new Date().toISOString().split('T')[0]}`;
    
    switch (format) {
      case 'pdf':
        exportToPDF(sortedRequisitions, filename, 'requisitions');
        break;
      case 'excel':
        exportToExcel(sortedRequisitions, filename);
        break;
      case 'csv':
        exportToCSV(sortedRequisitions, filename);
        break;
      default:
        console.error('Unsupported export format:', format);
    }
  };

  // Function to render the status badge
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {status}
          </Badge>
        );
      case 'pending':
      case 'in progress':
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {status}
          </Badge>
        );
      case 'rejected':
      case 'declined':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status || 'Unknown'}</Badge>
        );
    }
  };

  // Function to render the urgency badge
  const getUrgencyBadge = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
      case 'critical':
        return (
          <Badge className="bg-red-100 text-red-800">
            {urgency}
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-amber-100 text-amber-800">
            {urgency}
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-green-100 text-green-800">
            {urgency}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{urgency || 'Normal'}</Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Kazo Coffee Requisitions</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchRequisitions({ 
            timeRange, 
            searchTerm, 
            status: statusFilter !== 'all' ? statusFilter : undefined,
            requisitionType: typeFilter !== 'all' ? typeFilter : undefined
          })}
          disabled={loading}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="w-40">
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-40">
          <Select 
            value={typeFilter} 
            onValueChange={setTypeFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
              <SelectItem value="machinery">Machinery</SelectItem>
              <SelectItem value="repairs">Repairs</SelectItem>
              <SelectItem value="supplies">Supplies</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              disabled={!sortedRequisitions.length}
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
          <p className="ml-2 text-amber-800">Loading requisitions...</p>
        </div>
      ) : sortedRequisitions.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
          <List className="h-12 w-12 mx-auto text-amber-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No Requisitions Found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('created_at')} className="flex items-center">
                    Date
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('requester_name')} className="flex items-center">
                    Requester
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('department')} className="flex items-center">
                    Department
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('requisition_type')} className="flex items-center">
                    Type
                  </Button>
                </TableHead>
                <TableHead>Details</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('urgency_level')} className="flex items-center">
                    Urgency
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('status')} className="flex items-center">
                    Status
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRequisitions.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{formatDate(req.created_at)}</TableCell>
                  <TableCell>{req.requester_name}</TableCell>
                  <TableCell>{req.department}</TableCell>
                  <TableCell>{req.requisition_type}</TableCell>
                  <TableCell>
                    <span className="line-clamp-2 text-sm">
                      {req.tools_machinery || req.repairs || req.justification || 'No details provided'}
                    </span>
                  </TableCell>
                  <TableCell>{getUrgencyBadge(req.urgency_level)}</TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default RequisitionsView;
