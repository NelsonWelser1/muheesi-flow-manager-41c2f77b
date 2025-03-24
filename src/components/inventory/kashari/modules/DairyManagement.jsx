
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Plus, Search, Filter, LineChart, Milk, Activity } from "lucide-react";
import { format, subDays } from 'date-fns';
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const DairyManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Mock data for milk production
  const [milkProduction, setMilkProduction] = useState([
    {
      id: 'MP001',
      date: subDays(new Date(), 1),
      shift: 'morning',
      quantity: 320,
      milkingCows: 40,
      quality: 'A',
      fat: 3.8,
      protein: 3.2,
      collectedBy: 'John',
      notes: 'Normal production'
    },
    {
      id: 'MP002',
      date: subDays(new Date(), 1),
      shift: 'evening',
      quantity: 280,
      milkingCows: 38,
      quality: 'A',
      fat: 3.9,
      protein: 3.3,
      collectedBy: 'David',
      notes: 'Slightly less production due to hot weather'
    },
    {
      id: 'MP003',
      date: subDays(new Date(), 2),
      shift: 'morning',
      quantity: 345,
      milkingCows: 42,
      quality: 'A',
      fat: 3.7,
      protein: 3.1,
      collectedBy: 'John',
      notes: 'Good production'
    },
    {
      id: 'MP004',
      date: subDays(new Date(), 2),
      shift: 'evening',
      quantity: 295,
      milkingCows: 40,
      quality: 'A',
      fat: 3.8,
      protein: 3.2,
      collectedBy: 'Sarah',
      notes: 'Normal production'
    },
    {
      id: 'MP005',
      date: subDays(new Date(), 3),
      shift: 'morning',
      quantity: 330,
      milkingCows: 41,
      quality: 'A',
      fat: 3.6,
      protein: 3.0,
      collectedBy: 'John',
      notes: 'Normal production'
    }
  ]);
  
  // Mock data for cattle health
  const [cattleHealth, setCattleHealth] = useState([
    {
      id: 'CH001',
      date: subDays(new Date(), 2),
      cowId: 'KF-C032',
      issue: 'Routine Check',
      treatment: 'Deworming',
      medications: 'Albendazole',
      attendedBy: 'Dr. James',
      outcome: 'Healthy',
      notes: 'Routine deworming'
    },
    {
      id: 'CH002',
      date: subDays(new Date(), 3),
      cowId: 'KF-C018',
      issue: 'Mastitis',
      treatment: 'Antibiotics',
      medications: 'Penicillin',
      attendedBy: 'Dr. James',
      outcome: 'Recovering',
      notes: 'Monitor for next 3 days'
    },
    {
      id: 'CH003',
      date: subDays(new Date(), 5),
      cowId: 'KF-C045',
      issue: 'Lameness',
      treatment: 'Hoof Trimming',
      medications: 'Anti-inflammatory',
      attendedBy: 'Dr. Mary',
      outcome: 'Recovering',
      notes: 'Keep in separate pen for recovery'
    },
    {
      id: 'CH004',
      date: subDays(new Date(), 8),
      cowId: 'KF-C022',
      issue: 'Pregnancy Check',
      treatment: 'Examination',
      medications: 'None',
      attendedBy: 'Dr. James',
      outcome: 'Pregnant',
      notes: 'Confirmed pregnancy, approximately 3 months'
    },
    {
      id: 'CH005',
      date: subDays(new Date(), 10),
      cowId: 'KF-C039',
      issue: 'Vaccination',
      treatment: 'FMD Vaccine',
      medications: 'FMD Vaccine',
      attendedBy: 'Dr. Mary',
      outcome: 'Healthy',
      notes: 'Regular vaccination program'
    }
  ]);
  
  // Form states
  const [milkForm, setMilkForm] = useState({
    date: new Date(),
    shift: 'morning',
    quantity: '',
    milkingCows: '',
    quality: 'A',
    fat: '',
    protein: '',
    collectedBy: '',
    notes: ''
  });
  
  const [healthForm, setHealthForm] = useState({
    date: new Date(),
    cowId: '',
    issue: '',
    treatment: '',
    medications: '',
    attendedBy: '',
    outcome: 'Healthy',
    notes: ''
  });
  
  // Calculate statistics
  const totalMilkToday = milkProduction
    .filter(record => 
      format(record.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    )
    .reduce((sum, record) => sum + record.quantity, 0);
    
  const totalMilkYesterday = milkProduction
    .filter(record => 
      format(record.date, 'yyyy-MM-dd') === format(subDays(new Date(), 1), 'yyyy-MM-dd')
    )
    .reduce((sum, record) => sum + record.quantity, 0);
    
  const averageMilkPerCow = milkProduction.length > 0 
    ? (milkProduction.reduce((sum, record) => sum + record.quantity, 0) / 
       milkProduction.reduce((sum, record) => sum + record.milkingCows, 0)).toFixed(1)
    : 0;
  
  // Chart data
  const milkTrendData = [
    { day: 'Mon', morning: 320, evening: 280 },
    { day: 'Tue', morning: 345, evening: 295 },
    { day: 'Wed', morning: 330, evening: 290 },
    { day: 'Thu', morning: 340, evening: 300 },
    { day: 'Fri', morning: 325, evening: 285 },
    { day: 'Sat', morning: 315, evening: 275 },
    { day: 'Sun', morning: 335, evening: 290 }
  ];
  
  const healthIssuesData = [
    { name: 'Routine Check', value: 45 },
    { name: 'Mastitis', value: 15 },
    { name: 'Lameness', value: 12 },
    { name: 'Pregnancy Check', value: 20 },
    { name: 'Vaccination', value: 30 },
    { name: 'Other', value: 8 }
  ];
  
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Filter records based on search term
  const filteredMilkRecords = milkProduction.filter(record => 
    record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.collectedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredHealthRecords = cattleHealth.filter(record => 
    record.cowId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.attendedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle form input change
  const handleMilkInputChange = (e) => {
    const { name, value } = e.target;
    setMilkForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleHealthInputChange = (e) => {
    const { name, value } = e.target;
    setHealthForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select change
  const handleMilkSelectChange = (name, value) => {
    setMilkForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleHealthSelectChange = (name, value) => {
    setHealthForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle date change
  const handleMilkDateChange = (date) => {
    setMilkForm(prev => ({
      ...prev,
      date: date
    }));
  };
  
  const handleHealthDateChange = (date) => {
    setHealthForm(prev => ({
      ...prev,
      date: date
    }));
  };
  
  // Submit milk production form
  const handleMilkSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!milkForm.quantity || !milkForm.milkingCows || !milkForm.collectedBy) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new milk record
    const newMilkRecord = {
      id: `MP${String(milkProduction.length + 1).padStart(3, '0')}`,
      date: milkForm.date,
      shift: milkForm.shift,
      quantity: Number(milkForm.quantity),
      milkingCows: Number(milkForm.milkingCows),
      quality: milkForm.quality,
      fat: milkForm.fat ? Number(milkForm.fat) : null,
      protein: milkForm.protein ? Number(milkForm.protein) : null,
      collectedBy: milkForm.collectedBy,
      notes: milkForm.notes
    };
    
    // Add to records
    setMilkProduction(prev => [newMilkRecord, ...prev]);
    
    // Reset form
    setMilkForm({
      date: new Date(),
      shift: 'morning',
      quantity: '',
      milkingCows: '',
      quality: 'A',
      fat: '',
      protein: '',
      collectedBy: '',
      notes: ''
    });
    
    // Show success message
    toast({
      title: "Success",
      description: "Milk production record has been added.",
    });
    
    // Switch to production records tab
    setActiveTab('production');
  };
  
  // Submit cattle health form
  const handleHealthSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!healthForm.cowId || !healthForm.issue || !healthForm.attendedBy) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new health record
    const newHealthRecord = {
      id: `CH${String(cattleHealth.length + 1).padStart(3, '0')}`,
      date: healthForm.date,
      cowId: healthForm.cowId,
      issue: healthForm.issue,
      treatment: healthForm.treatment,
      medications: healthForm.medications,
      attendedBy: healthForm.attendedBy,
      outcome: healthForm.outcome,
      notes: healthForm.notes
    };
    
    // Add to records
    setCattleHealth(prev => [newHealthRecord, ...prev]);
    
    // Reset form
    setHealthForm({
      date: new Date(),
      cowId: '',
      issue: '',
      treatment: '',
      medications: '',
      attendedBy: '',
      outcome: 'Healthy',
      notes: ''
    });
    
    // Show success message
    toast({
      title: "Success",
      description: "Cattle health record has been added.",
    });
    
    // Switch to health records tab
    setActiveTab('health');
  };
  
  // Format date
  const formatDate = (date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Get outcome color
  const getOutcomeColor = (outcome) => {
    switch (outcome.toLowerCase()) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'recovering':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'treatment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pregnant':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Get quality color
  const getQualityColor = (quality) => {
    switch (quality) {
      case 'A':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'B':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dairy Management</CardTitle>
        <CardDescription>
          Manage milk production, cattle health, and dairy operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="production">Milk Production</TabsTrigger>
            <TabsTrigger value="health">Cattle Health</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Today's Production</p>
                      <p className="text-2xl font-bold">{totalMilkToday} Liters</p>
                      <p className="text-sm text-muted-foreground">
                        {totalMilkToday > totalMilkYesterday 
                          ? `+${(totalMilkToday - totalMilkYesterday)} from yesterday` 
                          : totalMilkToday < totalMilkYesterday 
                            ? `-${(totalMilkYesterday - totalMilkToday)} from yesterday`
                            : "Same as yesterday"}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Milk className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Average per Cow</p>
                      <p className="text-2xl font-bold">{averageMilkPerCow} Liters</p>
                      <p className="text-sm text-muted-foreground">Daily average</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <Milk className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Health Status</p>
                      <p className="text-2xl font-bold">Good</p>
                      <p className="text-sm text-muted-foreground">Herd health</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Activity className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Milk Production Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart
                        data={milkTrendData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="morning" stroke="#8884d8" name="Morning (L)" />
                        <Line type="monotone" dataKey="evening" stroke="#82ca9d" name="Evening (L)" />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Issues Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={healthIssuesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {healthIssuesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Person</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...milkProduction.map(p => ({
                      id: p.id,
                      date: p.date,
                      activity: 'Milk Collection',
                      details: `${p.quantity} liters, ${p.milkingCows} cows, Quality: ${p.quality}`,
                      person: p.collectedBy
                    })), ...cattleHealth.map(h => ({
                      id: h.id,
                      date: h.date,
                      activity: 'Health Check',
                      details: `${h.cowId}: ${h.issue}, ${h.treatment}`,
                      person: h.attendedBy
                    }))].sort((a, b) => b.date - a.date).slice(0, 5).map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{formatDate(activity.date)}</TableCell>
                        <TableCell className="font-medium">{activity.activity}</TableCell>
                        <TableCell>{activity.details}</TableCell>
                        <TableCell>{activity.person}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="production" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Record Milk Production</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleMilkSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Collection Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !milkForm.date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {milkForm.date ? format(milkForm.date, "PPP") : <span>Select date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={milkForm.date}
                              onSelect={handleMilkDateChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="shift">Milking Shift *</Label>
                        <Select
                          value={milkForm.shift}
                          onValueChange={(value) => handleMilkSelectChange('shift', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select shift" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning</SelectItem>
                            <SelectItem value="evening">Evening</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Milk Quantity (Liters) *</Label>
                        <Input
                          id="quantity"
                          name="quantity"
                          type="number"
                          value={milkForm.quantity}
                          onChange={handleMilkInputChange}
                          placeholder="Enter quantity in liters"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="milkingCows">Number of Cows Milked *</Label>
                        <Input
                          id="milkingCows"
                          name="milkingCows"
                          type="number"
                          value={milkForm.milkingCows}
                          onChange={handleMilkInputChange}
                          placeholder="Enter number of cows"
                          min="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="quality">Milk Quality *</Label>
                        <Select
                          value={milkForm.quality}
                          onValueChange={(value) => handleMilkSelectChange('quality', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Grade A</SelectItem>
                            <SelectItem value="B">Grade B</SelectItem>
                            <SelectItem value="C">Grade C</SelectItem>
                            <SelectItem value="D">Grade D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="collectedBy">Collected By *</Label>
                        <Input
                          id="collectedBy"
                          name="collectedBy"
                          value={milkForm.collectedBy}
                          onChange={handleMilkInputChange}
                          placeholder="Enter collector's name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fat">Fat Percentage</Label>
                        <Input
                          id="fat"
                          name="fat"
                          type="number"
                          value={milkForm.fat}
                          onChange={handleMilkInputChange}
                          placeholder="Enter fat percentage"
                          min="0"
                          max="10"
                          step="0.1"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="protein">Protein Percentage</Label>
                        <Input
                          id="protein"
                          name="protein"
                          type="number"
                          value={milkForm.protein}
                          onChange={handleMilkInputChange}
                          placeholder="Enter protein percentage"
                          min="0"
                          max="10"
                          step="0.1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={milkForm.notes}
                        onChange={handleMilkInputChange}
                        placeholder="Enter any additional notes"
                        rows={3}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Record Milk Production
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Production Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="rounded-md border overflow-y-auto max-h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Shift</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Cows</TableHead>
                          <TableHead>Quality</TableHead>
                          <TableHead>Collector</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMilkRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{formatDate(record.date)}</TableCell>
                            <TableCell className="capitalize">{record.shift}</TableCell>
                            <TableCell>{record.quantity} L</TableCell>
                            <TableCell>{record.milkingCows}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getQualityColor(record.quality)}`}>
                                Grade {record.quality}
                              </span>
                            </TableCell>
                            <TableCell>{record.collectedBy}</TableCell>
                          </TableRow>
                        ))}
                        {filteredMilkRecords.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                              No records found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Record Health Check</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleHealthSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Check Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !healthForm.date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {healthForm.date ? format(healthForm.date, "PPP") : <span>Select date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={healthForm.date}
                              onSelect={handleHealthDateChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cowId">Cow ID *</Label>
                        <Input
                          id="cowId"
                          name="cowId"
                          value={healthForm.cowId}
                          onChange={handleHealthInputChange}
                          placeholder="Enter cow ID"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="issue">Health Issue/Check *</Label>
                        <Input
                          id="issue"
                          name="issue"
                          value={healthForm.issue}
                          onChange={handleHealthInputChange}
                          placeholder="Enter health issue or check type"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="treatment">Treatment</Label>
                        <Input
                          id="treatment"
                          name="treatment"
                          value={healthForm.treatment}
                          onChange={handleHealthInputChange}
                          placeholder="Enter treatment given"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="medications">Medications</Label>
                        <Input
                          id="medications"
                          name="medications"
                          value={healthForm.medications}
                          onChange={handleHealthInputChange}
                          placeholder="Enter medications given"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="attendedBy">Attended By *</Label>
                        <Input
                          id="attendedBy"
                          name="attendedBy"
                          value={healthForm.attendedBy}
                          onChange={handleHealthInputChange}
                          placeholder="Enter vet/attendant name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="outcome">Outcome *</Label>
                        <Select
                          value={healthForm.outcome}
                          onValueChange={(value) => handleHealthSelectChange('outcome', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select outcome" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Healthy">Healthy</SelectItem>
                            <SelectItem value="Recovering">Recovering</SelectItem>
                            <SelectItem value="Treatment">Under Treatment</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                            <SelectItem value="Pregnant">Pregnant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={healthForm.notes}
                        onChange={handleHealthInputChange}
                        placeholder="Enter any additional notes"
                        rows={3}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Record Health Check
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="rounded-md border overflow-y-auto max-h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Cow ID</TableHead>
                          <TableHead>Issue</TableHead>
                          <TableHead>Treatment</TableHead>
                          <TableHead>Attended By</TableHead>
                          <TableHead>Outcome</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHealthRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{formatDate(record.date)}</TableCell>
                            <TableCell>{record.cowId}</TableCell>
                            <TableCell>{record.issue}</TableCell>
                            <TableCell>{record.treatment}</TableCell>
                            <TableCell>{record.attendedBy}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getOutcomeColor(record.outcome)}`}>
                                {record.outcome}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredHealthRecords.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                              No records found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <LineChart className="h-12 w-12 text-blue-500" />
                  <h3 className="text-lg font-medium">Production Analysis</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Analyze milk production trends and patterns
                  </p>
                  <Button className="w-full">View Report</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <Activity className="h-12 w-12 text-green-500" />
                  <h3 className="text-lg font-medium">Health Metrics</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Track cattle health indicators and trends
                  </p>
                  <Button className="w-full">View Report</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <Milk className="h-12 w-12 text-amber-500" />
                  <h3 className="text-lg font-medium">Quality Tracking</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Monitor milk quality parameters over time
                  </p>
                  <Button className="w-full">View Report</Button>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Production Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="production" stroke="#8884d8" name="Total Production (L)" />
                      <Line yAxisId="right" type="monotone" dataKey="avgPerCow" stroke="#82ca9d" name="Avg. Per Cow (L)" />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fat & Protein Content Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="fat" stroke="#8884d8" name="Fat Content (%)" />
                      <Line type="monotone" dataKey="protein" stroke="#82ca9d" name="Protein Content (%)" />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DairyManagement;
