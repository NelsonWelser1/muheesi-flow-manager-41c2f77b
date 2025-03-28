
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
import { Droplet, RefreshCw, Download, BarChart2, PlusCircle, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { format } from 'date-fns';

const MilkProduction = ({ isDataEntry = false }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('records');
  const [milkData, setMilkData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch milk data
  const fetchMilkData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('milk_production')
        .select('*')
        .eq('farm_id', 'bukomero')
        .order('date', { ascending: false });

      if (error) throw error;

      setMilkData(data || []);
      
      // Calculate milk stats
      if (data && data.length > 0) {
        const today = format(new Date(), 'yyyy-MM-dd');
        const todayData = data.filter(record => record.date === today);
        const todayTotal = todayData.reduce((sum, record) => sum + (record.volume || 0), 0);
        
        // Calculate weekly average (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = format(sevenDaysAgo, 'yyyy-MM-dd');
        
        const weekData = data.filter(record => record.date >= sevenDaysAgoStr);
        const weeklyTotal = weekData.reduce((sum, record) => sum + (record.volume || 0), 0);
        const weeklyAverage = weekData.length > 0 ? weeklyTotal / 7 : 0;
        
        // Calculate monthly total
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = format(thirtyDaysAgo, 'yyyy-MM-dd');
        
        const monthData = data.filter(record => record.date >= thirtyDaysAgoStr);
        const monthlyTotal = monthData.reduce((sum, record) => sum + (record.volume || 0), 0);
        
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

  useEffect(() => {
    fetchMilkData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setNewRecord(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newRecord.date || !newRecord.volume || !newRecord.milkingCows) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('milk_production')
        .insert([{
          date: newRecord.date,
          session: newRecord.session,
          volume: parseFloat(newRecord.volume),
          milking_cows: parseInt(newRecord.milkingCows),
          fat_content: newRecord.fatContent ? parseFloat(newRecord.fatContent) : null,
          notes: newRecord.notes,
          farm_id: 'bukomero',
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      
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
      
      // Refresh data
      fetchMilkData();
      
      // Switch to records tab
      setActiveTab('records');
    } catch (error) {
      console.error('Error adding milk record:', error);
      toast({
        title: "Error",
        description: "Failed to add milk record: " + error.message,
        variant: "destructive"
      });
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
    toast({
      title: "Export Started",
      description: "Preparing milk production data export..."
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
          <Button variant="outline" size="sm" onClick={handleExport}>
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
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="session">Milking Session *</Label>
                    <Select
                      value={newRecord.session}
                      onValueChange={(value) => handleSelectChange('session', value)}
                    >
                      <SelectTrigger id="session">
                        <SelectValue placeholder="Select session" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="midday">Midday</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
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
                      required
                    />
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
                      required
                    />
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
                    />
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
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Add Milk Record
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
                    <div className="text-3xl font-bold text-blue-600">{milkStats.todayTotal.toFixed(1)} L</div>
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
                    <div className="text-3xl font-bold text-purple-600">{milkStats.monthlyTotal.toFixed(1)} L</div>
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
                            {(milkStats.weeklyAverage / Math.max(1, milkData[0]?.milking_cows || 0)).toFixed(1)} L/day
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Morning vs Evening Production:</span>
                          <span className="font-medium">55% vs 45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '55%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Fat Content Trend:</span>
                          <span className="font-medium text-green-600">Good</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
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
};

export default MilkProduction;
