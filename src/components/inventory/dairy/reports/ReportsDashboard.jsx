import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, PieChart, Download, Plus, Filter, LayoutDashboard, Factory, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useDairyReportData } from './hooks/useDairyReportData';
import ReportFormDialog from './ReportFormDialog';
import QualityMetricsCard from './QualityMetricsCard';
import ReportExportCard from './ReportExportCard';

const ReportsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const { toast } = useToast();
  const { 
    productionData, 
    qualityMetrics, 
    salesData, 
    reportCounts, 
    isLoading, 
    error,
    refreshData
  } = useDairyReportData();
  
  const handleReportSubmitted = () => {
    refreshData();
    setIsReportFormOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
        <h3 className="font-bold mb-2">Error loading report data</h3>
        <p>{error.message || "An unknown error occurred"}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={refreshData}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => setIsReportFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="relative z-10">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-20 shadow-md">
          <TabsTrigger 
            value="overview" 
            className="h-32 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200 data-[state=active]:from-blue-200 data-[state=active]:to-blue-300 transition-all relative z-10"
          >
            <div className="flex flex-col items-center">
              <LayoutDashboard className="h-8 w-8 mb-2 text-blue-600" />
              <span className="text-lg font-medium">Overview</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {reportCounts.daily || 0} Reports Today
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="production" 
            className="h-32 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200 data-[state=active]:from-green-200 data-[state=active]:to-green-300 transition-all relative z-10"
          >
            <div className="flex flex-col items-center">
              <Factory className="h-8 w-8 mb-2 text-green-600" />
              <span className="text-lg font-medium">Production</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {productionData.length} Product Types
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="quality" 
            className="h-32 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200 data-[state=active]:from-purple-200 data-[state=active]:to-purple-300 transition-all relative z-10"
          >
            <div className="flex flex-col items-center">
              <Star className="h-8 w-8 mb-2 text-purple-600" />
              <span className="text-lg font-medium">Quality</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Avg Score: {reportCounts.qualityScore || "0%"}
            </div>
          </TabsTrigger>
        </TabsList>
        
        <div className="relative z-0">
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Reports</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportCounts.daily || 0}</div>
                  <p className="text-xs text-muted-foreground">Generated today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Production Growth</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportCounts.growthPercent || "0%"}</div>
                  <p className="text-xs text-muted-foreground">From last period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportCounts.qualityScore || "0%"}</div>
                  <p className="text-xs text-muted-foreground">Average rating</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportCounts.downloads || 0}</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Production Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="product" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="quantity" fill="#8884d8" name="Production Quantity" />
                        <Bar dataKey="efficiency" fill="#82ca9d" name="Efficiency %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <ReportExportCard 
                productionData={productionData}
                salesData={salesData}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="production" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {productionData.map((item, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{item.product}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{item.quantity.toFixed(2)} kg/L</div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-muted-foreground">Efficiency:</span>
                      <span className="text-xs font-medium">{item.efficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.efficiency}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Production Metrics</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="quantity" fill="#8884d8" name="Production Quantity" />
                    <Bar yAxisId="right" dataKey="efficiency" fill="#82ca9d" name="Efficiency %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Latest Production</CardTitle>
                </CardHeader>
                <CardContent>
                  {productionData.length > 0 ? (
                    <ul className="space-y-2">
                      {productionData.slice(0, 5).map((item, index) => (
                        <li key={index} className="border-b pb-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{item.product}</span>
                            <span>{item.quantity.toFixed(2)} kg/L</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Efficiency: {item.efficiency}%
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No data</AlertTitle>
                      <AlertDescription>
                        No production data available. Add production reports to see them here.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Production Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Total Production</span>
                        <span className="text-sm">
                          {productionData.reduce((sum, item) => sum + item.quantity, 0).toFixed(2)} kg/L
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Average Efficiency</span>
                        <span className="text-sm">
                          {Math.round(
                            productionData.reduce((sum, item) => sum + item.efficiency, 0) / 
                            (productionData.length || 1)
                          )}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ 
                            width: `${Math.round(
                              productionData.reduce((sum, item) => sum + item.efficiency, 0) / 
                              (productionData.length || 1)
                            )}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={() => setIsReportFormOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Production Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="quality" className="space-y-6">
            <QualityMetricsCard qualityMetrics={qualityMetrics} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quality Scores by Product</CardTitle>
                </CardHeader>
                <CardContent>
                  {productionData.length > 0 ? (
                    <ul className="space-y-4">
                      {productionData.map((item, index) => (
                        <li key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{item.product}</span>
                            <span className="text-sm">{item.efficiency}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.efficiency >= 90 ? 'bg-green-500' : 
                                item.efficiency >= 70 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}
                              style={{ width: `${item.efficiency}%` }}
                            ></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No data</AlertTitle>
                      <AlertDescription>
                        No quality data available. Add quality reports to see them here.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quality Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Track quality metrics improvement over time. Our quality score is a composite of:
                    </p>
                    
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-sm">Taste Score:</span>
                        <span className="text-sm font-medium">90%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Texture Score:</span>
                        <span className="text-sm font-medium">85%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Appearance:</span>
                        <span className="text-sm font-medium">92%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Consistency:</span>
                        <span className="text-sm font-medium">88%</span>
                      </li>
                      <li className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-sm font-medium">Overall Quality:</span>
                        <span className="text-sm font-medium">89%</span>
                      </li>
                    </ul>
                    
                    <Button variant="outline" className="w-full" onClick={() => setIsReportFormOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Quality Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      <ReportFormDialog 
        open={isReportFormOpen} 
        onOpenChange={setIsReportFormOpen}
        onReportSubmitted={handleReportSubmitted}
      />
    </div>
  );
};

export default ReportsDashboard;
