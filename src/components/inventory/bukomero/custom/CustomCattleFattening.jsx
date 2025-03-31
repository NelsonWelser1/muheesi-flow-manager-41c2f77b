
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Beef, Activity, Plus, FileBarChart, ListFilter, Calendar } from 'lucide-react';
import { useCattleFattening } from '@/hooks/useCattleFattening';

const CustomCattleFattening = ({ isDataEntry = false }) => {
  const {
    fatteningData,
    isLoading,
    analytics,
    refreshData,
    exportToCSV
  } = useCattleFattening('bukomero');
  
  const [activeTab, setActiveTab] = useState('overview');
  const [displayCount, setDisplayCount] = useState(10);
  
  useEffect(() => {
    // Refresh data when component mounts
    refreshData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-green-800">Cattle Fattening Program</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 border-green-200 text-green-700"
            onClick={exportToCSV}
          >
            <FileBarChart className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-green-50 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-green-800">
            Overview
          </TabsTrigger>
          <TabsTrigger value="cattle-list" className="data-[state=active]:bg-white data-[state=active]:text-green-800">
            Cattle List
          </TabsTrigger>
          <TabsTrigger value="add-cattle" className="data-[state=active]:bg-white data-[state=active]:text-green-800">
            Add to Program
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-green-800">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-amber-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent pb-2">
                <CardTitle className="text-base font-medium text-amber-800 flex items-center gap-2">
                  <Beef className="h-5 w-5 text-amber-600" />
                  Active Fattening
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-800">{analytics.totalActive || 0}</div>
                <p className="text-sm text-amber-600">Cattle in fattening program</p>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-transparent pb-2">
                <CardTitle className="text-base font-medium text-green-800 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Average Daily Gain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-800">
                  {analytics.averageDailyGain ? analytics.averageDailyGain.toFixed(2) : "0.00"} kg
                </div>
                <p className="text-sm text-green-600">Per day across all cattle</p>
              </CardContent>
            </Card>

            <Card className="border-blue-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent pb-2">
                <CardTitle className="text-base font-medium text-blue-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Average Days in Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800">
                  {Math.round(analytics.averageDaysInProgram) || 0}
                </div>
                <p className="text-sm text-blue-600">Days per active animal</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-green-800">Recent Cattle in Program</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag #</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Entry Weight</TableHead>
                    <TableHead>Current Weight</TableHead>
                    <TableHead>Daily Gain</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">Loading...</TableCell>
                    </TableRow>
                  ) : fatteningData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">No cattle in fattening program yet</TableCell>
                    </TableRow>
                  ) : (
                    fatteningData.slice(0, 5).map((cattle) => (
                      <TableRow key={cattle.id}>
                        <TableCell className="font-medium">{cattle.tag_number}</TableCell>
                        <TableCell>{cattle.breed}</TableCell>
                        <TableCell>{cattle.entry_weight} kg</TableCell>
                        <TableCell>{cattle.current_weight} kg</TableCell>
                        <TableCell>
                          {cattle.daily_gain ? (
                            <span className={cattle.daily_gain > 0.8 ? "text-green-600" : "text-amber-600"}>
                              {cattle.daily_gain.toFixed(2)} kg/day
                            </span>
                          ) : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              cattle.status === 'active' ? "bg-green-100 text-green-800" : 
                              cattle.status === 'sold' ? "bg-blue-100 text-blue-800" :
                              "bg-amber-100 text-amber-800"
                            }
                          >
                            {cattle.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              {fatteningData.length > 5 && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="link"
                    onClick={() => setActiveTab('cattle-list')}
                  >
                    View All Cattle
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-green-800">Breed Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.weightGainByBreed && analytics.weightGainByBreed.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Breed</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Average Weight Gain</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analytics.weightGainByBreed.map((breed, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{breed.breed}</TableCell>
                          <TableCell>{breed.count}</TableCell>
                          <TableCell>
                            <span className={breed.averageGain > 40 ? "text-green-600" : "text-amber-600"}>
                              {breed.averageGain.toFixed(2)} kg
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-4">No breed performance data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cattle-list" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-green-800">All Cattle in Fattening Program</CardTitle>
              <Button 
                onClick={() => setActiveTab('add-cattle')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Cattle</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                    <select 
                      className="px-2 py-1 border rounded"
                      value={displayCount}
                      onChange={(e) => setDisplayCount(Number(e.target.value))}
                    >
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>
                  <Button variant="outline" size="sm" onClick={refreshData}>Refresh</Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag #</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Breed</TableHead>
                      <TableHead>Entry Date</TableHead>
                      <TableHead>Entry Weight</TableHead>
                      <TableHead>Current Weight</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Daily Gain</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-4">Loading...</TableCell>
                      </TableRow>
                    ) : fatteningData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-4">No cattle in fattening program</TableCell>
                      </TableRow>
                    ) : (
                      fatteningData.slice(0, displayCount).map((cattle) => (
                        <TableRow key={cattle.id}>
                          <TableCell className="font-medium">{cattle.tag_number}</TableCell>
                          <TableCell>{cattle.name || "—"}</TableCell>
                          <TableCell>{cattle.breed}</TableCell>
                          <TableCell>{new Date(cattle.entry_date).toLocaleDateString()}</TableCell>
                          <TableCell>{cattle.entry_weight} kg</TableCell>
                          <TableCell>{cattle.current_weight} kg</TableCell>
                          <TableCell>{cattle.target_weight} kg</TableCell>
                          <TableCell>
                            {cattle.daily_gain ? (
                              <span className={cattle.daily_gain > 0.8 ? "text-green-600" : "text-amber-600"}>
                                {cattle.daily_gain.toFixed(2)} kg/day
                              </span>
                            ) : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                cattle.status === 'active' ? "bg-green-100 text-green-800" : 
                                cattle.status === 'sold' ? "bg-blue-100 text-blue-800" :
                                "bg-amber-100 text-amber-800"
                              }
                            >
                              {cattle.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => console.log("View details for:", cattle.id)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-cattle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-green-800">Add Cattle to Fattening Program</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4">Add cattle form would be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-green-800">Fattening Program Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4">Analytics dashboard would be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomCattleFattening;
