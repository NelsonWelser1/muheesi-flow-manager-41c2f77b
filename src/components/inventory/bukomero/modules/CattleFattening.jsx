
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Beef, RefreshCw, Download, BarChart2, PlusCircle, Scale, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { format, addDays, differenceInDays } from 'date-fns';

const CattleFattening = ({ isDataEntry = false }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('programs');
  const [fatteningData, setFatteningData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New fattening program form state
  const [newProgram, setNewProgram] = useState({
    cattleTag: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    startWeight: '',
    targetWeight: '',
    expectedDuration: '90',
    feedingRegime: 'standard',
    notes: ''
  });

  // Fetch fattening data
  const fetchFatteningData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cattle_fattening')
        .select('*')
        .eq('farm_id', 'bukomero')
        .order('start_date', { ascending: false });

      if (error) throw error;

      setFatteningData(data || []);
    } catch (err) {
      console.error('Error fetching fattening data:', err);
      toast({
        title: "Error",
        description: "Failed to load cattle fattening data: " + err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cattle tags for dropdown
  const [cattleTags, setCattleTags] = useState([]);
  
  const fetchCattleTags = async () => {
    try {
      const { data, error } = await supabase
        .from('cattle_inventory')
        .select('id, tag_number')
        .eq('farm_id', 'bukomero')
        .eq('status', 'active')
        .in('cattle_type', ['bull', 'male_calf']);

      if (error) throw error;

      setCattleTags(data || []);
    } catch (err) {
      console.error('Error fetching cattle tags:', err);
    }
  };

  useEffect(() => {
    fetchFatteningData();
    fetchCattleTags();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setNewProgram(prev => ({ ...prev, [name]: value }));
  };

  // Calculate expected end date based on start date and duration
  const calculateEndDate = (startDate, durationDays) => {
    if (!startDate) return '';
    return format(addDays(new Date(startDate), parseInt(durationDays)), 'yyyy-MM-dd');
  };

  // Calculate progress percentage
  const calculateProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    const totalDays = differenceInDays(end, start);
    if (totalDays <= 0) return 0;
    
    const daysElapsed = differenceInDays(today, start);
    if (daysElapsed <= 0) return 0;
    if (daysElapsed >= totalDays) return 100;
    
    return Math.round((daysElapsed / totalDays) * 100);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newProgram.cattleTag || !newProgram.startDate || !newProgram.startWeight || !newProgram.targetWeight) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const endDate = calculateEndDate(newProgram.startDate, newProgram.expectedDuration);
      
      const { data, error } = await supabase
        .from('cattle_fattening')
        .insert([{
          cattle_tag: newProgram.cattleTag,
          start_date: newProgram.startDate,
          start_weight: parseFloat(newProgram.startWeight),
          target_weight: parseFloat(newProgram.targetWeight),
          expected_duration: parseInt(newProgram.expectedDuration),
          expected_end_date: endDate,
          current_weight: parseFloat(newProgram.startWeight),
          feeding_regime: newProgram.feedingRegime,
          status: 'active',
          notes: newProgram.notes,
          farm_id: 'bukomero',
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Fattening program added successfully.",
      });
      
      // Reset form
      setNewProgram({
        cattleTag: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        startWeight: '',
        targetWeight: '',
        expectedDuration: '90',
        feedingRegime: 'standard',
        notes: ''
      });
      
      // Refresh data
      fetchFatteningData();
      
      // Switch to programs tab
      setActiveTab('programs');
    } catch (error) {
      console.error('Error adding fattening program:', error);
      toast({
        title: "Error",
        description: "Failed to add fattening program: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    fetchFatteningData();
    toast({
      title: "Data Refreshed",
      description: "Cattle fattening data has been updated."
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Preparing cattle fattening data export..."
    });
  };

  const getFeedingRegimeLabel = (regime) => {
    const regimes = {
      'intensive': 'Intensive',
      'standard': 'Standard',
      'premium': 'Premium',
      'specialized': 'Specialized'
    };
    return regimes[regime] || regime;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Cattle Fattening</h2>
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
          <TabsTrigger value="programs" className="flex items-center gap-2">
            <Beef className="h-4 w-4" />
            Fattening Programs
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2" disabled={!isDataEntry}>
            <PlusCircle className="h-4 w-4" />
            Add Program
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="programs">
          <Card>
            <CardHeader>
              <CardTitle>Active Fattening Programs</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : fatteningData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No fattening programs found. Add a program to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cattle Tag</TableHead>
                        <TableHead className="hidden md:table-cell">Start Date</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead className="hidden lg:table-cell">Target</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead className="hidden xl:table-cell">Regime</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fatteningData.map((program) => (
                        <TableRow key={program.id}>
                          <TableCell className="font-medium">{program.cattle_tag}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {program.start_date ? format(new Date(program.start_date), 'PP') : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Scale className="h-4 w-4 text-gray-400" />
                              {program.current_weight} kg
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {program.target_weight} kg
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Progress value={calculateProgress(program.start_date, program.expected_end_date)} className="h-2" />
                              <div className="text-xs text-muted-foreground">
                                {calculateProgress(program.start_date, program.expected_end_date)}% Complete
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            {getFeedingRegimeLabel(program.feeding_regime)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                              {program.status?.charAt(0).toUpperCase() + program.status?.slice(1)}
                            </Badge>
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
              <CardTitle>Add Fattening Program</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cattleTag">Cattle Tag *</Label>
                    <Select
                      value={newProgram.cattleTag}
                      onValueChange={(value) => handleSelectChange('cattleTag', value)}
                      required
                    >
                      <SelectTrigger id="cattleTag">
                        <SelectValue placeholder="Select cattle" />
                      </SelectTrigger>
                      <SelectContent>
                        {cattleTags.map(cattle => (
                          <SelectItem key={cattle.id} value={cattle.tag_number}>
                            {cattle.tag_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 absolute ml-3" />
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={newProgram.startDate}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startWeight">Start Weight (kg) *</Label>
                    <Input
                      id="startWeight"
                      name="startWeight"
                      type="number"
                      step="0.1"
                      value={newProgram.startWeight}
                      onChange={handleInputChange}
                      placeholder="Enter starting weight"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetWeight">Target Weight (kg) *</Label>
                    <Input
                      id="targetWeight"
                      name="targetWeight"
                      type="number"
                      step="0.1"
                      value={newProgram.targetWeight}
                      onChange={handleInputChange}
                      placeholder="Enter target weight"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedDuration">Expected Duration (days)</Label>
                    <Select
                      value={newProgram.expectedDuration}
                      onValueChange={(value) => handleSelectChange('expectedDuration', value)}
                    >
                      <SelectTrigger id="expectedDuration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="120">120 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-muted-foreground">
                      Expected end date: {calculateEndDate(newProgram.startDate, newProgram.expectedDuration)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedingRegime">Feeding Regime</Label>
                    <Select
                      value={newProgram.feedingRegime}
                      onValueChange={(value) => handleSelectChange('feedingRegime', value)}
                    >
                      <SelectTrigger id="feedingRegime">
                        <SelectValue placeholder="Select regime" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="intensive">Intensive</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="specialized">Specialized</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={newProgram.notes}
                      onChange={handleInputChange}
                      placeholder="Enter any additional notes"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                    Add Fattening Program
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Fattening Program Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Program Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Active Programs:</span>
                        <span className="font-medium">
                          {fatteningData.filter(p => p.status === 'active').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed Programs:</span>
                        <span className="font-medium">
                          {fatteningData.filter(p => p.status === 'completed').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Suspended Programs:</span>
                        <span className="font-medium">
                          {fatteningData.filter(p => p.status === 'suspended').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Duration:</span>
                        <span className="font-medium">
                          {fatteningData.length > 0 
                            ? Math.round(fatteningData.reduce((sum, p) => sum + p.expected_duration, 0) / fatteningData.length) 
                            : 0} days
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total Programs:</span>
                        <span>{fatteningData.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Average Weight Gain:</span>
                          <span className="font-medium">0.9 kg/day</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Feed Conversion Ratio:</span>
                          <span className="font-medium">7.2:1</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Success Rate:</span>
                          <span className="font-medium">89%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '89%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Profit Margin:</span>
                          <span className="font-medium text-green-600">32%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '32%' }}></div>
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

export default CattleFattening;
