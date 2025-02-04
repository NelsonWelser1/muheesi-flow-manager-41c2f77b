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
import { Calendar as CalendarIcon, Printer, Mail, FileText } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const MaintenanceEntryForm = () => {
  const [formData, setFormData] = useState({
    equipment_name: '',
    maintenance_type: '',
    status: 'pending',
    last_maintenance: new Date(),
    next_maintenance: new Date(),
    health_score: 100,
    notes: '',
    company: 'Grand Berna Dairies', // Added company context
    project: 'Cheese Factory' // Added project context
  });

  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date()
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting maintenance record:', formData);
      
      // Format dates for database
      const formattedData = {
        ...formData,
        last_maintenance: formData.last_maintenance.toISOString(),
        next_maintenance: formData.next_maintenance.toISOString()
      };
      
      // Insert maintenance record
      const { error: maintenanceError } = await supabase
        .from('equipment_maintenance')
        .insert([formattedData]);

      if (maintenanceError) {
        console.error('Maintenance insert error:', maintenanceError);
        throw maintenanceError;
      }

      // Update maintenance stats
      const { data: statsData, error: statsError } = await supabase
        .from('maintenance_stats')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (statsError) throw statsError;

      const updatedStats = {
        completed_today: (statsData?.completed_today || 0) + (formData.status === 'completed' ? 1 : 0),
        equipment_health: formData.health_score,
        pending_maintenance: (statsData?.pending_maintenance || 0) + (formData.status === 'pending' ? 1 : 0)
      };

      const { error: updateStatsError } = await supabase
        .from('maintenance_stats')
        .upsert([{ id: statsData?.id || undefined, ...updatedStats }]);

      if (updateStatsError) throw updateStatsError;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries(['maintenance']);
      queryClient.invalidateQueries(['maintenanceStats']);

      toast({
        title: "Success",
        description: "Maintenance record added successfully",
      });

      // Reset form
      setFormData({
        equipment_name: '',
        maintenance_type: '',
        status: 'pending',
        last_maintenance: new Date(),
        next_maintenance: new Date(),
        health_score: 100,
        notes: '',
        company: 'Grand Berna Dairies',
        project: 'Cheese Factory'
      });

    } catch (error) {
      console.error('Error saving maintenance record:', error);
      toast({
        title: "Error",
        description: "Failed to save maintenance record",
        variant: "destructive",
      });
    }
  };

  const generateReport = async (dateRange) => {
    try {
      console.log('Generating report for date range:', dateRange);
      
      // Save report configuration
      const { error: configError } = await supabase
        .from('report_configurations')
        .insert([{
          report_type: 'maintenance',
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString()
        }]);

      if (configError) throw configError;
      
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('equipment_maintenance')
        .select('*')
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('next_maintenance', { ascending: true });

      if (maintenanceError) throw maintenanceError;

      const { data: statsData, error: statsError } = await supabase
        .from('maintenance_stats')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (statsError) throw statsError;

      return `
        Maintenance Report
        Generated on: ${format(new Date(), 'PPpp')}
        Report Period: ${format(dateRange.from, 'PP')} to ${format(dateRange.to, 'PP')}
        
        Summary:
        - Completed Today: ${statsData?.completed_today || 0}
        - Equipment Health: ${statsData?.equipment_health || 0}%
        - Pending Maintenance: ${statsData?.pending_maintenance || 0}
        
        Equipment Maintenance Schedule:
        ${maintenanceData?.map(item => `
          * ${item.equipment_name}
            - Type: ${item.maintenance_type}
            - Status: ${item.status}
            - Next Maintenance: ${format(new Date(item.next_maintenance), 'PP')}
            - Health Score: ${item.health_score}%
            - Notes: ${item.notes}
        `).join('\n')}
      `;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  };

  const ReportDialog = ({ children, onPrint }) => {
    const [localDateRange, setLocalDateRange] = useState({
      from: new Date(),
      to: new Date()
    });

    return (
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Report Date Range</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localDateRange.from ? format(localDateRange.from, 'PP') : 'Pick start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={localDateRange.from}
                      onSelect={(date) => setLocalDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localDateRange.to ? format(localDateRange.to, 'PP') : 'Pick end date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={localDateRange.to}
                      onSelect={(date) => setLocalDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={() => onPrint(localDateRange)}
            >
              Generate Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const printReport = async (dateRange) => {
    try {
      const reportContent = await generateReport(dateRange);
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Maintenance Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .section { margin: 20px 0; }
              .item { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
            </style>
          </head>
          <body>
            <pre>${reportContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to print report",
        variant: "destructive",
      });
    }
  };

  const emailReport = async (dateRange) => {
    try {
      const reportContent = await generateReport(dateRange);
      const emailUrl = `mailto:?subject=Maintenance Report - ${format(new Date(), 'PP')}&body=${encodeURIComponent(reportContent)}`;
      window.location.href = emailUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to email report",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Entry Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipment_name">Equipment Name</Label>
              <Input
                id="equipment_name"
                value={formData.equipment_name}
                onChange={(e) => handleInputChange('equipment_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maintenance_type">Maintenance Type</Label>
              <Select
                value={formData.maintenance_type}
                onValueChange={(value) => handleInputChange('maintenance_type', value)}
              >
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
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.last_maintenance && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.last_maintenance ? format(formData.last_maintenance, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.last_maintenance}
                    onSelect={(date) => handleInputChange('last_maintenance', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Next Maintenance Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.next_maintenance && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.next_maintenance ? format(formData.next_maintenance, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.next_maintenance}
                    onSelect={(date) => handleInputChange('next_maintenance', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="health_score">Health Score (%)</Label>
              <Input
                id="health_score"
                type="number"
                min="0"
                max="100"
                value={formData.health_score}
                onChange={(e) => handleInputChange('health_score', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any additional notes"
            />
          </div>

          <div className="flex justify-between">
            <div className="space-x-2">
              <ReportDialog onPrint={printReport}>
                <Button type="button" variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </Button>
              </ReportDialog>
              <ReportDialog onPrint={emailReport}>
                <Button type="button" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Report
                </Button>
              </ReportDialog>
              <Button type="button" variant="outline" onClick={() => window.open('/reports', '_blank')}>
                <FileText className="mr-2 h-4 w-4" />
                View All Reports
              </Button>
            </div>
            <Button type="submit">Save Maintenance Record</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MaintenanceEntryForm;
