import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { Download, Printer, FileText, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const MilkReception = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("entry");
  const [receptionData, setReceptionData] = useState([]);
  const [timeFilter, setTimeFilter] = useState('24h');
  const [formData, setFormData] = useState({
    dateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    supplierName: '',
    milkVolume: '',
    temperature: '',
    milkType: 'Cow Milk',
    batchId: `MR${format(new Date(), 'yyyyMMddHHmm')}`,
    fatPercentage: '',
    proteinPercentage: '',
    totalPlateCount: '',
    acidity: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    
    try {
      const { data, error } = await supabase
        .from('milk_reception')
        .insert([{
          ...formData,
          quality_score: calculateQualityScore()
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Milk reception data has been recorded",
      });

      // Reset form
      setFormData({
        dateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        supplierName: '',
        milkVolume: '',
        temperature: '',
        milkType: 'Cow Milk',
        batchId: `MR${format(new Date(), 'yyyyMMddHHmm')}`,
        fatPercentage: '',
        proteinPercentage: '',
        totalPlateCount: '',
        acidity: '',
        notes: ''
      });

    } catch (error) {
      console.error('Error submitting data:', error);
      toast({
        title: "Error",
        description: "Failed to record milk reception data",
        variant: "destructive",
      });
    }
  };

  const calculateQualityScore = () => {
    // Implement quality score calculation based on parameters
    const fatScore = parseFloat(formData.fatPercentage) * 20;
    const proteinScore = parseFloat(formData.proteinPercentage) * 20;
    const acidityScore = (1 - Math.abs(parseFloat(formData.acidity) - 6.7) / 6.7) * 60;
    return Math.round((fatScore + proteinScore + acidityScore) / 3);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.autoTable({
      head: [['Batch ID', 'Date', 'Supplier', 'Volume (L)', 'Temperature (°C)', 'Quality Score']],
      body: receptionData.map(item => [
        item.batchId,
        format(new Date(item.dateTime), 'yyyy-MM-dd HH:mm'),
        item.supplierName,
        item.milkVolume,
        item.temperature,
        item.quality_score
      ])
    });

    doc.save('milk-reception-history.pdf');
  };

  const downloadCSV = () => {
    const headers = ['Batch ID', 'Date', 'Supplier', 'Volume (L)', 'Temperature (°C)', 'Quality Score'];
    const csvData = receptionData.map(item => 
      [
        item.batchId,
        format(new Date(item.dateTime), 'yyyy-MM-dd HH:mm'),
        item.supplierName,
        item.milkVolume,
        item.temperature,
        item.quality_score
      ].join(',')
    );
    
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'milk-reception-history.csv';
    link.click();
  };

  const downloadJPG = async () => {
    const element = document.querySelector('.history-table');
    if (element) {
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = 'milk-reception-history.jpg';
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Milk Reception Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-6 bg-gray-100 p-1 rounded-lg border border-gray-200">
            <TabsTrigger value="entry">Data Entry</TabsTrigger>
            <TabsTrigger value="history">View History</TabsTrigger>
          </TabsList>

          <TabsContent value="entry">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateTime">Date and Time of Reception</Label>
                  <Input
                    id="dateTime"
                    name="dateTime"
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplierName">Supplier Name/ID</Label>
                  <Input
                    id="supplierName"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    placeholder="Enter supplier name or ID"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="milkVolume">Milk Volume (Liters)</Label>
                  <Input
                    id="milkVolume"
                    name="milkVolume"
                    type="number"
                    step="0.1"
                    value={formData.milkVolume}
                    onChange={handleInputChange}
                    placeholder="Enter volume"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature at Reception (°C)</Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    placeholder="Enter temperature"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="milkType">Milk Type</Label>
                  <Select name="milkType" value={formData.milkType} onValueChange={(value) => handleInputChange({ target: { name: 'milkType', value }})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select milk type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cow Milk">Cow Milk</SelectItem>
                      <SelectItem value="Goat Milk">Goat Milk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchId">Batch ID</Label>
                  <Input
                    id="batchId"
                    name="batchId"
                    value={formData.batchId}
                    onChange={handleInputChange}
                    required
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quality Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fatPercentage">Fat Percentage (%)</Label>
                    <Input
                      id="fatPercentage"
                      name="fatPercentage"
                      type="number"
                      step="0.01"
                      value={formData.fatPercentage}
                      onChange={handleInputChange}
                      placeholder="Enter fat %"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proteinPercentage">Protein Percentage (%)</Label>
                    <Input
                      id="proteinPercentage"
                      name="proteinPercentage"
                      type="number"
                      step="0.01"
                      value={formData.proteinPercentage}
                      onChange={handleInputChange}
                      placeholder="Enter protein %"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalPlateCount">Total Plate Count (CFU/ml)</Label>
                    <Input
                      id="totalPlateCount"
                      name="totalPlateCount"
                      type="number"
                      value={formData.totalPlateCount}
                      onChange={handleInputChange}
                      placeholder="Enter TPC"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="acidity">Acidity (%)</Label>
                    <Input
                      id="acidity"
                      name="acidity"
                      type="number"
                      step="0.01"
                      value={formData.acidity}
                      onChange={handleInputChange}
                      placeholder="Enter acidity"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter any additional notes"
                />
              </div>

              <Button type="submit">Submit</Button>
            </form>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={downloadPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadJPG}>
                    <Image className="h-4 w-4 mr-2" />
                    JPG
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>

              <div className="history-table overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Batch ID</th>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Supplier</th>
                      <th className="p-2 text-left">Volume (L)</th>
                      <th className="p-2 text-left">Temperature (°C)</th>
                      <th className="p-2 text-left">Quality Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receptionData.length > 0 ? (
                      receptionData.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{item.batchId}</td>
                          <td className="p-2">{format(new Date(item.dateTime), 'yyyy-MM-dd HH:mm')}</td>
                          <td className="p-2">{item.supplierName}</td>
                          <td className="p-2">{item.milkVolume}</td>
                          <td className="p-2">{item.temperature}</td>
                          <td className="p-2">{item.quality_score}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-gray-500">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MilkReception;