import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Printer, Eye, EyeOff, FileText } from 'lucide-react';
import { useBillsExpensesPagination } from "../../../accounts/records/hooks/useBillsExpensesPagination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

const RecentOffloadRecords = ({ records = [] }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const {
    paginatedData,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    handlePageChange
  } = useBillsExpensesPagination(records, 15);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatVolume = (volume) => {
    if (volume === null || volume === undefined) return 'N/A';
    return `${Number(volume).toFixed(1)}L`;
  };

  const formatTemperature = (temp) => {
    if (temp === null || temp === undefined) return 'N/A';
    return `${Number(temp).toFixed(1)}°C`;
  };

  const getQualityBadgeColor = (quality) => {
    switch (quality?.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'average':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTankBadgeColor = (tank) => {
    switch (tank) {
      case 'Tank A':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tank B':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Direct-Processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Summary calculations
  const totalRecords = records.length;
  const totalVolume = records.reduce((sum, record) => sum + (Number(record.milk_volume) || 0), 0);
  const avgTemperature = records.length > 0 
    ? records.reduce((sum, record) => sum + (Number(record.temperature) || 0), 0) / records.length 
    : 0;

  const tankSummary = records.reduce((acc, record) => {
    const tank = record.tank_number || 'Unknown';
    acc[tank] = (acc[tank] || 0) + (Number(record.milk_volume) || 0);
    return acc;
  }, {});

  const qualitySummary = records.reduce((acc, record) => {
    const quality = record.quality_check || 'Unknown';
    acc[quality] = (acc[quality] || 0) + 1;
    return acc;
  }, {});

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Milk Reception Records - ${formatDate(new Date())}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .summary { margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
            .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
            .summary-item { background: white; padding: 10px; border-radius: 3px; border-left: 4px solid #007bff; }
            .summary-label { font-weight: bold; color: #333; margin-bottom: 5px; }
            .summary-value { font-size: 1.2em; color: #007bff; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .quality-excellent { background-color: #d4edda; }
            .quality-good { background-color: #cce7ff; }
            .quality-average { background-color: #fff3cd; }
            .quality-poor { background-color: #f8d7da; }
            .tank-a { background-color: #cce7ff; }
            .tank-b { background-color: #d4edda; }
            .tank-direct { background-color: #e7ccff; }
            .footer { margin-top: 30px; text-align: center; font-size: 0.9em; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Milk Reception Records Report</h1>
            <p>Generated on: ${formatDate(new Date())}</p>
            <p>Total Records: ${totalRecords} | Showing: ${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}</p>
          </div>
          
          <div class="summary">
            <h2>Summary Statistics (All Records)</h2>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-label">Total Records</div>
                <div class="summary-value">${totalRecords}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Total Volume</div>
                <div class="summary-value">${formatVolume(totalVolume)}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Average Temperature</div>
                <div class="summary-value">${formatTemperature(avgTemperature)}</div>
              </div>
            </div>
            
            <h3>Volume by Tank</h3>
            <div class="summary-grid">
              ${Object.entries(tankSummary).map(([tank, volume]) => `
                <div class="summary-item">
                  <div class="summary-label">${tank}</div>
                  <div class="summary-value">${formatVolume(volume)}</div>
                </div>
              `).join('')}
            </div>
            
            <h3>Quality Distribution</h3>
            <div class="summary-grid">
              ${Object.entries(qualitySummary).map(([quality, count]) => `
                <div class="summary-item">
                  <div class="summary-label">${quality}</div>
                  <div class="summary-value">${count} records</div>
                </div>
              `).join('')}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Supplier</th>
                <th>Tank</th>
                <th>Volume (L)</th>
                <th>Temperature (°C)</th>
                <th>Quality</th>
                <th>Fat Content (%)</th>
                <th>Protein (%)</th>
                <th>pH Level</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${paginatedData.map((record) => `
                <tr class="quality-${(record.quality_check || '').toLowerCase()} tank-${(record.tank_number || '').toLowerCase().replace(/[^a-z]/g, '')}">
                  <td>${formatDate(record.created_at)}</td>
                  <td>${record.supplier_name || 'N/A'}</td>
                  <td>${record.tank_number || 'N/A'}</td>
                  <td>${formatVolume(record.milk_volume)}</td>
                  <td>${formatTemperature(record.temperature)}</td>
                  <td>${record.quality_check || 'N/A'}</td>
                  <td>${record.fat_content ? Number(record.fat_content).toFixed(1) : 'N/A'}</td>
                  <td>${record.protein_content ? Number(record.protein_content).toFixed(1) : 'N/A'}</td>
                  <td>${record.ph_level ? Number(record.ph_level).toFixed(1) : 'N/A'}</td>
                  <td>${record.notes || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This report contains ${paginatedData.length} records from page ${currentPage} of ${totalPages}</p>
            <p>Printed from Milk Reception Management System</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
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
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Offload Records</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2"
          >
            {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalRecords}</div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatVolume(totalVolume)}</div>
              <div className="text-sm text-gray-600">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{formatTemperature(avgTemperature)}</div>
              <div className="text-sm text-gray-600">Avg Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Object.keys(tankSummary).length}</div>
              <div className="text-sm text-gray-600">Active Tanks</div>
            </div>
          </div>

          {/* Tank Distribution */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Volume by Tank</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(tankSummary).map(([tank, volume]) => (
                <Badge key={tank} className={getTankBadgeColor(tank)}>
                  {tank}: {formatVolume(volume)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quality Distribution */}
          <div>
            <h4 className="font-medium mb-2">Quality Distribution</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(qualitySummary).map(([quality, count]) => (
                <Badge key={quality} className={getQualityBadgeColor(quality)}>
                  {quality}: {count} records
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Tank</TableHead>
                  <TableHead>Volume (L)</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>Quality</TableHead>
                  {showDetails && (
                    <>
                      <TableHead>Fat Content (%)</TableHead>
                      <TableHead>Protein (%)</TableHead>
                      <TableHead>pH Level</TableHead>
                      <TableHead>Notes</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {formatDate(record.created_at)}
                    </TableCell>
                    <TableCell>{record.supplier_name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className={getTankBadgeColor(record.tank_number)}>
                        {record.tank_number || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatVolume(record.milk_volume)}
                    </TableCell>
                    <TableCell>{formatTemperature(record.temperature)}</TableCell>
                    <TableCell>
                      <Badge className={getQualityBadgeColor(record.quality_check)}>
                        {record.quality_check || 'N/A'}
                      </Badge>
                    </TableCell>
                    {showDetails && (
                      <>
                        <TableCell>
                          {record.fat_content ? Number(record.fat_content).toFixed(1) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {record.protein_content ? Number(record.protein_content).toFixed(1) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {record.ph_level ? Number(record.ph_level).toFixed(1) : 'N/A'}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {record.notes || 'N/A'}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} records
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default RecentOffloadRecords;
