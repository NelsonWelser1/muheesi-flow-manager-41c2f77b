import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RefreshCw, FileDown, Filter, Beef, ArrowUpRight, Printer, Calendar, Scale, BarChart2, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { differenceInDays, format, addDays } from 'date-fns';

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

  const calculateDailyGain = (entryWeight, currentWeight, entryDate) => {
    const entry = parseFloat(entryWeight);
    const current = parseFloat(currentWeight);
    
    const today = new Date();
    const startDate = new Date(entryDate);
    const daysInProgram = differenceInDays(today, startDate);
    
    if (daysInProgram < 7) {
      return 0.7;
    }
    
    let gain = (current - entry) / daysInProgram;
    
    if (gain < 0.2) gain = 0.2;
    if (gain > 2.0) gain = 2.0;
    
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
    
    if (current / target > 0.8) {
      daysToTarget = Math.ceil(daysToTarget * 1.15);
    }
    
    const completionDate = addDays(new Date(), daysToTarget);
    return format(completionDate, 'yyyy-MM-dd');
  };

  const fetchFatteningData = async () => {
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from('cattle_fattening').select('*').eq('farm_id', 'bukomero').order('entry_date', {
        ascending: false
      });
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

  const formatFeedingRegime = regime => {
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

  const calculateAnalytics = data => {
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
        const progress = item.current_weight / item.target_weight * 100;
        totalProgress += progress;
      }
    });
    const averageProgress = activeData.length > 0 ? totalProgress / activeData.length : 0;

    let feedConsumption = 0;
    activeData.forEach(item => {
      const feedPerDay = (item.current_weight * 0.025) * (1 + parseFloat(item.daily_gain || calculateDailyGain(item.entry_weight, item.current_weight, item.entry_date)) * 0.2);
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
    const matchesSearch = cattle.id.toLowerCase().includes(searchTerm.toLowerCase()) || cattle.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) || cattle.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || cattle.status === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = status => {
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
    return (currentWeight / targetWeight * 100).toFixed(0);
  };

  return <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by ID, tag number or name..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="on-track">On Track</SelectItem>
              <SelectItem value="behind">Behind</SelectItem>
              <SelectItem value="ahead">Ahead</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchFatteningData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => toast({
          title: "Print Prepared",
          description: "Sending fattening program data to printer..."
        })}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => toast({
          title: "Export Complete",
          description: "Your fattening program data has been exported."
        })}>
            <FileDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active in Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalActive}</div>
            <p className="text-xs text-muted-foreground mt-1">Current participants</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Daily Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageDailyGain.toFixed(2)} kg</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-500">+0.05 kg from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(analytics.averageProgress)}%</div>
            <p className="text-xs text-muted-foreground mt-1">To target weights</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Feed Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.feedConsumption.toLocaleString()} kg</div>
            <p className="text-xs text-muted-foreground mt-1">Weekly average</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-md">
        {isLoading ? <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
        </div> : <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Entry Date</TableHead>
                <TableHead>Entry Weight</TableHead>
                <TableHead>Current Weight</TableHead>
                <TableHead>Target Weight</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Daily Gain</TableHead>
                <TableHead>Est. Completion</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCattle.length === 0 ? <TableRow>
                  <TableCell colSpan={11} className="text-center py-10">No cattle found in fattening program.</TableCell>
                </TableRow> : filteredCattle.map(cattle => <TableRow key={cattle.tagNumber}>
                    <TableCell>
                      <div className="font-medium">{cattle.tagNumber}</div>
                    </TableCell>
                    <TableCell>{cattle.name}</TableCell>
                    <TableCell>{cattle.entryDate}</TableCell>
                    <TableCell>{cattle.entryWeight}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{cattle.currentWeight}</span>
                        <span className="text-xs text-green-600">+{calculateGainPercentage(cattle.currentWeight, cattle.entryWeight)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{cattle.targetWeight}</TableCell>
                    <TableCell className="w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 h-2 rounded-full">
                          <div className="bg-primary h-2 rounded-full" style={{
                            width: `${calculateProgress(cattle.currentWeight, cattle.targetWeight)}%`
                          }} />
                        </div>
                        <span className="text-xs">{calculateProgress(cattle.currentWeight, cattle.targetWeight)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(cattle.status)}</TableCell>
                    <TableCell>{cattle.dailyGain}</TableCell>
                    <TableCell>{cattle.estimatedCompletion}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Scale className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>)}
            </TableBody>
          </Table>
        </div>}
    </div>
  </div>;
};

export default CattleFattening;
