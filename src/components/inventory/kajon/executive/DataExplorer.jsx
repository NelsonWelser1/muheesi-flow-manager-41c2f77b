
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from '@/hooks/useDebounce';
import { exportToCSV, exportToExcel, exportToPDF } from '@/utils/coffee/coffeeExport';

const DataExplorer = ({ dataSources = [], fetchData }) => {
  const [selectedDataSource, setSelectedDataSource] = useState(dataSources && dataSources.length > 0 ? dataSources[0] : '');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { toast } = useToast();

  const columns = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    const firstItem = data[0];
    if (!firstItem) return [];
    
    return Object.keys(firstItem).map(key => ({
      accessorKey: key,
      header: key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
    }));
  }, [data]);

  const fetchDataFromSource = useCallback(async (source) => {
    if (!source) return;
    
    setIsLoading(true);
    try {
      const fetchedData = await fetchData(source);
      setData(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Fetch failed",
        description: error.message || "Failed to retrieve data",
        variant: "destructive"
      });
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, toast]);

  useEffect(() => {
    if (selectedDataSource) {
      fetchDataFromSource(selectedDataSource);
    }
  }, [selectedDataSource, fetchDataFromSource]);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setFilteredData(data);
      return;
    }

    const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
    const results = data.filter(item =>
      Object.values(item).some(value =>
        value !== null && 
        value !== undefined && 
        typeof value === 'string' && 
        value.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
    setFilteredData(results);
  }, [data, debouncedSearchTerm]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleExport = (format) => {
    if (!filteredData || filteredData.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no records available for export",
        variant: "destructive"
      });
      return;
    }

    try {
      // Make sure selectedDataSource is a string before using string methods
      const sourceName = typeof selectedDataSource === 'string' ? selectedDataSource : 'data';
      const exportFilename = `${sourceName.toLowerCase().replace(/\s+/g, '-')}-data`;
      
      switch (format) {
        case 'pdf':
          exportToPDF(filteredData, exportFilename, sourceName.toLowerCase());
          break;
        case 'excel':
          exportToExcel(filteredData, exportFilename);
          break;
        case 'csv':
          exportToCSV(filteredData, exportFilename);
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
      
      toast({
        title: "Export successful",
        description: `Data exported to ${format.toUpperCase()} successfully`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: error.message || "Failed to export data",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="data-source">Data Source:</label>
            <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
              <SelectTrigger id="data-source">
                <SelectValue placeholder="Select a data source" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(dataSources) && dataSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="search">Search:</label>
            <Input
              type="search"
              id="search"
              placeholder="Enter search term..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-x-2">
            <Button size="sm" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button size="sm" onClick={() => handleExport('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button size="sm" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
          <ScrollArea className="rounded-md border">
            <Table>
              <TableCaption>A list of your data.</TableCaption>
              <TableHeader>
                {columns.map((column) => (
                  <TableHead key={column.accessorKey}>{column.header}</TableHead>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length || 1} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : filteredData && filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell key={column.accessorKey}>
                          {row[column.accessorKey] !== null && row[column.accessorKey] !== undefined 
                            ? String(row[column.accessorKey]) 
                            : ''}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length || 1} className="text-center">No results found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExplorer;
