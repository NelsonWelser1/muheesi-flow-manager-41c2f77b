import React, { useState } from 'react';
import { Calendar, Syringe, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useHealthRecords } from '@/hooks/useHealthRecords';
import AddHealthRecordDialog from "../../../cattle/health/AddHealthRecordDialog";

const HealthRecordsView = () => {
  const { healthRecords, isLoading, error, refetch } = useHealthRecords();
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calculate statistics
  const totalRecords = healthRecords?.length || 0;
  const vaccinationCount = healthRecords?.filter(r => r.record_type === 'vaccination').length || 0;
  const treatmentCount = healthRecords?.filter(r => r.record_type === 'treatment').length || 0;
  
  // Filter records based on type and search term
  const filteredRecords = healthRecords?.filter(record => {
    const matchesType = filterType === 'all' || record.record_type === filterType;
    const matchesSearch = searchTerm === '' || 
      (record.cattle_inventory?.tag_number?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Cattle Health Records</h2>
        <div className="flex space-x-2">
          <Button onClick={() => refetch()} variant="outline">Refresh Data</Button>
          <AddHealthRecordDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <h3 className="text-2xl font-bold">{totalRecords}</h3>
            </div>
            <Calendar className="h-8 w-8 text-purple-500 opacity-80" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Vaccinations</p>
              <h3 className="text-2xl font-bold">{vaccinationCount}</h3>
            </div>
            <Syringe className="h-8 w-8 text-blue-500 opacity-80" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Treatments</p>
              <h3 className="text-2xl font-bold">{treatmentCount}</h3>
            </div>
            <Activity className="h-8 w-8 text-green-500 opacity-80" />
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <Input 
            placeholder="Search by tag or description..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="examination">Examinations</SelectItem>
            <SelectItem value="vaccination">Vaccinations</SelectItem>
            <SelectItem value="treatment">Treatments</SelectItem>
            <SelectItem value="surgery">Surgeries</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <ScrollArea className="h-[400px]">
          <div className="rounded-md border">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="p-3 text-left font-medium">Tag #</th>
                  <th className="p-3 text-left font-medium">Record Type</th>
                  <th className="p-3 text-left font-medium">Date</th>
                  <th className="p-3 text-left font-medium">Description</th>
                  <th className="p-3 text-left font-medium">Treatment</th>
                  <th className="p-3 text-left font-medium">Next Due</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr className="border-t">
                    <td className="p-3" colSpan="6">
                      <p className="text-center text-muted-foreground">Loading health records...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr className="border-t">
                    <td className="p-3" colSpan="6">
                      <p className="text-center text-red-500">Error loading health records: {error.message}</p>
                    </td>
                  </tr>
                ) : filteredRecords && filteredRecords.length > 0 ? (
                  filteredRecords.map(record => (
                    <tr key={record.id} className="border-t hover:bg-muted/50 transition-colors">
                      <td className="p-3">{record.cattle_inventory?.tag_number || 'N/A'}</td>
                      <td className="p-3 capitalize">{record.record_type}</td>
                      <td className="p-3">{new Date(record.record_date).toLocaleDateString()}</td>
                      <td className="p-3">{record.description}</td>
                      <td className="p-3">{record.treatment || 'N/A'}</td>
                      <td className="p-3">{record.next_due_date ? new Date(record.next_due_date).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t">
                    <td className="p-3" colSpan="6">
                      <p className="text-center text-muted-foreground">No health records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default HealthRecordsView;
