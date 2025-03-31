
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Beef, Search, RefreshCw, FileDown, Plus, TrendingUp, Clipboard, BarChart4 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useCattleFattening } from '@/hooks/useCattleFattening';
import AddCattleForm from './AddCattleForm';

const CustomCattleFattening = ({ isDataEntry = false }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const {
    fatteningData,
    isLoading,
    analytics,
    refreshData,
    exportToCSV
  } = useCattleFattening('bukomero');

  // Filter data based on search query
  const filteredData = searchQuery
    ? fatteningData.filter(item => 
        item.tag_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())))
    : fatteningData;

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case 'sold':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Sold</Badge>;
      case 'slaughtered':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Slaughtered</Badge>;
      case 'transferred':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Transferred</Badge>;
      case 'deceased':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Deceased</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
    }
  };

  // Format feeding regime for display
  const formatFeedingRegime = (regime) => {
    if (!regime) return 'N/A';
    return regime
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleRefresh = () => {
    refreshData();
    toast({
      title: "Data Refreshed",
      description: "Cattle fattening data updated"
    });
  };

  const handleExport = () => {
    exportToCSV();
  };

  const handleFormSuccess = () => {
    refreshData();
    setActiveTab('list');
  };

  // Format date with validation
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Beef className="h-5 w-5 text-green-700" />
          <h2 className="text-xl font-semibold text-green-800">Cattle Fattening Program</h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-green-50 p-1">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white data-[state=active]:text-green-800"
          >
            <Clipboard className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="list" 
            className="data-[state=active]:bg-white data-[state=active]:text-green-800"
          >
            <Beef className="h-4 w-4 mr-2" />
            Cattle List
          </TabsTrigger>
          <TabsTrigger 
            value="add" 
            className="data-[state=active]:bg-white data-[state=active]:text-green-800"
            disabled={!isDataEntry}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Cattle
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-white data-[state=active]:text-green-800"
          >
            <BarChart4 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card className="border-green-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">
              <CardTitle className="text-lg text-green-800">Fattening Program Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-amber-100 shadow-sm">
                  <CardHeader className="pb-2 bg-amber-50 border-b border-amber-100">
                    <CardTitle className="text-base text-amber-800">Active Cattle</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-3xl font-bold text-amber-800">{analytics.totalActive}</div>
                    <p className="text-sm text-amber-700 mt-1">In fattening program</p>
                  </CardContent>
                </Card>

                <Card className="border-green-100 shadow-sm">
                  <CardHeader className="pb-2 bg-green-50 border-b border-green-100">
                    <CardTitle className="text-base text-green-800">Average Daily Gain</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-3xl font-bold text-green-800">
                      {analytics.averageDailyGain.toFixed(2)} <span className="text-base">kg/day</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">Growth performance</p>
                  </CardContent>
                </Card>

                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-2 bg-blue-50 border-b border-blue-100">
                    <CardTitle className="text-base text-blue-800">Average Days in Program</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-3xl font-bold text-blue-800">
                      {Math.round(analytics.averageDaysInProgram)} <span className="text-base">days</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">Time to target weight</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <h3 className="font-medium text-green-800 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-700" />
                  Recent Performance
                </h3>
                
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-green-50">
                          <TableHead>Tag/Name</TableHead>
                          <TableHead>Breed</TableHead>
                          <TableHead>Daily Gain</TableHead>
                          <TableHead>Days in Program</TableHead>
                          <TableHead>Progress</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fatteningData
                          .filter(cattle => cattle.status === 'active')
                          .slice(0, 5)
                          .map((cattle) => {
                            // Calculate days in program
                            const entryDate = cattle.entry_date ? new Date(cattle.entry_date) : new Date();
                            const today = new Date();
                            const daysInProgram = Math.round((today - entryDate) / (1000 * 60 * 60 * 24));
                            
                            // Calculate progress toward target
                            const startWeight = cattle.entry_weight || 0;
                            const currentWeight = cattle.current_weight || 0;
                            const targetWeight = cattle.target_weight || 0;
                            const totalGain = targetWeight - startWeight;
                            const achievedGain = currentWeight - startWeight;
                            const progressPercent = totalGain > 0 
                              ? Math.min(100, Math.round((achievedGain / totalGain) * 100))
                              : 0;

                            return (
                              <TableRow key={cattle.id}>
                                <TableCell>
                                  <div className="font-medium">{cattle.tag_number}</div>
                                  <div className="text-sm text-gray-500">{cattle.name}</div>
                                </TableCell>
                                <TableCell>{cattle.breed}</TableCell>
                                <TableCell>
                                  <span className="font-medium text-green-700">
                                    {cattle.daily_gain ? `${cattle.daily_gain.toFixed(2)} kg/day` : 'N/A'}
                                  </span>
                                </TableCell>
                                <TableCell>{daysInProgram} days</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                      <div 
                                        className="bg-green-500 h-2 rounded-full" 
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                    <span className="text-xs">{progressPercent}%</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                    {fatteningData.filter(cattle => cattle.status === 'active').length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No active cattle in the fattening program.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cattle List Tab */}
        <TabsContent value="list">
          <Card className="border-green-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-lg text-green-800">Fattening Cattle List</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by tag or name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 border-green-200"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50">
                        <TableHead>Tag/Name</TableHead>
                        <TableHead>Breed</TableHead>
                        <TableHead>Entry Date</TableHead>
                        <TableHead>Weight Progress</TableHead>
                        <TableHead>Feeding</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((cattle) => (
                        <TableRow key={cattle.id}>
                          <TableCell>
                            <div className="font-medium">{cattle.tag_number}</div>
                            <div className="text-sm text-gray-500">{cattle.name}</div>
                          </TableCell>
                          <TableCell>{cattle.breed}</TableCell>
                          <TableCell>{formatDate(cattle.entry_date)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                {cattle.entry_weight} kg → {cattle.current_weight} kg
                              </div>
                              <div className="text-xs text-green-700">Target: {cattle.target_weight} kg</div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-green-500 h-1.5 rounded-full" 
                                  style={{ 
                                    width: `${Math.min(100, Math.round(((cattle.current_weight - cattle.entry_weight) / 
                                      (cattle.target_weight - cattle.entry_weight)) * 100))}%` 
                                  }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatFeedingRegime(cattle.feeding_regime)}</TableCell>
                          <TableCell>{getStatusBadge(cattle.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {filteredData.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {searchQuery ? 'No cattle matching your search.' : 'No cattle in the fattening program.'}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Cattle Tab */}
        <TabsContent value="add">
          <AddCattleForm onSuccess={handleFormSuccess} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card className="border-green-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">
              <CardTitle className="text-lg text-green-800">Fattening Program Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-green-100 shadow-sm">
                  <CardHeader className="pb-2 bg-green-50 border-b border-green-100">
                    <CardTitle className="text-base text-green-800">Breed Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analytics.breedDistribution.length > 0 ? (
                      <div className="space-y-4 pt-2">
                        {analytics.breedDistribution.map(item => (
                          <div key={item.breed}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium capitalize">{item.breed}</span>
                              <span className="text-sm">{item.count} cattle ({item.percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`bg-green-500 h-2 rounded-full`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No breed distribution data available.
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-green-100 shadow-sm">
                  <CardHeader className="pb-2 bg-green-50 border-b border-green-100">
                    <CardTitle className="text-base text-green-800">Weight Gain by Breed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analytics.weightGainByBreed.length > 0 ? (
                      <div className="space-y-4 pt-2">
                        {analytics.weightGainByBreed.map(item => (
                          <div key={item.breed}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium capitalize">{item.breed}</span>
                              <span className="text-sm">{item.averageGain.toFixed(2)} kg</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${Math.min(100, (item.averageGain / 200) * 100)}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Based on {item.count} cattle</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No weight gain data available.
                      </div>
                    )}
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

export default CustomCattleFattening;
