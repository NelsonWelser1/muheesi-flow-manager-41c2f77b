import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Search, Download, ArrowLeft, ArrowRight, Printer, FileText } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
const MaintenanceEntryForm = () => {
  const [formData, setFormData] = useState({
    equipment_name: '',
    maintenance_type: '',
    status: 'due',
    last_maintenance: new Date(),
    next_maintenance: new Date(),
    health_score: 100,
    notes: '',
    company: 'Grand Berna Dairies',
    project: 'Cheese Factory'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date()
  });
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month', 'year', 'all'

  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const {
    data: maintenanceRecords,
    isLoading
  } = useQuery({
    queryKey: ['maintenance', dateRange, searchQuery],
    queryFn: async () => {
      console.log('Fetching maintenance records...');
      const {
        data,
        error
      } = await supabase.from('maintenance_records').select('*').order('next_maintenance', {
        ascending: true
      });
      if (error) {
        console.error('Error fetching maintenance records:', error);
        throw error;
      }
      console.log('Fetched maintenance records:', data);
      return data;
    }
  });
  const handleDateRangeChange = direction => {
    const newDateRange = {
      ...dateRange
    };
    if (direction === 'next') {
      switch (viewMode) {
        case 'day':
          newDateRange.end = new Date(dateRange.end.setDate(dateRange.end.getDate() + 1));
          break;
        case 'week':
          newDateRange.end = new Date(dateRange.end.setDate(dateRange.end.getDate() + 7));
          break;
        case 'month':
          newDateRange.end = new Date(dateRange.end.setMonth(dateRange.end.getMonth() + 1));
          break;
      }
    } else {
      switch (viewMode) {
        case 'day':
          newDateRange.start = new Date(dateRange.start.setDate(dateRange.start.getDate() - 1));
          break;
        case 'week':
          newDateRange.start = new Date(dateRange.start.setDate(dateRange.start.getDate() - 7));
          break;
        case 'month':
          newDateRange.start = new Date(dateRange.start.setMonth(dateRange.start.getMonth() - 1));
          break;
      }
    }
    setDateRange(newDateRange);
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Equipment', 'Type', 'Status', 'Next Maintenance', 'Health Score']],
      body: maintenanceRecords?.map(record => [record.equipment_name, record.maintenance_type, record.status, format(new Date(record.next_maintenance), 'PP'), record.health_score]) || []
    });
    doc.save('maintenance-records.pdf');
  };
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(maintenanceRecords || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Maintenance Records");
    XLSX.writeFile(wb, "maintenance-records.xlsx");
  };
  const exportToCSV = () => {
    const csv = maintenanceRecords?.map(record => Object.values(record).join(',')).join('\n');
    const blob = new Blob([csv], {
      type: 'text/csv'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maintenance-records.csv';
    a.click();
  };
  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} with value:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    try {
      const formattedData = {
        ...formData,
        last_maintenance: formData.last_maintenance.toISOString(),
        next_maintenance: formData.next_maintenance.toISOString(),
        health_score: parseInt(formData.health_score),
        status: formData.status || 'due'
      };
      console.log('Formatted data for submission:', formattedData);
      const {
        data,
        error
      } = await supabase.from('maintenance_records').insert([formattedData]).select();
      if (error) {
        console.error('Error saving maintenance record:', error);
        throw error;
      }
      console.log('Maintenance record saved successfully:', data);
      toast({
        title: "Success",
        description: "Maintenance record saved successfully"
      });
      setFormData({
        equipment_name: '',
        maintenance_type: '',
        status: 'due',
        last_maintenance: new Date(),
        next_maintenance: new Date(),
        health_score: 100,
        notes: '',
        company: 'Grand Berna Dairies',
        project: 'Cheese Factory'
      });
      queryClient.invalidateQueries(['maintenance']);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save maintenance record",
        variant: "destructive"
      });
    }
  };
  return <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Entry Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="equipment_name">Equipment Name</Label>
                <Input id="equipment_name" value={formData.equipment_name} onChange={e => handleInputChange('equipment_name', e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance_type">Maintenance Type</Label>
                <Select value={formData.maintenance_type} onValueChange={value => handleInputChange('maintenance_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine Check</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="replacement">Part Replacement</SelectItem>
                    <SelectItem value="calibration">Calibration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Last Maintenance Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.last_maintenance && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.last_maintenance ? format(formData.last_maintenance, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={formData.last_maintenance} onSelect={date => handleInputChange('last_maintenance', date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Next Maintenance Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.next_maintenance && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.next_maintenance ? format(formData.next_maintenance, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={formData.next_maintenance} onSelect={date => handleInputChange('next_maintenance', date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={value => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="due">Due</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="health_score">Health Score (%)</Label>
                <Input id="health_score" type="number" min="0" max="100" value={formData.health_score} onChange={e => handleInputChange('health_score', parseInt(e.target.value))} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} placeholder="Add any additional notes" />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Maintenance Record</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Maintenance Records</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => handleDateRangeChange('prev')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
                <SelectItem value="all">View All</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => handleDateRangeChange('next')}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search records..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8" />
              </div>
              
              <Button variant="outline" onClick={exportToCSV}>
                <FileText className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" onClick={exportToExcel}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
              </Button>
            </div>

            {isLoading ? <div className="text-center py-4">Loading records...</div> : <div className="border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Maintenance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {maintenanceRecords?.map(record => <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{record.equipment_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{record.maintenance_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{record.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{format(new Date(record.next_maintenance), 'PP')}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{record.health_score}%</td>
                      </tr>)}
                  </tbody>
                </table>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default MaintenanceEntryForm;