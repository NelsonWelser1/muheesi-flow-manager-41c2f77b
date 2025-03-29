
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Droplet, RefreshCw, Download, BarChart2, PlusCircle, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { format, parseISO } from 'date-fns';

const MilkProduction = ({ isDataEntry = false }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('records');
  const [milkData, setMilkData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [milkStats, setMilkStats] = useState({
    todayTotal: 0,
    weeklyAverage: 0,
    monthlyTotal: 0
  });
  
  // New milk record form state
  const [newRecord, setNewRecord] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    session: 'morning',
    volume: '',
    milkingCows: '',
    fatContent: '',
    notes: ''
  });

  // Form validation state
  const [errors, setErrors] = useState({});

  // Fetch milk data
  const fetchMilkData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('milk_production')
        .select('*')
        .eq('farm_id', 'bukomero')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched milk data:', data);
      setMilkData(data || []);
      
      // Calculate milk stats
      if (data && data.length > 0) {
        const today = format(new Date(), 'yyyy-MM-dd');
        const todayData = data.filter(record => record.date === today);
        const todayTotal = todayData.reduce((sum, record) => sum + (parseFloat(record.volume) || 0), 0);
        
        // Calculate weekly average (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = format(sevenDaysAgo, 'yyyy-MM-dd');
        
        const weekData = data.filter(record => record.date >= sevenDaysAgoStr);
        const weeklyTotal = weekData.reduce((sum, record) => sum + (parseFloat(record.volume) || 0), 0);
        const weeklyAverage = weekData.length > 0 ? weeklyTotal / 7 : 0;
        
        // Calculate monthly total
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = format(thirtyDaysAgo, 'yyyy-MM-dd');
        
        const monthData = data.filter(record => record.date >= thirtyDaysAgoStr);
        const monthlyTotal = monthData.reduce((sum, record) => sum + (parseFloat(record.volume) || 0), 0);
        
        setMilkStats({
          todayTotal,
          weeklyAverage,
          monthlyTotal
        });
      }
    } catch (err) {
      console.error('Error fetching milk data:', err);
      toast({
        title: "Error",
        description: "Failed to load milk production data: " + err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription to milk_production table
  useEffect(() => {
    fetchMilkData();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('milk-production-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'milk_production',
        filter: 'farm_id=eq.bukomero'
      }, (payload) => {
        console.log('Change received!', payload);
        fetchMilkData();
      })
      .subscribe();
      
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!newRecord.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!newRecord.volume) {
      newErrors.volume = 'Volume is required';
    } else if (parseFloat(newRecord.volume) <= 0) {
      newErrors.volume = 'Volume must be greater than zero';
    }
    
    if (!newRecord.milkingCows) {
      newErrors.milkingCows = 'Number of milking cows is required';
    } else if (parseInt(newRecord.milkingCows) <= 0) {
      newErrors.milkingCows = 'Number of milking cows must be greater than zero';
    }
    
    if (newRecord.fatContent && (parseFloat(newRecord.fatContent) <= 0 || parseFloat(newRecord.fatContent) > 100)) {
      newErrors.fatContent = 'Fat content must be between 0 and 100%';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setNewRecord(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Check for duplicate entry (same day and session)
      const { data: existingData, error: checkError } = await supabase
        .from('milk_production')
        .select('id')
        .eq('farm_id', 'bukomero')
        .eq('date', newRecord.date)
        .eq('session', newRecord.session);
        
      if (checkError) throw checkError;
      
      if (existingData && existingData.length > 0) {
        toast({
          title: "Duplicate Entry",
          description: `A record for ${format(new Date(newRecord.date), 'PP')} ${newRecord.session} session already exists.`,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Insert the new record
      const { data, error } = await supabase
        .from('milk_production')
        .insert([{
          date: newRecord.date,
          session: newRecord.session,
          volume: parseFloat(newRecord.volume),
          milking_cows: parseInt(newRecord.milkingCows),
          fat_content: newRecord.fatContent ? parseFloat(newRecord.fatContent) : null,
          notes: newRecord.notes,
          farm_id: 'bukomero'
        }])
        .select();

      if (error) throw error;
      
      console.log('Milk record added:', data);
      
      toast({
        title: "Success",
        description: "Milk production record added successfully.",
      });
      
      // Reset form
      setNewRecord({
        date: format(new Date(), 'yyyy-MM-dd'),
        session: 'morning',
        volume: '',
        milkingCows: '',
        fatContent: '',
        notes: ''
      });
      
      // Switch to records tab
      setActiveTab('records');
    } catch (error) {
      console.error('Error adding milk record:', error);
      toast({
        title: "Error",
        description: "Failed to add milk record: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    fetchMilkData();
    toast({
      title: "Data Refreshed",
      description: "Milk production data has been updated."
    });
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ["Date", "Session", "Volume (L)", "Milking Cows", "Fat %", "Notes"];
    let csvContent = headers.join(",") + "\n";
    
    milkData.forEach(record => {
      const formattedDate = record.date ? format(new Date(record.date), 'yyyy-MM-dd') : 'N/A';
      const row = [
        formattedDate,
        record.session,
        record.volume,
        record.milking_cows,
        record.fat_content || '',
        record.notes ? `"${record.notes.replace(/"/g, '""')}"` : ''
      ];
      csvContent += row.join(",") + "\n";
    });
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `milk-production-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Milk production data has been exported to CSV."
    });
  };

  const getSessionLabel = (session) => {
    const sessions = {
      'morning': 'Morning',
      'evening': 'Evening',
      'midday': 'Midday'
    };
    return sessions[session] || session;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Milk Production</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={milkData.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-4">
          <TabsTrigger value="records" className="flex items-center gap-2">
            <Droplet className="h-4 w-4" />
            Production Records
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2" disabled={!isDataEntry}>
            <PlusCircle className="h-4 w-4" />
            Add Record
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Milk Production Records</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : milkData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No milk production records found. Add some records to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Session</TableHead>
                        <TableHead>Volume (L)</TableHead>
                        <TableHead className="hidden md:table-cell">Milking Cows</TableHead>
                        <TableHead className="hidden lg:table-cell">Fat %</TableHead>
                        <TableHead className="hidden xl:table-cell">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {milkData.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            {record.date ? format(new Date(record.date), 'PP') : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getSessionLabel(record.session)}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{record.volume} L</TableCell>
                          <TableCell className="hidden md:table-cell">{record.milking_cows}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {record.fat_content ? `${record.fat_content}%` : 'N/A'}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            {record.notes ? record.notes : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add Milk Production Record</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 absolute ml-3" />
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={newRecord.date}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.date ? 'border-red-500' : ''}`}
                        required
                      />
                    </div>
                    {errors.date && (
                      <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="session">Milking Session *</Label>
                    <Select
                      value={newRecord.session}
                      onValueChange={(value) => handleSelectChange('session', value)}
                    >
                      <SelectTrigger id="session" className={errors.session ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select session" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="midday">Midday</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.session && (
                      <p className="text-red-500 text-xs mt-1">{errors.session}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume (Liters) *</Label>
                    <Input
                      id="volume"
                      name="volume"
                      type="number"
                      step="0.01"
                      value={newRecord.volume}
                      onChange={handleInputChange}
                      placeholder="Enter milk volume"
                      className={errors.volume ? 'border-red-500' : ''}
                      required
                    />
                    {errors.volume && (
                      <p className="text-red-500 text-xs mt-1">{errors.volume}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="milkingCows">Number of Milking Cows *</Label>
                    <Input
                      id="milkingCows"
                      name="milkingCows"
                      type="number"
                      value={newRecord.milkingCows}
                      onChange={handleInputChange}
                      placeholder="Enter count"
                      className={errors.milkingCows ? 'border-red-500' : ''}
                      required
                    />
                    {errors.milkingCows && (
                      <p className="text-red-500 text-xs mt-1">{errors.milkingCows}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fatContent">Fat Content (%)</Label>
                    <Input
                      id="fatContent"
                      name="fatContent"
                      type="number"
                      step="0.1"
                      value={newRecord.fatContent}
                      onChange={handleInputChange}
                      placeholder="Enter fat percentage"
                      className={errors.fatContent ? 'border-red-500' : ''}
                    />
                    {errors.fatContent && (
                      <p className="text-red-500 text-xs mt-1">{errors.fatContent}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={newRecord.notes}
                      onChange={handleInputChange}
                      placeholder="Enter any additional notes"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Add Milk Record"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Milk Production Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Today's Production</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{milkStats.todayTotal.toFixed(1)} L</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(), 'PP')}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Weekly Average</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{milkStats.weeklyAverage.toFixed(1)} L</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Per day over last 7 days
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Monthly Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{milkStats.monthlyTotal.toFixed(1)} L</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Last 30 days
                    </p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-3">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Average Production per Cow:</span>
                          <span className="font-medium">
                            {(milkData.length > 0 && milkData[0]?.milking_cows > 0) ? 
                              (milkStats.weeklyAverage / Math.max(1, parseInt(milkData[0]?.milking_cows || 0))).toFixed(1) : 
                              "0.0"} L/day
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Morning vs Evening Production:</span>
                          <span className="font-medium">
                            {calculateSessionPercentages()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-amber-500 h-2.5 rounded-full" style={{ 
                            width: calculateMorningPercentage() + '%' 
                          }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Fat Content Trend:</span>
                          <span className="font-medium text-green-600">
                            {calculateFatContentStatus()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ 
                            width: calculateFatContentPercentage() + '%' 
                          }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  // Helper function to calculate session percentages
  function calculateSessionPercentages() {
    if (milkData.length === 0) return "N/A";
    
    const morningRecords = milkData.filter(record => record.session === 'morning');
    const eveningRecords = milkData.filter(record => record.session === 'evening');
    
    const morningTotal = morningRecords.reduce((sum, record) => sum + parseFloat(record.volume || 0), 0);
    const eveningTotal = eveningRecords.reduce((sum, record) => sum + parseFloat(record.volume || 0), 0);
    
    const total = morningTotal + eveningTotal;
    
    if (total === 0) return "N/A";
    
    const morningPercent = Math.round((morningTotal / total) * 100);
    const eveningPercent = 100 - morningPercent;
    
    return `${morningPercent}% vs ${eveningPercent}%`;
  }
  
  function calculateMorningPercentage() {
    if (milkData.length === 0) return 50;
    
    const morningRecords = milkData.filter(record => record.session === 'morning');
    const eveningRecords = milkData.filter(record => record.session === 'evening');
    
    const morningTotal = morningRecords.reduce((sum, record) => sum + parseFloat(record.volume || 0), 0);
    const eveningTotal = eveningRecords.reduce((sum, record) => sum + parseFloat(record.volume || 0), 0);
    
    const total = morningTotal + eveningTotal;
    
    if (total === 0) return 50;
    
    return Math.round((morningTotal / total) * 100);
  }
  
  function calculateFatContentStatus() {
    if (milkData.length === 0) return "N/A";
    
    const recordsWithFatContent = milkData.filter(record => record.fat_content);
    
    if (recordsWithFatContent.length === 0) return "No Data";
    
    const avgFatContent = recordsWithFatContent.reduce((sum, record) => sum + parseFloat(record.fat_content || 0), 0) / 
      recordsWithFatContent.length;
    
    if (avgFatContent >= 3.8) return "Excellent";
    if (avgFatContent >= 3.5) return "Good";
    if (avgFatContent >= 3.2) return "Average";
    return "Below Average";
  }
  
  function calculateFatContentPercentage() {
    if (milkData.length === 0) return 0;
    
    const recordsWithFatContent = milkData.filter(record => record.fat_content);
    
    if (recordsWithFatContent.length === 0) return 0;
    
    const avgFatContent = recordsWithFatContent.reduce((sum, record) => sum + parseFloat(record.fat_content || 0), 0) / 
      recordsWithFatContent.length;
    
    // Scale the percentage from 0 to 100 based on fat content between 2.5% and 4.5%
    const scaledPercentage = Math.min(100, Math.max(0, ((avgFatContent - 2.5) / 2) * 100));
    
    return Math.round(scaledPercentage);
  }
};

export default MilkProduction;
