
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropletIcon, Search, RefreshCw, Calendar, Table as TableIcon } from "lucide-react";
import { format } from 'date-fns';
import { useMilkProduction } from '@/hooks/useMilkProduction';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MilkProductionRecords = () => {
  const { milkRecords, isLoading, fetchMilkProduction } = useMilkProduction();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSession, setFilterSession] = useState('');
  
  // Session translations for display
  const sessionLabels = {
    'morning': 'Morning',
    'midday': 'Midday',
    'evening': 'Evening'
  };
  
  // Calculate average milk per cow
  const calculateAverage = (volume, cows) => {
    if (!volume || !cows || cows <= 0) return 'N/A';
    return (Number(volume) / Number(cows)).toFixed(2);
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchMilkProduction();
  };
  
  // Filter records based on search term and session filter
  const filteredRecords = milkRecords.filter(record => {
    const matchesSearch = searchTerm === '' || 
      record.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSession = filterSession === '' || record.session === filterSession;
    
    return matchesSearch && matchesSession;
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <TableIcon className="h-5 w-5 text-blue-500" />
            Milk Production Records
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="ml-2">{isLoading ? 'Loading...' : 'Refresh'}</span>
          </Button>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location or notes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select 
            value={filterSession} 
            onValueChange={setFilterSession}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All sessions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All sessions</SelectItem>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="midday">Midday</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-2" />
            <p>Loading records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <DropletIcon className="h-12 w-12 mx-auto opacity-20 mb-2" />
            <p>No milk production records found</p>
            <p className="text-sm">Add your first record using the form above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-3 text-left font-medium">Date</th>
                  <th className="py-2 px-3 text-left font-medium">Session</th>
                  <th className="py-2 px-3 text-left font-medium">Volume (L)</th>
                  <th className="py-2 px-3 text-left font-medium">Cows</th>
                  <th className="py-2 px-3 text-left font-medium">Avg L/Cow</th>
                  <th className="py-2 px-3 text-left font-medium">Fat %</th>
                  <th className="py-2 px-3 text-left font-medium">Protein %</th>
                  <th className="py-2 px-3 text-left font-medium">Location</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-3">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                        {format(new Date(record.date), 'dd MMM yyyy')}
                      </div>
                    </td>
                    <td className="py-2 px-3">{sessionLabels[record.session]}</td>
                    <td className="py-2 px-3 font-medium">{record.volume} L</td>
                    <td className="py-2 px-3">{record.milking_cows}</td>
                    <td className="py-2 px-3">{calculateAverage(record.volume, record.milking_cows)}</td>
                    <td className="py-2 px-3">{record.fat_content ? `${record.fat_content}%` : 'N/A'}</td>
                    <td className="py-2 px-3">{record.protein_content ? `${record.protein_content}%` : 'N/A'}</td>
                    <td className="py-2 px-3">{record.location || 'Main Farm'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MilkProductionRecords;
