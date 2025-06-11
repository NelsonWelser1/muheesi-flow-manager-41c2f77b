import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RefreshCw, FileDown, Filter, Beef, ArrowUpRight, Printer, Calendar, Scale, BarChart2, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { differenceInDays, format, addDays } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const CattleFattening = () => {
  const {
    toast
  } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [fatteningCattleData, setFatteningCattleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalActive: 0,
    averageDailyGain: 0.62,
    averageProgress: 68,
    feedConsumption: 1250
  });
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [selectedCattle, setSelectedCattle] = useState(null);
  const [newWeight, setNewWeight] = useState('');

  const calculateDailyGain = (entryWeight, currentWeight, entryDate) => {
    const entry = parseFloat(entryWeight);
    const current = parseFloat(currentWeight);
    const today = new Date();
    const startDate = new Date(entryDate);
    const daysInProgram = differenceInDays(today, startDate);
    
    if (daysInProgram < 7) {
      return 0.7; // Default for new cattle
    }
    
    let gain = (current - entry) / daysInProgram;
    if (gain < 0.2) gain = 0.2; // Minimum realistic gain
    if (gain > 2) gain = 2; // Maximum realistic gain
    
    return gain.toFixed(1);
  };

  const estimateCompletionDate = (currentWeight, targetWeight, dailyGain) => {
    const current = parseFloat(currentWeight);
    const target = parseFloat(targetWeight);
    const gain = parseFloat(dailyGain);
    
    if (isNaN(current) || isNaN(target) || isNaN(gain) || gain <= 0) {
      return "Not available";
    }
    
    const remainingWeight = target - current;
    if (remainingWeight <= 0) {
      return "Ready now";
    }
    
    let daysToTarget = Math.ceil(remainingWeight / gain);
    
    // Add buffer for cattle close to target weight (slower gains expected)
    if (current / target > 0.8) {
      daysToTarget = Math.ceil(daysToTarget * 1.15);
    }
    
    const completionDate = addDays(new Date(), daysToTarget);
    return format(completionDate, 'yyyy-MM-dd');
  };

  const fetchFatteningData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cattle_fattening')
        .select('*')
        .eq('farm_id', 'bukomero')
        .order('entry_date', { ascending: false });

      if (error) throw error;

      const transformedData = data.map(item => {
        const dailyGain = item.daily_gain || calculateDailyGain(item.entry_weight, item.current_weight, item.entry_date);
        const formattedDailyGain = `${parseFloat(dailyGain).toFixed(1)} kg`;
        const estimatedCompletion = item.expected_completion_date || estimateCompletionDate(item.current_weight, item.target_weight, dailyGain);
        
        return {
          id: item.id,
          tagNumber: item.tag_number,
          name: item.name || `Cattle ${item.tag_number}`,
          entryDate: item.entry_date,
          entryWeight: `${item.entry_weight} kg`,
          currentWeight: `${item.current_weight} kg`,
          targetWeight: `${item.target_weight} kg`,
          estimatedCompletion,
          status: calculateStatus(dailyGain, item.current_weight, item.target_weight),
          dailyGain: formattedDailyGain,
          feedType: formatFeedingRegime(item.feeding_regime),
          notes: item.notes
        };
      });

      setFatteningCattleData(transformedData);
      calculateAnalytics(data);
      
      toast({
        title: "Data Loaded",
        description: `Successfully loaded ${data.length} cattle fattening records.`
      });
    } catch (error) {
      console.error('Error fetching fattening data:', error);
      toast({
        title: "Error",
        description: "Failed to load fattening data. " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatFeedingRegime = (regime) => {
    if (!regime) return 'Standard';
    
    const regimeMap = {
      'standard': 'Standard',
      'intensive': 'High Energy',
      'premium': 'High Energy + Supplement',
      'specialized': 'Custom Mix',
      'semi_intensive': 'Medium Energy',
      'pasture_based': 'Pasture Only',
      'silage_based': 'Silage Based',
      'pasture_silage': 'Pasture + Silage'
    };
    
    return regimeMap[regime] || regime.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const calculateStatus = (dailyGain, currentWeight, targetWeight) => {
    if (!dailyGain) return 'on-track';
    
    const gain = parseFloat(dailyGain);
    if (gain < 0.5) return 'behind';
    if (gain > 0.8) return 'ahead';
    return 'on-track';
  };

  const calculateAnalytics = (data) => {
    if (!data || data.length === 0) return;
    
    const activeData = data.filter(item => item.status === 'active');
    const totalActive = activeData.length;
    
    let totalDailyGain = 0;
    let validGainCount = 0;
    
    activeData.forEach(item => {
      let gain = item.daily_gain;
      if (!gain || isNaN(gain)) {
        gain = calculateDailyGain(item.entry_weight, item.current_weight, item.entry_date);
      }
      totalDailyGain += parseFloat(gain);
      validGainCount++;
    });
    
    const averageDailyGain = validGainCount > 0 ? totalDailyGain / validGainCount : 0;
    
    let totalProgress = 0;
    activeData.forEach(item => {
      if (item.current_weight && item.target_weight) {
        const progress = (item.current_weight / item.target_weight) * 100;
        totalProgress += progress;
      }
    });
    
    const averageProgress = activeData.length > 0 ? totalProgress / activeData.length : 0;
    
    let feedConsumption = 0;
    activeData.forEach(item => {
      const feedPerDay = item.current_weight * 0.025 * (1 + parseFloat(item.daily_gain || calculateDailyGain(item.entry_weight, item.current_weight, item.entry_date)) * 0.2);
      feedConsumption += feedPerDay * 7;
    });
    
    setAnalytics({
      totalActive,
      averageDailyGain,
      averageProgress,
      feedConsumption: Math.round(feedConsumption)
    });
  };

  useEffect(() => {
    fetchFatteningData();
  }, []);

  const filteredCattle = fatteningCattleData.filter(cattle => {
    const matchesSearch = cattle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cattle.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cattle.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || cattle.status === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'on-track':
        return <Badge className="bg-green-100 text-green-800">On Track</Badge>;
      case 'behind':
        return <Badge className="bg-red-100 text-red-800">Behind</Badge>;
      case 'ahead':
        return <Badge className="bg-blue-100 text-blue-800">Ahead</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const calculateGainPercentage = (current, entry) => {
    const currentWeight = parseInt(current.replace(' kg', ''));
    const entryWeight = parseInt(entry.replace(' kg', ''));
    return ((currentWeight - entryWeight) / entryWeight * 100).toFixed(1);
  };

  const calculateProgress = (current, target) => {
    const currentWeight = parseInt(current.replace(' kg', ''));
    const targetWeight = parseInt(target.replace(' kg', ''));
    return ((currentWeight / targetWeight) * 100).toFixed(0);
  };

  const handleWeightUpdateClick = (cattle) => {
    setSelectedCattle(cattle);
    setNewWeight(cattle.currentWeight.replace(' kg', ''));
    setWeightDialogOpen(true);
  };

  const handleWeightUpdate = async () => {
    if (!selectedCattle || !newWeight || isNaN(parseFloat(newWeight))) {
      toast({
        title: "Invalid Weight",
        description: "Please enter a valid weight value",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const cattleId = selectedCattle.id;
      const updatedWeight = parseFloat(newWeight);

      const { error } = await supabase
        .from('cattle_fattening')
        .update({
          current_weight: updatedWeight,
          updated_at: new Date().toISOString()
        })
        .eq('id', cattleId);

      if (error) throw error;

      toast({
        title: "Weight Updated",
        description: `Weight for ${selectedCattle.tagNumber} updated to ${updatedWeight} kg`
      });

      fetchFatteningData();
    } catch (error) {
      console.error('Error updating weight:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update weight: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setWeightDialogOpen(false);
      setSelectedCattle(null);
      setNewWeight('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by tag number, name, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="on-track">On Track</SelectItem>
              <SelectItem value="behind">Behind</SelectItem>
              <SelectItem value="ahead">Ahead</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchFatteningData} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cattle</CardTitle>
            <Beef className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalActive}</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="inline h-3 w-3" /> +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Gain</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageDailyGain.toFixed(2)} kg</div>
            <p className="text-xs text-muted-foreground">Target: 0.8 kg/day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageProgress.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">To target weight</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Feed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.feedConsumption} kg</div>
            <p className="text-xs text-muted-foreground">Total consumption</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beef className="h-5 w-5" />
            Cattle Fattening Records ({filteredCattle.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Entry Date</TableHead>
                  <TableHead>Entry Weight</TableHead>
                  <TableHead>Current Weight</TableHead>
                  <TableHead>Target Weight</TableHead>
                  <TableHead>Daily Gain</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Feed Type</TableHead>
                  <TableHead>Est. Completion</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCattle.map((cattle) => (
                  <TableRow key={cattle.id}>
                    <TableCell className="font-medium">{cattle.tagNumber}</TableCell>
                    <TableCell>{cattle.name}</TableCell>
                    <TableCell>{format(new Date(cattle.entryDate), 'yyyy-MM-dd')}</TableCell>
                    <TableCell>{cattle.entryWeight}</TableCell>
                    <TableCell>{cattle.currentWeight}</TableCell>
                    <TableCell>{cattle.targetWeight}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{cattle.dailyGain}</span>
                        <span className="text-xs text-muted-foreground">
                          +{calculateGainPercentage(cattle.currentWeight, cattle.entryWeight)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(calculateProgress(cattle.currentWeight, cattle.targetWeight), 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{calculateProgress(cattle.currentWeight, cattle.targetWeight)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(cattle.status)}</TableCell>
                    <TableCell>{cattle.feedType}</TableCell>
                    <TableCell>{cattle.estimatedCompletion}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleWeightUpdateClick(cattle)}
                        >
                          <Scale className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Weight Update Dialog */}
      <Dialog open={weightDialogOpen} onOpenChange={setWeightDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Weight for {selectedCattle?.tagNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newWeight">New Weight (kg)</Label>
              <Input
                id="newWeight"
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Enter new weight"
              />
            </div>
            {selectedCattle && (
              <div className="text-sm text-muted-foreground">
                <p>Current Weight: {selectedCattle.currentWeight}</p>
                <p>Target Weight: {selectedCattle.targetWeight}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWeightDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWeightUpdate} disabled={isLoading}>
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Weight
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CattleFattening;
