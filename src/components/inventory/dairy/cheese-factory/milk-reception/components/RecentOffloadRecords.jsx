
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Printer, Eye, EyeOff, FileText, ChevronLeft, ChevronRight, Search, Download, FileSpreadsheet } from "lucide-react";
import { useBillsExpensesPagination } from "../../../accounts/records/hooks/useBillsExpensesPagination";
import * as XLSX from 'xlsx';

const RecentOffloadRecords = ({ records = [] }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [timeFilter, setTimeFilter] = useState("all");

  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records.filter(record => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        record.supplier_name?.toLowerCase().includes(searchLower) ||
        record.tank_number?.toLowerCase().includes(searchLower) ||
        record.quality_check?.toLowerCase().includes(searchLower) ||
        record.notes?.toLowerCase().includes(searchLower)
      );
    });

    // Time filter
    if (timeFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (timeFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(record => new Date(record.created_at) >= filterDate);
          break;
        case "week":
          filterDate.setDate(filterDate.getDate() - 7);
          filtered = filtered.filter(record => new Date(record.created_at) >= filterDate);
          break;
        case "month":
          filterDate.setMonth(filterDate.getMonth() - 1);
          filtered = filtered.filter(record => new Date(record.created_at) >= filterDate);
          break;
        case "year":
          filterDate.setFullYear(filterDate.getFullYear() - 1);
          filtered = filtered.filter(record => new Date(record.created_at) >= filterDate);
          break;
      }
    }

    // Sort records
    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      
      switch (sortBy) {
        case "date-asc":
          return dateA - dateB;
        case "date-desc":
          return dateB - dateA;
        case "supplier-asc":
          return (a.supplier_name || "").localeCompare(b.supplier_name || "");
        case "supplier-desc":
          return (b.supplier_name || "").localeCompare(a.supplier_name || "");
        case "volume-asc":
          return (a.milk_volume || 0) - (b.milk_volume || 0);
        case "volume-desc":
          return (b.milk_volume || 0) - (a.milk_volume || 0);
        default:
          return dateB - dateA;
      }
    });
  }, [records, searchTerm, sortBy, timeFilter]);

  const {
    paginatedData,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    handlePageChange
  } = useBillsExpensesPagination(filteredAndSortedRecords, 15);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatVolume = (volume) => {
    if (volume === null || volume === undefined) return "N/A";
    return `${Number(volume).toFixed(1)}L`;
  };

  const formatTemperature = (temp) => {
    if (temp === null || temp === undefined) return "N/A";
    return `${Number(temp).toFixed(1)}°C`;
  };

  const getQualityBadgeColor = (quality) => {
    switch (quality?.toLowerCase()) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200";
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "average":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "poor":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTankBadgeColor = (tank) => {
    switch (tank) {
      case "Tank A":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Tank B":
        return "bg-green-100 text-green-800 border-green-200";
      case "Direct-Processing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const exportToCSV = () => {
    const csvData = filteredAndSortedRecords.map(record => ({
      'Date': formatDate(record.created_at),
      'Supplier': record.supplier_name || 'N/A',
      'Tank': record.tank_number || 'N/A',
      'Volume (L)': record.milk_volume ? Number(record.milk_volume).toFixed(1) : 'N/A',
      'Temperature (°C)': record.temperature ? Number(record.temperature).toFixed(1) : 'N/A',
      'Quality': record.quality_check || 'N/A',
      'Fat %': record.fat_content ? Number(record.fat_content).toFixed(1) : 'N/A',
      'Protein %': record.protein_content ? Number(record.protein_content).toFixed(1) : 'N/A',
      'pH': record.ph_level ? Number(record.ph_level).toFixed(1) : 'N/A',
      'Notes': record.notes || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `milk_reception_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const excelData = filteredAndSortedRecords.map(record => ({
      'Date': formatDate(record.created_at),
      'Supplier': record.supplier_name || 'N/A',
      'Tank': record.tank_number || 'N/A',
      'Volume (L)': record.milk_volume ? Number(record.milk_volume).toFixed(1) : 'N/A',
      'Temperature (°C)': record.temperature ? Number(record.temperature).toFixed(1) : 'N/A',
      'Quality': record.quality_check || 'N/A',
      'Fat %': record.fat_content ? Number(record.fat_content).toFixed(1) : 'N/A',
      'Protein %': record.protein_content ? Number(record.protein_content).toFixed(1) : 'N/A',
      'pH': record.ph_level ? Number(record.ph_level).toFixed(1) : 'N/A',
      'Notes': record.notes || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Milk Reception Records');
    XLSX.writeFile(workbook, `milk_reception_records_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handlePrint = () => {
    const tableHtml = `
      <html>
      <head>
        <title>Milk Reception Records</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Milk Reception Records</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Supplier</th>
              <th>Tank</th>
              <th>Volume (L)</th>
              <th>Temperature (°C)</th>
              <th>Quality</th>
              <th>Fat (%)</th>
              <th>Protein (%)</th>
              <th>pH</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${filteredAndSortedRecords.map(record => `
              <tr>
                <td>${formatDate(record.created_at)}</td>
                <td>${record.supplier_name || 'N/A'}</td>
                <td>${record.tank_number || 'N/A'}</td>
                <td>${record.milk_volume ? Number(record.milk_volume).toFixed(1) : 'N/A'}</td>
                <td>${record.temperature ? Number(record.temperature).toFixed(1) : 'N/A'}</td>
                <td>${record.quality_check || 'N/A'}</td>
                <td>${record.fat_content ? Number(record.fat_content).toFixed(1) : 'N/A'}</td>
                <td>${record.protein_content ? Number(record.protein_content).toFixed(1) : 'N/A'}</td>
                <td>${record.ph_level ? Number(record.ph_level).toFixed(1) : 'N/A'}</td>
                <td>${record.notes || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
  
    const printWindow = window.open('', '_blank');
    printWindow.document.write(tableHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (!records || records.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No offload records available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with compact controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Recent Offload Records</h3>
          <Badge variant="secondary" className="text-xs">
            {totalItems} total
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-xs px-2 py-1"
          >
            {showDetails ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {showDetails ? "Less" : "Details"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="flex items-center gap-1 text-xs px-2 py-1"
          >
            <Download className="h-3 w-3" />
            CSV
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            className="flex items-center gap-1 text-xs px-2 py-1"
          >
            <FileSpreadsheet className="h-3 w-3" />
            Excel
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1 text-xs px-2 py-1"
          >
            <Printer className="h-3 w-3" />
            Print
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Filter by time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Date (Newest)</SelectItem>
            <SelectItem value="date-asc">Date (Oldest)</SelectItem>
            <SelectItem value="supplier-asc">Supplier (A-Z)</SelectItem>
            <SelectItem value="supplier-desc">Supplier (Z-A)</SelectItem>
            <SelectItem value="volume-desc">Volume (Highest)</SelectItem>
            <SelectItem value="volume-asc">Volume (Lowest)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pagination info and controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-gray-600">
        <span>
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
        </span>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            
            <span className="text-xs px-2">
              {currentPage} / {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Compact table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="py-2 text-xs font-medium">Date</TableHead>
              <TableHead className="py-2 text-xs font-medium">Supplier</TableHead>
              <TableHead className="py-2 text-xs font-medium">Tank</TableHead>
              <TableHead className="py-2 text-xs font-medium">Volume</TableHead>
              <TableHead className="py-2 text-xs font-medium">Temp</TableHead>
              <TableHead className="py-2 text-xs font-medium">Quality</TableHead>
              {showDetails && (
                <>
                  <TableHead className="py-2 text-xs font-medium">Fat %</TableHead>
                  <TableHead className="py-2 text-xs font-medium">Protein %</TableHead>
                  <TableHead className="py-2 text-xs font-medium">pH</TableHead>
                  <TableHead className="py-2 text-xs font-medium">Notes</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((record, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="py-2 text-xs">
                  {formatDate(record.created_at)}
                </TableCell>
                <TableCell className="py-2 text-xs">
                  {record.supplier_name || "N/A"}
                </TableCell>
                <TableCell className="py-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-1 py-0 ${getTankBadgeColor(record.tank_number)}`}
                  >
                    {record.tank_number || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="py-2 text-xs font-medium">
                  {formatVolume(record.milk_volume)}
                </TableCell>
                <TableCell className="py-2 text-xs">
                  {formatTemperature(record.temperature)}
                </TableCell>
                <TableCell className="py-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-1 py-0 ${getQualityBadgeColor(record.quality_check)}`}
                  >
                    {record.quality_check || "N/A"}
                  </Badge>
                </TableCell>
                {showDetails && (
                  <>
                    <TableCell className="py-2 text-xs">
                      {record.fat_content ? Number(record.fat_content).toFixed(1) : "N/A"}
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      {record.protein_content ? Number(record.protein_content).toFixed(1) : "N/A"}
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      {record.ph_level ? Number(record.ph_level).toFixed(1) : "N/A"}
                    </TableCell>
                    <TableCell className="py-2 text-xs max-w-32 truncate">
                      {record.notes || "N/A"}
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentOffloadRecords;
