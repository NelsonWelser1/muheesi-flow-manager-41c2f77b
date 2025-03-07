
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Search, FileDown, Printer, Mail, Share2 } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";
import { format } from 'date-fns';

const PersonnelDataDisplay = ({ tableName, title }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: [tableName, searchTerm, timeRange],
    queryFn: async () => {
      let query = supabase.from(tableName).select('*');

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`);
      }

      if (timeRange !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (timeRange) {
          case 'day':
            startDate.setDate(startDate.getDate() - 1);
            break;
          case 'week':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        }
        
        query = query.gte('created_at', startDate.toISOString())
                    .lte('created_at', now.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const handleExport = async (format) => {
    if (!data) return;

    try {
      let content = '';
      const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm');
      let filename = `${title.toLowerCase()}-${timestamp}`;

      if (format === 'csv') {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(',')).join('\n');
        content = `${headers}\n${rows}`;
        filename += '.csv';
        
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
      } else if (format === 'print') {
        window.print();
      }

      toast({
        title: "Success",
        description: `${format.toUpperCase()} export completed`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (method) => {
    try {
      switch (method) {
        case 'email':
          // Email sharing logic would go here
          toast({
            title: "Email Share",
            description: "Email sharing feature coming soon",
          });
          break;
        case 'whatsapp':
          // WhatsApp sharing logic would go here
          toast({
            title: "WhatsApp Share",
            description: "WhatsApp sharing feature coming soon",
          });
          break;
        case 'user':
          // System user sharing logic would go here
          toast({
            title: "User Share",
            description: "User sharing feature coming soon",
          });
          break;
      }
    } catch (error) {
      console.error('Sharing error:', error);
      toast({
        title: "Error",
        description: "Failed to share data",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title} Records</span>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
        <div className="flex justify-between items-center gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <FileDown className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('print')}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={() => handleShare('email')}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" onClick={() => handleShare('whatsapp')}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : !data?.length ? (
          <div className="text-center py-4">No records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {Object.keys(data[0]).map((header) => (
                    <th key={header} className="px-4 py-2 text-left">
                      {header.replace(/_/g, ' ').toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((record, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    {Object.values(record).map((value, i) => (
                      <td key={i} className="px-4 py-2">
                        {typeof value === 'object' ? JSON.stringify(value) : value}
                      </td>
                    ))}
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

export default PersonnelDataDisplay;
