
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useMilkReception } from '@/hooks/useMilkReception';
import { format } from 'date-fns';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const RECORDS_PER_PAGE = 10;

const MilkReceptionTable = () => {
  const { data: records, isLoading, error } = useMilkReception();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter records based on search term
  const filteredRecords = records.filter(record => 
    record.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.tank_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.quality_score?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.batch_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecords.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getQualityBadgeColor = (quality) => {
    switch (quality) {
      case 'Grade A':
        return 'bg-green-100 text-green-800';
      case 'Grade B':
        return 'bg-yellow-100 text-yellow-800';
      case 'Grade C':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading milk reception records...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading records: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Milk Reception Records</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by supplier, tank, quality, or batch ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredRecords.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {searchTerm ? 'No records found matching your search.' : 'No milk reception records found.'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Date</TableHead>
                    <TableHead className="whitespace-nowrap">Supplier</TableHead>
                    <TableHead className="whitespace-nowrap">Volume (L)</TableHead>
                    <TableHead className="whitespace-nowrap">Tank</TableHead>
                    <TableHead className="whitespace-nowrap">Temperature (°C)</TableHead>
                    <TableHead className="whitespace-nowrap">Fat %</TableHead>
                    <TableHead className="whitespace-nowrap">Protein %</TableHead>
                    <TableHead className="whitespace-nowrap">Quality</TableHead>
                    <TableHead className="whitespace-nowrap">Batch ID</TableHead>
                    <TableHead className="whitespace-nowrap">Destination</TableHead>
                    <TableHead className="whitespace-nowrap">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(record.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {record.supplier_name}
                      </TableCell>
                      <TableCell className={`whitespace-nowrap ${record.milk_volume < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {record.milk_volume}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{record.tank_number}</TableCell>
                      <TableCell className="whitespace-nowrap">{record.temperature}</TableCell>
                      <TableCell className="whitespace-nowrap">{record.fat_percentage}%</TableCell>
                      <TableCell className="whitespace-nowrap">{record.protein_percentage}%</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge className={getQualityBadgeColor(record.quality_score)}>
                          {record.quality_score}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-mono whitespace-nowrap">
                        {record.batch_id || '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{record.destination || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">
                        {record.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length} records
              </div>
              
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MilkReceptionTable;
