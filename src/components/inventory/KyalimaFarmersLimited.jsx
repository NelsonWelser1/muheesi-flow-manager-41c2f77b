import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Search,
  RefreshCw,
  FileDown,
  Printer,
  Plus,
  Filter,
  Beef,
  Droplet,
  DollarSign,
  Download,
  Pencil,
  Trash2,
  BookOpen,
  Tractor,
  BarChart3,
  Users,
  AlertCircle,
  ClipboardList,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import CattleManagement from "./kyalima/CattleManagement";
import MilkProduction from "./kyalima/MilkProduction";
import CattleFattening from "./kyalima/CattleFattening";
import LoanManager from "./kyalima/LoanManager";
import SilageManager from "./shared/modules/SilageManager";
import StaffMembers from "./shared/modules/StaffMembers";

const KyalimaFarmersLimited = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  const companyMetrics = {
    totalCattle: 135,
    milkProduction: "480 liters/day",
    activeFattening: 42,
    totalLoans: "UGX 150,000,000",
    revenue: "UGX 28,500,000",
    expenses: "UGX 14,200,000"
  };
  
  const handleExportAll = () => {
    toast({
      title: "Export Started",
      description: "Preparing your Kyalima Farmers Limited dashboard export...",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Print Prepared",
      description: "Sending Kyalima dashboard to printer...",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-purple-100 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent border-b border-purple-100 flex flex-row items-center justify-between pb-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-bold text-purple-800">Kyalima Farmers Limited</CardTitle>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
                <ClipboardList className="h-3.5 w-3.5" />
                <span>Executive Management</span>
              </Badge>
            </div>
            <CardDescription className="text-purple-700">Strategic management of dairy operations and farm assets</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={handleExportAll}
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-7 gap-0.5 bg-purple-50 p-1">
              <TabsTrigger value="overview" className="flex flex-col py-1 px-1.5 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-purple-800">
                <BookOpen className="h-3.5 w-3.5 mx-auto" />
                <span className="text-xs">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="cattle" className="flex flex-col py-1 px-1.5 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-purple-800">
                <Beef className="h-3.5 w-3.5 mx-auto" />
                <span className="text-xs">Cattle</span>
              </TabsTrigger>
              <TabsTrigger value="milk" className="flex flex-col py-1 px-1.5 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-purple-800">
                <Droplet className="h-3.5 w-3.5 mx-auto" />
                <span className="text-xs">Milk</span>
              </TabsTrigger>
              <TabsTrigger value="fattening" className="flex flex-col py-1 px-1.5 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-purple-800">
                <Beef className="h-3.5 w-3.5 mx-auto" />
                <span className="text-xs">Fattening</span>
              </TabsTrigger>
              <TabsTrigger value="silage" className="flex flex-col py-1 px-1.5 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-purple-800">
                <Tractor className="h-3.5 w-3.5 mx-auto" />
                <span className="text-xs">Silage</span>
              </TabsTrigger>
              <TabsTrigger value="loans" className="flex flex-col py-1 px-1.5 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-purple-800">
                <DollarSign className="h-3.5 w-3.5 mx-auto" />
                <span className="text-xs">Loans</span>
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex flex-col py-1 px-1.5 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-purple-800">
                <Users className="h-3.5 w-3.5 mx-auto" />
                <span className="text-xs">Staff</span>
              </TabsTrigger>
            </TabsList>

            <div id="kyalima-content" className="bg-white rounded-lg shadow-sm">
              <TabsContent value="overview" className="space-y-6 focus:outline-none">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-purple-800 flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-purple-500" />
                  <div>
                    <strong>Executive Management Dashboard:</strong> This view aggregates data from all Kyalima operations including Bukomero Dairy Farm for strategic decision-making.
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-purple-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent pb-2">
                      <CardTitle className="text-sm font-medium text-purple-800">Total Cattle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-800">{companyMetrics.totalCattle}</div>
                      <p className="text-xs text-purple-600 mt-1">Across all categories</p>
                      <div className="flex items-center mt-2">
                        <Beef className="h-4 w-4 text-purple-600 mr-1" />
                        <div className="text-xs text-purple-600">
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
                      <div className="text-3xl font-bold text-blue-800">{companyMetrics.milkProduction}</div>
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
                      <div className="text-3xl font-bold text-amber-800">{companyMetrics.activeFattening}</div>
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
                  <Card className="border-purple-100 shadow-sm">
                    <CardHeader className="border-b border-purple-50">
                      <CardTitle className="text-base text-purple-800">
                        <div className="flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                          Financial Overview
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <dl className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-purple-600">Revenue (Monthly)</dt>
                          <dd className="text-lg font-semibold text-purple-800">{companyMetrics.revenue}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-amber-600">Expenses (Monthly)</dt>
                          <dd className="text-lg font-semibold text-amber-800">{companyMetrics.expenses}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-blue-600">Total Loans</dt>
                          <dd className="text-lg font-semibold text-blue-800">{companyMetrics.totalLoans}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-purple-600">Loan Repayment</dt>
                          <dd className="flex items-center">
                            <div className="w-full mr-2">
                              <Progress value={35} className="h-2" />
                            </div>
                            <span className="text-xs">35%</span>
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 shadow-sm">
                    <CardHeader className="border-b border-purple-50">
                      <CardTitle className="text-base text-purple-800">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                          Strategic Objectives
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                            <span className="font-medium">Expand Dairy Production</span>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Q3 2024</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                            <span className="font-medium">Increase Milk Yield</span>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Ongoing</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                            <span className="font-medium">Optimize Feed Costs</span>
                          </div>
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Q2 2024</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="font-medium">Expand Market Reach</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Q4 2024</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-purple-100 shadow-sm">
                    <CardHeader className="border-b border-purple-50">
                      <CardTitle className="text-base text-purple-800">
                        <div className="flex items-center">
                          <Beef className="h-5 w-5 mr-2 text-purple-600" />
                          Cattle Stock
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="grid grid-cols-2 gap-3">
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-purple-700">Mother Cows:</span> 
                          <span className="font-medium text-purple-900">24</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-purple-700">Heifers:</span> 
                          <span className="font-medium text-purple-900">36</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-purple-700">Bulls:</span> 
                          <span className="font-medium text-purple-900">15</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-purple-700">Female Calves:</span> 
                          <span className="font-medium text-purple-900">32</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-purple-700">Male Calves:</span> 
                          <span className="font-medium text-purple-900">28</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 shadow-sm">
                    <CardHeader className="border-b border-purple-50">
                      <CardTitle className="text-base text-purple-800">
                        <div className="flex items-center">
                          <Tractor className="h-5 w-5 mr-2 text-purple-600" />
                          Grain Stock
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-3">
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-purple-700">Maize:</span> 
                          <span className="font-medium text-purple-900">20,000 MT</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-purple-700">Soybean:</span> 
                          <span className="font-medium text-purple-900">50,000 MT</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-purple-700">Hay Bales:</span> 
                          <span className="font-medium text-purple-900">320 units</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                          <span className="text-purple-700">Maize Silage:</span> 
                          <span className="font-medium text-purple-900">45 tons</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="cattle">
                <CattleManagement />
              </TabsContent>

              <TabsContent value="milk">
                <MilkProduction />
              </TabsContent>

              <TabsContent value="fattening">
                <CattleFattening />
              </TabsContent>

              <TabsContent value="silage">
                <SilageManager farmId="kyalima" isDataEntry={false} />
              </TabsContent>

              <TabsContent value="loans">
                <LoanManager />
              </TabsContent>

              <TabsContent value="staff">
                <StaffMembers farmId="bukomero" isDataEntry={false} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KyalimaFarmersLimited;
