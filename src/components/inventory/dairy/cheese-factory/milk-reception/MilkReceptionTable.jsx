import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileDown, Image } from 'lucide-react';
import { generateMonthlyReport, generateAnnualReport, downloadAsCSV, downloadAsJPG } from '@/utils/reportUtils';
import { useToast } from "@/components/ui/use-toast";

const MilkReceptionTable = ({ data = [] }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { toast } = useToast();

  const handleGenerateReport = async (type) => {
    try {
      let doc;
      if (type === 'monthly') {
        doc = await generateMonthlyReport(data, selectedMonth, selectedYear);
        doc.save(`milk-reception-${format(new Date(selectedYear, selectedMonth), 'MMM-yyyy')}.pdf`);
      } else {
        doc = await generateAnnualReport(data, selectedYear);
        doc.save(`milk-reception-${selectedYear}.pdf`);
      }
      
      toast({
        title: "Success",
        description: `${type === 'monthly' ? 'Monthly' : 'Annual'} report generated successfully`,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (format) => {
    try {
      const filename = `milk-reception-${format(new Date(), 'yyyy-MM-dd')}`;
      
      switch (format) {
        case 'csv':
          downloadAsCSV(data, `${filename}.csv`);
          break;
        case 'jpg':
          await downloadAsJPG('milk-reception-table', `${filename}.jpg`);
          break;
        default:
          break;
      }

      toast({
        title: "Success",
        description: `Data downloaded as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error downloading data:', error);
      toast({
        title: "Error",
        description: "Failed to download data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Milk Reception Records</h3>
        <div className="flex items-center space-x-4">
          <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {format(new Date(2024, i), 'MMMM')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <div className="space-x-2">
            <Button variant="outline" onClick={() => handleGenerateReport('monthly')}>
              Monthly Report
            </Button>
            <Button variant="outline" onClick={() => handleGenerateReport('annual')}>
              Annual Report
            </Button>
          </div>

          <div className="space-x-2">
            <Button variant="outline" onClick={() => handleDownload('csv')}>
              <FileDown className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => handleDownload('jpg')}>
              <Image className="h-4 w-4 mr-2" />
              JPG
            </Button>
          </div>
        </div>
      </div>

      <div id="milk-reception-table" className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Volume (L)</TableHead>
              <TableHead>Temperature (°C)</TableHead>
              <TableHead>Quality</TableHead>
              <TableHead>Fat %</TableHead>
              <TableHead>Protein %</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{format(new Date(record.datetime), 'PPp')}</TableCell>
                <TableCell>{record.supplier_name}</TableCell>
                <TableCell>{record.milk_volume}</TableCell>
                <TableCell>{record.temperature}°C</TableCell>
                <TableCell>{record.quality}</TableCell>
                <TableCell>{record.fat_percentage}%</TableCell>
                <TableCell>{record.protein_percentage}%</TableCell>
                <TableCell>{record.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MilkReceptionTable;