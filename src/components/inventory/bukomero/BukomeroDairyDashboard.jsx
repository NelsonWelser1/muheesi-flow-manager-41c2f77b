
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RefreshCw, FileDown, Printer, Plus, ArrowLeft, Beef, Droplet, DollarSign, Tractor, Users, BookOpen, BarChart3, Calendar, AlertTriangle, ClipboardCheck } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import CattleManagement from './modules/CattleManagement';
import MilkProduction from './modules/MilkProduction';
import CustomCattleFattening from './custom/CustomCattleFattening';
import SilageManager from '../shared/modules/SilageManager';
import StaffMembers from '../shared/modules/StaffMembers';
import { useBukomeroDairyData } from '@/hooks/useBukomeroDairyData';

const BukomeroDairyDashboard = () => {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const {
    farmMetrics,
    isLoading,
    error,
    refreshMetrics
  } = useBukomeroDairyData();

  const handleExportAll = () => {
    toast({
      title: "Export Started",
      description: "Preparing your Bukomero Dairy Farm dashboard export..."
    });
  };

  const handlePrint = () => {
    toast({
      title: "Print Prepared",
      description: "Sending Bukomero Dairy dashboard to printer..."
    });
  };

  return <div className="space-y-6 px-[210px]">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/manage-inventory')} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Inventory</span>
        </Button>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <ClipboardCheck className="h-3.5 w-3.5" />
            <span>Data Entry Terminal</span>
          </Badge>
          <span className="text-sm text-muted-foreground">
            Last sync: {format(new Date(), "MMM dd, HH:mm")}
          </span>
        </div>
      </div>

      <Card className="border-green-100 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100 flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold text-green-800">Bukomero Dairy Farm</CardTitle>
            <CardDescription className="text-green-700">Data Entry Terminal - Managed by Kyalima Farmers Limited</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8 gap-1 border-green-200 text-green-700 hover:bg-green-50" onClick={() => refreshMetrics()}>
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1 border-green-200 text-green-700 hover:bg-green-50" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1 border-green-200 text-green-700 hover:bg-green-50" onClick={handleExportAll}>
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-6 gap-1 bg-green-50 p-1">
              <TabsTrigger value="overview" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-green-800 text-xs">
                <BookOpen className="h-3 w-3" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="cattle" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-green-800 text-xs">
                <Beef className="h-3 w-3" />
                <span>Cattle</span>
              </TabsTrigger>
              <TabsTrigger value="milk" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-green-800 text-xs">
                <Droplet className="h-3 w-3" />
                <span>Milk</span>
              </TabsTrigger>
              <TabsTrigger value="fattening" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-green-800 text-xs">
                <Beef className="h-3 w-3" />
                <span>Fattening</span>
              </TabsTrigger>
              <TabsTrigger value="silage" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-green-800 text-xs">
                <Tractor className="h-3 w-3" />
                <span>Silage</span>
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-green-800 text-xs">
                <Users className="h-3 w-3" />
                <span>Staff</span>
              </TabsTrigger>
            </TabsList>

            <div id="bukomero-content" className="bg-white rounded-lg shadow-sm">
              <TabsContent value="overview" className="space-y-6 focus:outline-none">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-green-800 flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <strong>Data Entry Terminal:</strong> All information entered here will be shared with Kyalima Farmers Limited Executive Management for strategic decision-making.
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-green-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-transparent pb-2">
                      <CardTitle className="text-sm font-medium text-green-800">Total Cattle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-800">{farmMetrics?.totalCattle || 135}</div>
                      <p className="text-xs text-green-600 mt-1">Across all categories</p>
                      <div className="flex items-center mt-2">
                        <Beef className="h-4 w-4 text-green-600 mr-1" />
                        <div className="text-xs text-green-600">
                          Last updated: {format(new Date(), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-blue-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent pb-2">
                      <CardTitle className="text-sm font-medium text-blue-800">Daily Milk Production</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-800">{farmMetrics?.milkProduction || "480 liters/day"}</div>
                      <p className="text-xs text-blue-600 mt-1">Average from 24 mother cows</p>
                      <div className="flex items-center mt-2">
                        <Droplet className="h-4 w-4 text-blue-500 mr-1" />
                        <div className="text-xs text-blue-600">2 milking sessions daily</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-amber-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent pb-2">
                      <CardTitle className="text-sm font-medium text-amber-800">Cattle in Fattening Program</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-amber-800">{farmMetrics?.activeFattening || 42}</div>
                      <p className="text-xs text-amber-600 mt-1">Bulls and steers in program</p>
                      <div className="flex items-center mt-2">
                        <div className="w-full bg-amber-100 h-2 rounded-full">
                          <div className="bg-amber-500 h-2 rounded-full w-3/4"></div>
                        </div>
                        <span className="text-xs ml-2 text-amber-600">75% to target</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-green-100 shadow-sm">
                    <CardHeader className="border-b border-green-50">
                      <CardTitle className="text-base text-green-800">
                        <div className="flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                          Financial Overview
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <dl className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-green-600">Revenue (Monthly)</dt>
                          <dd className="text-lg font-semibold text-green-800">UGX 3,140,000</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-amber-600">Expenses (Monthly)</dt>
                          <dd className="text-lg font-semibold text-amber-800">UGX 2,000,000</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-blue-600">Livestock Sales</dt>
                          <dd className="text-lg font-semibold text-blue-800">UGX 67,900,000</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-green-600">Feed Efficiency</dt>
                          <dd className="flex items-center">
                            <div className="w-full mr-2">
                              <Progress value={78} className="h-2" />
                            </div>
                            <span className="text-xs">78%</span>
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>

                  <Card className="border-green-100 shadow-sm">
                    <CardHeader className="border-b border-green-50">
                      <CardTitle className="text-base text-green-800">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-green-600" />
                          Weekly Tasks
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="font-medium">Milk Collection Report</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Today</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                            <span className="font-medium">Cattle Health Check</span>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Tomorrow</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                            <span className="font-medium">Feed Inventory Update</span>
                          </div>
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Friday</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                            <span className="font-medium">Staff Payroll Processing</span>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Saturday</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-green-100 shadow-sm">
                    <CardHeader className="border-b border-green-50">
                      <CardTitle className="text-base text-green-800">
                        <div className="flex items-center">
                          <Beef className="h-5 w-5 mr-2 text-green-600" />
                          Cattle Stock
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="grid grid-cols-2 gap-3">
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-green-700">Mother Cows:</span> 
                          <span className="font-medium text-green-900">24</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-green-700">Heifers:</span> 
                          <span className="font-medium text-green-900">36</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-green-700">Bulls:</span> 
                          <span className="font-medium text-green-900">15</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-green-700">Female Calves:</span> 
                          <span className="font-medium text-green-900">32</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-green-700">Male Calves:</span> 
                          <span className="font-medium text-green-900">28</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-green-700">Total:</span> 
                          <span className="font-medium text-green-900">135</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-green-100 shadow-sm">
                    <CardHeader className="border-b border-green-50">
                      <CardTitle className="text-base text-green-800">
                        <div className="flex items-center">
                          <Tractor className="h-5 w-5 mr-2 text-green-600" />
                          Silage & Feed Stock
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-3">
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-green-700">Hay Bales:</span> 
                          <span className="font-medium text-green-900">320 units</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-green-700">Maize Silage:</span> 
                          <span className="font-medium text-green-900">45 tons</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-green-700">Concentrates:</span> 
                          <span className="font-medium text-green-900">1,200 kg</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-green-700">Days of Feed Remaining:</span> 
                          <span className="font-medium text-green-900">45 days</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="cattle">
                <CattleManagement isDataEntry={true} />
              </TabsContent>

              <TabsContent value="milk">
                <MilkProduction isDataEntry={true} />
              </TabsContent>

              <TabsContent value="fattening">
                <CustomCattleFattening isDataEntry={true} />
              </TabsContent>

              <TabsContent value="silage">
                <SilageManager farmId="bukomero" isDataEntry={true} />
              </TabsContent>

              <TabsContent value="staff">
                <StaffMembers farmId="bukomero" isDataEntry={true} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>;
};

export default BukomeroDairyDashboard;
