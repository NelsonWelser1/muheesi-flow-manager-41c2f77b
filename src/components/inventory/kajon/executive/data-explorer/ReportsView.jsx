
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, RefreshCcw, Download, MessageSquare, Mail, Phone } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/supabase';

const ReportsView = ({ isLoading, handleRefresh }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: 'created_at', ascending: false });
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Query Supabase for reports
      let query = supabase
        .from('kazo_coffee_reports')
        .select('*')
        .order(sortConfig.field, { ascending: sortConfig.ascending });
      
      // Apply type filter if not 'all'
      if (typeFilter !== 'all') {
        query = query.eq('report_type', typeFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }
      
      // Apply search filter client-side
      let filteredData = data;
      if (searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        filteredData = data.filter(report => 
          report.title?.toLowerCase().includes(lowercaseSearch) ||
          report.content?.toLowerCase().includes(lowercaseSearch) ||
          report.recipient_name?.toLowerCase().includes(lowercaseSearch) ||
          report.report_type?.toLowerCase().includes(lowercaseSearch)
        );
      }
      
      setReports(filteredData || []);
    } catch (error) {
      console.error('Error in fetchReports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sort handler
  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      ascending: prevConfig.field === field ? !prevConfig.ascending : true
    }));
  };

  useEffect(() => {
    fetchReports();
  }, [sortConfig, typeFilter, searchTerm]);

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

  // Get media type badges
  const getMediaBadges = (sendVia) => {
    if (!sendVia || !Array.isArray(sendVia)) return null;
    
    return (
      <div className="flex gap-1">
        {sendVia.includes('email') && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
            <Mail className="h-3 w-3" />
            Email
          </Badge>
        )}
        {sendVia.includes('sms') && (
          <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
            <Phone className="h-3 w-3" />
            SMS
          </Badge>
        )}
        {sendVia.includes('whatsapp') && (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            WhatsApp
          </Badge>
        )}
      </div>
    );
  };

  const reportTypes = [
    'All Types',
    'Daily Stock Summary',
    'Weekly Inventory Report',
    'Monthly Analysis',
    'Quality Control Report',
    'Stock Movement Report',
    'Custom Report'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Kazo Coffee Project Reports</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchReports}
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
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10"
          />
        </div>
        <div className="w-48">
          <Select 
            value={typeFilter} 
            onValueChange={(value) => setTypeFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {reportTypes.slice(1).map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
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
          <p className="ml-2 text-amber-800">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
          <FileText className="h-12 w-12 mx-auto text-amber-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No Reports Found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">
                  <Button variant="ghost" size="sm" onClick={() => handleSort('created_at')} className="flex items-center">
                    Date
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('title')} className="flex items-center">
                    Title
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('report_type')} className="flex items-center">
                    Type
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('recipient_name')} className="flex items-center">
                    Recipient
                  </Button>
                </TableHead>
                <TableHead>Send Via</TableHead>
                <TableHead>Content Preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{formatDate(report.created_at)}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-amber-50 text-amber-800">
                      {report.report_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{report.recipient_name}</span>
                      <span className="text-xs text-gray-500">{report.recipient_email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getMediaBadges(report.send_via)}</TableCell>
                  <TableCell>
                    <span className="line-clamp-2 text-sm text-gray-600">
                      {report.content}
                    </span>
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

export default ReportsView;
