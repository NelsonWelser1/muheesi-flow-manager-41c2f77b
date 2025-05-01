
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Loader } from 'lucide-react';
import { format } from 'date-fns';

const HarvestTable = ({ records, isFetching, searchTerm, setSearchTerm, cropTypes }) => {
  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (record.crop_type && cropTypes.find(c => c.value === record.crop_type)?.label.toLowerCase().includes(search)) ||
      (record.variety && record.variety.toLowerCase().includes(search)) ||
      (record.plot_id && record.plot_id.toLowerCase().includes(search)) ||
      (record.notes && record.notes.toLowerCase().includes(search))
    );
  });
  
  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <CardTitle>Harvest Records</CardTitle>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isFetching ? (
          <div className="flex justify-center items-center py-8">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading records...</span>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            {records.length === 0 
              ? "No harvest records added yet. Use the form above to add records."
              : "No matching records found. Try a different search term."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Crop</TableHead>
                  <TableHead>Variety</TableHead>
                  <TableHead>Plot</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date ? format(new Date(record.date), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                    <TableCell>{cropTypes.find(c => c.value === record.crop_type)?.label || 'N/A'}</TableCell>
                    <TableCell>{record.variety || 'N/A'}</TableCell>
                    <TableCell>{record.plot_id || 'N/A'}</TableCell>
                    <TableCell>{record.quantity} {record.unit}</TableCell>
                    <TableCell>
                      <span className={`capitalize ${
                        record.quality === 'excellent' ? 'text-green-600' : 
                        record.quality === 'good' ? 'text-green-500' : 
                        record.quality === 'average' ? 'text-yellow-500' : 
                        'text-red-500'
                      }`}>
                        {record.quality}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{record.notes || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HarvestTable;
