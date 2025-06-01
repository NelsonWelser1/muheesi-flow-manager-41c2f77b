
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Download, FileSpreadsheet, Search, Eye, EyeOff } from 'lucide-react';
import * as XLSX from 'xlsx';

const RecentOffloadRecords = ({ records = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBy, setFilterBy] = useState('all');
  const [showDetails, setShowDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Enhanced filtering and sorting
  const filteredRecords = useMemo(() => {
    let filtered = records.filter(record => {
      const matchesSearch = 
        record.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.batch_id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterBy === 'all' || 
        (filterBy === 'today' && new Date(record.created_at).toDateString() === new Date().toDateString()) ||
        (filterBy === 'week' && new Date(record.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (filterBy === 'month' && new Date(record.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

      return matchesSearch && matchesFilter;
    });

    // Enhanced sorting
    filtered.sort((a, b) => {
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
          aValue = Math.abs(parseFloat(a.milk_volume) || 0);
          bValue = Math.abs(parseFloat(b.milk_volume) || 0);
          break;
        case 'quality':
          aValue = a.quality_score || '';
          bValue = b.quality_score || '';
          break;
        case 'fat':
          aValue = parseFloat(a.fat_percentage) || 0;
          bValue = parseFloat(b.fat_percentage) || 0;
          break;
        case 'protein':
          aValue = parseFloat(a.protein_percentage) || 0;
          bValue = parseFloat(b.protein_percentage) || 0;
          break;
        default:
          aValue = a.created_at;
          bValue = b.created_at;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [records, searchTerm, sortBy, sortOrder, filterBy]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleDetails = (id) => {
    setShowDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Enhanced export functions with quality data
  const exportToCSV = () => {
    const csvData = filteredRecords.map(record => ({
      'Batch ID': record.batch_id || 'N/A',
      'Date': new Date(record.created_at).toLocaleString(),
      'Supplier': record.supplier_name || 'N/A',
      'Volume (L)': Math.abs(parseFloat(record.milk_volume) || 0),
      'Tank': record.tank_number || 'N/A',
      'Destination': record.destination || 'N/A',
      'Temperature (°C)': record.temperature || 'N/A',
      'Quality Grade': record.quality_score || 'N/A',
      'Fat (%)': record.fat_percentage || 'N/A',
      'Protein (%)': record.protein_percentage || 'N/A',
      'Total Plate Count': record.total_plate_count || 'N/A',
      'Acidity (pH)': record.acidity || 'N/A',
      'Notes': record.notes || 'N/A'
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `milk_offload_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportToExcel = () => {
    const excelData = filteredRecords.map(record => ({
      'Batch ID': record.batch_id || 'N/A',
      'Date': new Date(record.created_at).toLocaleString(),
      'Supplier': record.supplier_name || 'N/A',
      'Volume (L)': Math.abs(parseFloat(record.milk_volume) || 0),
      'Tank': record.tank_number || 'N/A',
      'Destination': record.destination || 'N/A',
      'Temperature (°C)': record.temperature || 'N/A',
      'Quality Grade': record.quality_score || 'N/A',
      'Fat (%)': record.fat_percentage || 'N/A',
      'Protein (%)': record.protein_percentage || 'N/A',
      'Total Plate Count': record.total_plate_count || 'N/A',
      'Acidity (pH)': record.acidity || 'N/A',
      'Notes': record.notes || 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Milk Offload Records');
    XLSX.writeFile(wb, `milk_offload_records_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getQualityBadgeColor = (quality) => {
    switch (quality) {
      case 'Grade A': return 'bg-green-100 text-green-800';
      case 'Grade B': return 'bg-yellow-100 text-yellow-800';
      case 'Grade C': return 'bg-orange-100 text-orange-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Search and Filter Bar */}
      <div className="flex flex-wrap gap-2 items-center justify-between bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-32 h-8">
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
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
              <SelectItem value="fat">Fat %</SelectItem>
              <SelectItem value="protein">Protein %</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="h-8"
          >
            {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          <Button variant="outline" size="sm" onClick={exportToCSV} className="h-8">
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>

          <Button variant="outline" size="sm" onClick={exportToExcel} className="h-8">
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            Excel
          </Button>
        </div>
      </div>

      {/* Enhanced Records Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-2 font-medium">Batch ID</th>
                <th className="text-left p-2 font-medium">Date & Time</th>
                <th className="text-left p-2 font-medium">Supplier</th>
                <th className="text-left p-2 font-medium">Volume (L)</th>
                <th className="text-left p-2 font-medium">Quality</th>
                <th className="text-left p-2 font-medium">Fat %</th>
                <th className="text-left p-2 font-medium">Protein %</th>
                <th className="text-left p-2 font-medium">pH</th>
                <th className="text-left p-2 font-medium">Temp °C</th>
                <th className="text-left p-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <React.Fragment key={record.id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="font-mono text-xs">
                        {record.batch_id || 'N/A'}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-xs">
                        {new Date(record.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(record.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="font-medium truncate max-w-[120px]">
                        {record.supplier_name || 'N/A'}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="font-medium text-blue-600">
                        {Math.abs(parseFloat(record.milk_volume) || 0).toFixed(1)}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge className={`text-xs ${getQualityBadgeColor(record.quality_score)}`}>
                        {record.quality_score || 'N/A'}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-green-600">
                          {record.fat_percentage ? `${parseFloat(record.fat_percentage).toFixed(1)}%` : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-purple-600">
                          {record.protein_percentage ? `${parseFloat(record.protein_percentage).toFixed(1)}%` : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-orange-600">
                          {record.acidity ? parseFloat(record.acidity).toFixed(1) : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="text-gray-600">
                        {record.temperature ? `${parseFloat(record.temperature).toFixed(1)}°C` : 'N/A'}
                      </span>
                    </td>
                    <td className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDetails(record.id)}
                        className="h-6 w-6 p-0"
                      >
                        {showDetails[record.id] ? 
                          <EyeOff className="h-3 w-3" /> : 
                          <Eye className="h-3 w-3" />
                        }
                      </Button>
                    </td>
                  </tr>
                  
                  {/* Enhanced Details Row */}
                  {showDetails[record.id] && (
                    <tr className="bg-blue-50 border-b">
                      <td colSpan="10" className="p-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-700">Storage & Destination</h4>
                            <div><span className="font-medium">Tank:</span> {record.tank_number || 'N/A'}</div>
                            <div><span className="font-medium">Destination:</span> {record.destination || 'N/A'}</div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-700">Quality Parameters</h4>
                            <div><span className="font-medium">Total Plate Count:</span> {record.total_plate_count || 'N/A'}</div>
                            <div><span className="font-medium">Fat Content:</span> {record.fat_percentage ? `${record.fat_percentage}%` : 'N/A'}</div>
                            <div><span className="font-medium">Protein Content:</span> {record.protein_percentage ? `${record.protein_percentage}%` : 'N/A'}</div>
                            <div><span className="font-medium">Acidity (pH):</span> {record.acidity || 'N/A'}</div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-700">Additional Information</h4>
                            <div><span className="font-medium">Temperature:</span> {record.temperature ? `${record.temperature}°C` : 'N/A'}</div>
                            <div><span className="font-medium">Notes:</span> {record.notes || 'No notes'}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {currentRecords.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No records found matching your criteria.
          </div>
        )}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentOffloadRecords;
