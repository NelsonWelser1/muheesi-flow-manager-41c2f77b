
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Search, Filter, Printer } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";
import { usePaymentsPagination } from '../../../accounts/records/hooks/usePaymentsPagination';

const PerformanceRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Fetch performance records from Supabase
  const { data: performanceRecords = [], isLoading, error } = useQuery({
    queryKey: ['performance_records', searchTerm, timeRange, ratingFilter],
    queryFn: async () => {
      console.log('Fetching performance records...');
      
      let query = supabase
        .from('logistics_delivery_performance')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply time range filter
      if (timeRange !== 'all') {
        const now = new Date();
        let timeAgo;
        
        switch (timeRange) {
          case 'hour':
            timeAgo = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case 'day':
            timeAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case 'week':
            timeAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            timeAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            timeAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        }
        
        if (timeAgo) {
          query = query.gte('created_at', timeAgo.toISOString());
        }
      }

      // Apply rating filter
      if (ratingFilter !== 'all') {
        query = query.eq('performance_rating', parseInt(ratingFilter));
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching performance records:', error);
        throw error;
      }
      
      // Apply search filter
      let filteredData = data || [];
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredData = filteredData.filter(record => 
          record.delivery_id?.toLowerCase().includes(searchLower) ||
          record.customer_feedback?.toLowerCase().includes(searchLower)
        );
      }
      
      console.log(`Fetched ${filteredData.length} performance records`);
      return filteredData;
    }
  });

  const {
    paginatedData,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    handlePageChange
  } = usePaymentsPagination(performanceRecords, 10);

  const handlePrint = () => {
    const printContent = document.getElementById('performance-table');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Performance Records</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .print-date { text-align: right; font-size: 12px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="print-date">Printed on: ${new Date().toLocaleString()}</div>
          <div class="header">
            <h2>Performance Records Report</h2>
            <p>Total Records: ${totalItems}</p>
          </div>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Error loading performance records: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Performance Records</CardTitle>
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print Records
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search performance records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="hour">Last Hour</SelectItem>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Rating Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Records Table */}
        <div className="rounded-md border" id="performance-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Delivery ID</TableHead>
                <TableHead className="whitespace-nowrap">Performance Rating</TableHead>
                <TableHead className="whitespace-nowrap">Delivery Time (hrs)</TableHead>
                <TableHead className="whitespace-nowrap">Customer Feedback</TableHead>
                <TableHead className="whitespace-nowrap">Action Required</TableHead>
                <TableHead className="whitespace-nowrap">Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No performance records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {record.delivery_id || 'N/A'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          record.performance_rating >= 4 ? 'bg-green-100 text-green-800' :
                          record.performance_rating >= 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {record.performance_rating || 'N/A'} ★
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {record.delivery_time || 'N/A'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-xs truncate">
                      {record.customer_feedback || 'No feedback'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        record.action_required ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {record.action_required ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {record.created_at ? new Date(record.created_at).toLocaleString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} items
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceRecords;
