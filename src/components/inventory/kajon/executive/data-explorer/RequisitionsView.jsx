
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List, RefreshCcw, Download, Filter, Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/supabase';

const RequisitionsView = ({ isLoading, handleRefresh }) => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });

  const fetchRequisitions = async () => {
    setLoading(true);
    try {
      // In a real implementation, we would fetch actual requisition data from Supabase
      // For now, we'll use mock data since the table may not exist yet
      
      // Mock requisition data
      const mockRequisitions = [
        {
          id: 1,
          requesterName: 'David Muwanguzi',
          department: 'Coffee Processing',
          requisitionType: 'tools',
          tools: 'Coffee Moisture Meter, Digital Scale 100kg',
          repairs: '',
          justification: 'Need accurate moisture measurement during harvest season.',
          urgencyLevel: 'high',
          status: 'approved',
          approvedBy: 'John Mugisha',
          approvedDate: '2024-06-30T14:20:00Z',
          created_at: '2024-06-25T09:15:00Z'
        },
        {
          id: 2,
          requesterName: 'Sarah Kyomuhendo',
          department: 'Quality Control',
          requisitionType: 'tools',
          tools: 'Cupping Equipment Set, Sample Roaster',
          repairs: '',
          justification: 'For quality assessment of latest batch of Arabica.',
          urgencyLevel: 'medium',
          status: 'pending',
          approvedBy: '',
          approvedDate: '',
          created_at: '2024-07-01T11:30:00Z'
        },
        {
          id: 3,
          requesterName: 'Robert Asiimwe',
          department: 'Storage & Warehouse',
          requisitionType: 'repairs',
          tools: '',
          repairs: 'Coffee Sorting Machine - Motor overheating issue',
          justification: 'Machine shuts down after 2 hours. Affects processing capacity during peak season.',
          urgencyLevel: 'high',
          status: 'in-progress',
          approvedBy: 'John Mugisha',
          approvedDate: '2024-06-28T10:45:00Z',
          created_at: '2024-06-27T08:20:00Z'
        },
        {
          id: 4,
          requesterName: 'Mary Namuli',
          department: 'Farm Management',
          requisitionType: 'tools',
          tools: 'Pruning Shears (10 sets), Harvesting Baskets (20)',
          repairs: '',
          justification: 'Preparation for upcoming harvest season in Kanoni area.',
          urgencyLevel: 'low',
          status: 'declined',
          approvedBy: 'Peter Mutebi',
          approvedDate: '2024-06-15T15:30:00Z',
          created_at: '2024-06-12T09:45:00Z'
        }
      ];
      
      // Apply filters
      let filteredData = mockRequisitions;
      
      // Apply search filter
      if (searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.requesterName?.toLowerCase().includes(lowercaseSearch) ||
          item.department?.toLowerCase().includes(lowercaseSearch) ||
          item.tools?.toLowerCase().includes(lowercaseSearch) ||
          item.repairs?.toLowerCase().includes(lowercaseSearch) ||
          item.justification?.toLowerCase().includes(lowercaseSearch)
        );
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filteredData = filteredData.filter(item => item.status === statusFilter);
      }
      
      // Apply type filter
      if (typeFilter !== 'all') {
        filteredData = filteredData.filter(item => item.requisitionType === typeFilter);
      }
      
      // Apply urgency filter
      if (urgencyFilter !== 'all') {
        filteredData = filteredData.filter(item => item.urgencyLevel === urgencyFilter);
      }
      
      // Sort the data
      filteredData.sort((a, b) => {
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
      
      setRequisitions(filteredData);
    } catch (error) {
      console.error('Error fetching requisitions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisitions();
  }, [searchTerm, statusFilter, typeFilter, urgencyFilter, sortConfig]);

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

  // Function to render status badge
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <Wrench className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case 'declined':
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status || 'Unknown'}</Badge>
        );
    }
  };

  // Function to render urgency badge
  const getUrgencyBadge = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return (
          <Badge className="bg-red-100 text-red-800">
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-amber-100 text-amber-800">
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-green-100 text-green-800">
            Low
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{urgency || 'Unknown'}</Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Kazo Coffee Project Requisitions</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchRequisitions}
          disabled={loading}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            type="text"
            placeholder="Search requisitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-[140px]">
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
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-[140px]">
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
              <SelectItem value="repairs">Repairs</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-[140px]">
          <Select 
            value={urgencyFilter} 
            onValueChange={setUrgencyFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgency</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
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
          <p className="ml-2 text-amber-800">Loading requisitions...</p>
        </div>
      ) : requisitions.length === 0 ? (
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
                <TableHead className="w-[180px]">
                  <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'created_at', ascending: !sortConfig.ascending })} className="flex items-center">
                    Date
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => setSortConfig({ field: 'requesterName', ascending: !sortConfig.ascending })} className="flex items-center">
                    Requester
                  </Button>
                </TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Items / Repairs Needed</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approval</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requisitions.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{formatDate(req.created_at)}</TableCell>
                  <TableCell>{req.requesterName}</TableCell>
                  <TableCell>{req.department}</TableCell>
                  <TableCell>
                    {req.requisitionType === 'tools' ? (
                      <Badge className="bg-blue-100 text-blue-800">Tools</Badge>
                    ) : (
                      <Badge className="bg-purple-100 text-purple-800">Repairs</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-2 text-sm">
                      {req.requisitionType === 'tools' ? req.tools : req.repairs}
                    </span>
                  </TableCell>
                  <TableCell>{getUrgencyBadge(req.urgencyLevel)}</TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                  <TableCell>
                    {req.approvedBy ? (
                      <div className="flex flex-col">
                        <span className="text-sm">{req.approvedBy}</span>
                        <span className="text-xs text-gray-500">{formatDate(req.approvedDate)}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Not yet approved</span>
                    )}
                  </TableCell>
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
