import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Download, PieChart, TrendingUp, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import MetricDetailsPopover from '../../inventory/dairy/reports/components/MetricDetailsPopover';

const ReportsAnalytics = ({ selectedEntity }) => {
  const getAnalyticsDetails = (metricType) => {
    switch (metricType) {
      case 'revenue':
        return {
          title: "Revenue Growth Analysis",
          description: "Year-to-date revenue performance across all business units.",
          details: [
            { label: "Dairy Products", value: "+15.2%" },
            { label: "Coffee Exports", value: "+18.7%" },
            { label: "Farm Operations", value: "+8.9%" },
            { label: "Processing Services", value: "+22.1%" }
          ],
          trend: { type: 'positive', value: '+12.5%' },
          additionalInfo: "Revenue growth is driven by increased production capacity and market expansion."
        };
      
      case 'entityRevenue':
        return {
          title: "Revenue Distribution by Entity",
          description: "Breakdown of revenue contribution from each business entity.",
          details: [
            { label: "Grand Berna Dairies", value: "45.2%" },
            { label: "KAJON Coffee", value: "32.8%" },
            { label: "Kyalima Farmers", value: "12.5%" },
            { label: "Other Operations", value: "9.5%" }
          ],
          additionalInfo: "Distribution reflects diversified business portfolio and growth potential."
        };
      
      case 'topProducts':
        return {
          title: "Top Performing Products",
          description: "Best performing products by revenue and market demand.",
          details: [
            { label: "Premium Cheese", value: "28.5M UGX" },
            { label: "Arabica Coffee", value: "22.1M UGX" },
            { label: "Organic Milk", value: "19.7M UGX" },
            { label: "Yogurt Products", value: "15.3M UGX" }
          ],
          trend: { type: 'positive', value: '+18%' },
          additionalInfo: "Product performance based on last quarter sales and customer feedback."
        };
      
      default:
        return {
          title: "Analytics Overview",
          description: "Comprehensive business analytics and insights.",
          details: [],
          additionalInfo: "Data updated in real-time from all business operations."
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Reports & Analytics</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button size="sm" className="gap-1">
            <FileText className="h-4 w-4" />
            <span>Generate Report</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricDetailsPopover
              trigger={
                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      Revenue Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12.5% YTD</div>
                    <p className="text-xs text-muted-foreground">Compared to +8.3% last year</p>
                    <div className="h-[100px] mt-4 flex items-center justify-center bg-gray-100 rounded-md">
                      <BarChart className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              }
              {...getAnalyticsDetails('revenue')}
              value="+12.5% YTD"
            />
            
            <MetricDetailsPopover
              trigger={
                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-muted-foreground" />
                      Revenue by Entity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[150px] flex items-center justify-center bg-gray-100 rounded-md">
                      <PieChart className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              }
              {...getAnalyticsDetails('entityRevenue')}
              value="4 Business Units"
            />
            
            <MetricDetailsPopover
              trigger={
                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                      Top Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[150px] flex items-center justify-center bg-gray-100 rounded-md">
                      <BarChart className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              }
              {...getAnalyticsDetails('topProducts')}
              value="85.6M UGX"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => {
                  const reportTypes = ['Monthly Financial', 'Production Summary', 'Sales Analysis', 'Inventory Status'];
                  const reportType = reportTypes[i - 1];
                  
                  return (
                    <div key={i} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <div className="font-medium">{reportType} Report</div>
                          <div className="text-xs text-muted-foreground">Generated on Apr {i + 10}, 2025</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Financial Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Revenue vs Expenses Chart</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Profit Margins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="production" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Production Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Production Trend Chart</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Production Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Sales Performance Chart</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales by Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales by Region</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAnalytics;
