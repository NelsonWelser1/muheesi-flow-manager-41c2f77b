
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, Download } from "lucide-react";

const SalesTable = ({ salesData }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date_time', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sort function
  const sortedData = [...salesData].sort((a, b) => {
    if (sortConfig.key === 'date_time') {
      const dateA = new Date(a[sortConfig.key]);
      const dateB = new Date(b[sortConfig.key]);
      
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Search filter
  const filteredData = sortedData.filter(sale => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      sale.customer_name.toLowerCase().includes(searchTermLower) || 
      new Date(sale.date_time).toLocaleDateString().includes(searchTerm)
    );
  });
  
  // Sort handler
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Customer', 'Amount'];
    
    const csvData = filteredData.map(sale => [
      new Date(sale.date_time).toLocaleDateString(),
      sale.customer_name,
      (sale.quantity * sale.price_per_unit).toFixed(2)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportToCSV}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => requestSort('date_time')}
                >
                  Date
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => requestSort('customer_name')}
                >
                  Customer
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => requestSort('quantity')}
                >
                  Amount
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((sale) => (
                <tr key={sale.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-2">{new Date(sale.date_time).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{sale.customer_name}</td>
                  <td className="px-4 py-2">${(sale.quantity * sale.price_per_unit).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center text-muted-foreground">
                  {searchTerm ? "No matching sales found" : "No sales data available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} of {salesData.length} sales records
      </div>
    </div>
  );
};

export default SalesTable;
