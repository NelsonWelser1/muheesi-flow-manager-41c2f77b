import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  Calendar,
  Printer,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const RecentOffloadRecords = ({ records = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBy, setFilterBy] = useState('all');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records.filter(record => {
      const matchesSearch = Object.values(record).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'today') {
        const today = new Date().toDateString();
        return matchesSearch && new Date(record.created_at).toDateString() === today;
      }
      if (filterBy === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return matchesSearch && new Date(record.created_at) >= weekAgo;
      }
      if (filterBy === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return matchesSearch && new Date(record.created_at) >= monthAgo;
      }
      return matchesSearch;
    });

    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'supplier':
          aValue = a.supplier_name || '';
          bValue = b.supplier_name || '';
          break;
        case 'volume':
          aValue = parseFloat(a.volume_liters) || 0;
          bValue = parseFloat(b.volume_liters) || 0;
          break;
        case 'fat':
          aValue = parseFloat(a.quality_fat_percentage) || 0;
          bValue = parseFloat(b.quality_fat_percentage) || 0;
          break;
        case 'protein':
          aValue = parseFloat(a.quality_protein_percentage) || 0;
          bValue = parseFloat(b.quality_protein_percentage) || 0;
          break;
        case 'ph':
          aValue = parseFloat(a.quality_ph_level) || 0;
          bValue = parseFloat(b.quality_ph_level) || 0;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [records, searchTerm, sortBy, sortOrder, filterBy]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return filteredAndSortedRecords.slice(startIndex, startIndex + recordsPerPage);
  }, [filteredAndSortedRecords, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedRecords.length / recordsPerPage);

  const toggleRowExpansion = (index) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const exportToExcel = () => {
    const exportData = filteredAndSortedRecords.map(record => ({
      'Date': format(new Date(record.created_at), 'PPP'),
      'Time': format(new Date(record.created_at), 'p'),
      'Tank': record.storage_tank,
      'Supplier': record.supplier_name || 'N/A',
      'Volume (L)': record.volume_liters,
      'Quality Grade': record.quality_check,
      'Fat %': record.quality_fat_percentage || 'N/A',
      'Protein %': record.quality_protein_percentage || 'N/A',
      'pH Level': record.quality_ph_level || 'N/A',
      'Temperature': record.quality_temperature || 'N/A',
      'SCC': record.quality_scc || 'N/A',
      'Moisture %': record.quality_moisture_percentage || 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Milk Offload Records');
    XLSX.writeFile(wb, `milk_offload_records_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const exportToCSV = () => {
    const exportData = filteredAndSortedRecords.map(record => ({
      'Date': format(new Date(record.created_at), 'PPP'),
      'Time': format(new Date(record.created_at), 'p'),
      'Tank': record.storage_tank,
      'Supplier': record.supplier_name || 'N/A',
      'Volume (L)': record.volume_liters,
      'Quality Grade': record.quality_check,
      'Fat %': record.quality_fat_percentage || 'N/A',
      'Protein %': record.quality_protein_percentage || 'N/A',
      'pH Level': record.quality_ph_level || 'N/A',
      'Temperature': record.quality_temperature || 'N/A',
      'SCC': record.quality_scc || 'N/A',
      'Moisture %': record.quality_moisture_percentage || 'N/A'
    }));

    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `milk_offload_records_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Generate printable content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Milk Offload Records</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              font-size: 12px;
            }
            h1 { 
              text-align: center; 
              margin-bottom: 20px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 20px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left;
            }
            th { 
              background-color: #f4f4f4; 
              font-weight: bold;
            }
            .quality-badge {
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 10px;
            }
            .quality-excellent { background-color: #d4edda; color: #155724; }
            .quality-good { background-color: #d1ecf1; color: #0c5460; }
            .quality-fair { background-color: #fff3cd; color: #856404; }
            .quality-poor { background-color: #f8d7da; color: #721c24; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Milk Offload Records</h1>
          <p>Generated on: ${format(new Date(), 'PPP p')}</p>
          <p>Total Records: ${filteredAndSortedRecords.length}</p>
          <table>
            <thead>
              <tr>
                <th>Date/Time</th>
                <th>Tank</th>
                <th>Supplier</th>
                <th>Volume (L)</th>
                <th>Quality</th>
                <th>Fat %</th>
                <th>Protein %</th>
                <th>pH</th>
                <th>Temp</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAndSortedRecords.map(record => `
                <tr>
                  <td>${format(new Date(record.created_at), 'MMM dd, yyyy HH:mm')}</td>
                  <td>${record.storage_tank}</td>
                  <td>${record.supplier_name || 'N/A'}</td>
                  <td>${record.volume_liters}</td>
                  <td>
                    <span class="quality-badge quality-${record.quality_check?.toLowerCase() || 'fair'}">
                      ${record.quality_check || 'N/A'}
                    </span>
                  </td>
                  <td>${record.quality_fat_percentage || 'N/A'}</td>
                  <td>${record.quality_protein_percentage || 'N/A'}</td>
                  <td>${record.quality_ph_level || 'N/A'}</td>
                  <td>${record.quality_temperature || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const getQualityBadgeColor = (quality) => {
    switch (quality?.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!records.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No offload records found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compact Search and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-32 h-9">
              <Calendar className="h-4 w-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-28 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="fat">Fat %</SelectItem>
              <SelectItem value="protein">Protein %</SelectItem>
              <SelectItem value="ph">pH Level</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="h-9 px-2"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToCSV}>
                <FileText className="h-4 w-4 mr-2" />
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print Records
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Compact Records Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Records ({filteredAndSortedRecords.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Date/Time</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Tank</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Supplier</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Volume (L)</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Quality</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Fat %</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Protein %</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">pH</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Details</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((record, index) => {
                  const globalIndex = (currentPage - 1) * recordsPerPage + index;
                  const isExpanded = expandedRows.has(globalIndex);
                  
                  return (
                    <React.Fragment key={record.id || index}>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <div className="text-xs">
                            <div>{format(new Date(record.created_at), 'MMM dd, yyyy')}</div>
                            <div className="text-gray-500">{format(new Date(record.created_at), 'HH:mm')}</div>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant="outline" className="text-xs">
                            {record.storage_tank}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-xs">
                          {record.supplier_name || 'N/A'}
                        </td>
                        <td className="px-3 py-2 text-xs font-medium">
                          {record.volume_liters}
                        </td>
                        <td className="px-3 py-2">
                          <Badge 
                            className={`text-xs ${getQualityBadgeColor(record.quality_check)}`}
                          >
                            {record.quality_check || 'N/A'}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-xs">
                          {record.quality_fat_percentage || 'N/A'}
                        </td>
                        <td className="px-3 py-2 text-xs">
                          {record.quality_protein_percentage || 'N/A'}
                        </td>
                        <td className="px-3 py-2 text-xs">
                          {record.quality_ph_level || 'N/A'}
                        </td>
                        <td className="px-3 py-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(globalIndex)}
                            className="h-6 w-6 p-0"
                          >
                            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                          </Button>
                        </td>
                      </tr>
                      
                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td colSpan="9" className="px-3 py-2">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                              <div>
                                <span className="font-medium text-gray-600">Temperature:</span>
                                <div>{record.quality_temperature || 'N/A'}</div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">SCC:</span>
                                <div>{record.quality_scc || 'N/A'}</div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Moisture:</span>
                                <div>{record.quality_moisture_percentage || 'N/A'}%</div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Operator:</span>
                                <div>{record.operator_name || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Compact Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-3 py-2 border-t bg-gray-50">
              <div className="text-xs text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-7 px-2 text-xs"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="h-7 px-2 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentOffloadRecords;
