
import React, { useState } from 'react';
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
  ArrowLeft,
  Beef,
  Droplet,
  DollarSign,
  Tractor,
  Users,
  BookOpen
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import CattleManagement from './modules/CattleManagement';
import MilkProduction from './modules/MilkProduction';
import CattleFattening from './modules/CattleFattening';
import SilageManager from '../shared/modules/SilageManager';
import StaffMembers from '../shared/modules/StaffMembers';
import { useBukomeroDairyData } from '../../../hooks/useBukomeroDairyData';

const BukomeroDairyDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { farmMetrics, isLoading, error } = useBukomeroDairyData();
  
  const handleExportAll = () => {
    toast({
      title: "Export Started",
      description: "Preparing your Bukomero Dairy Farm dashboard export...",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Print Prepared",
      description: "Sending Bukomero Dairy dashboard to printer...",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/manage-inventory')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Bukomero Dairy Farm</CardTitle>
            <CardDescription>Manage cattle, milk production, fattening program, and silage</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={handleExportAll}
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="cattle" className="flex items-center gap-2">
                <Beef className="h-4 w-4" />
                <span>Cattle Management</span>
              </TabsTrigger>
              <TabsTrigger value="milk" className="flex items-center gap-2">
                <Droplet className="h-4 w-4" />
                <span>Milk Production</span>
              </TabsTrigger>
              <TabsTrigger value="fattening" className="flex items-center gap-2">
                <Beef className="h-4 w-4" />
                <span>Cattle Fattening</span>
              </TabsTrigger>
              <TabsTrigger value="silage" className="flex items-center gap-2">
                <Tractor className="h-4 w-4" />
                <span>Silage & Feed</span>
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center gap-2 md:col-start-1 md:col-span-1">
                <Users className="h-4 w-4" />
                <span>Staff Members</span>
              </TabsTrigger>
            </TabsList>

            <div id="bukomero-content">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{farmMetrics?.totalCattle || 135}</div>
                      <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
                      <div className="flex items-center mt-2">
                        <Beef className="h-4 w-4 text-primary mr-1" />
                        <div className="text-xs text-muted-foreground">
                          Last updated: {format(new Date(), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Daily Milk Production</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{farmMetrics?.milkProduction || "480 liters/day"}</div>
                      <p className="text-xs text-muted-foreground mt-1">Average from 24 mother cows</p>
                      <div className="flex items-center mt-2">
                        <Droplet className="h-4 w-4 text-blue-500 mr-1" />
                        <div className="text-xs text-muted-foreground">2 milking sessions daily</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Cattle in Fattening Program</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{farmMetrics?.activeFattening || 42}</div>
                      <p className="text-xs text-muted-foreground mt-1">Bulls and steers in program</p>
                      <div className="flex items-center mt-2">
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-primary h-2 rounded-full w-3/4"></div>
                        </div>
                        <span className="text-xs ml-2">75% to target</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Financial Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Revenue (Monthly)</dt>
                          <dd className="text-lg font-semibold">UGX 3,140,000</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Expenses (Monthly)</dt>
                          <dd className="text-lg font-semibold">UGX 2,000,000</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Livestock Sales</dt>
                          <dd className="text-lg font-semibold">UGX 67,900,000</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Feed Efficiency</dt>
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

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Stock Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold mb-2">Cattle Stock</h3>
                          <ul className="grid grid-cols-2 gap-2">
                            <li className="flex justify-between items-center text-sm">
                              <span>Mother Cows:</span> <span className="font-medium">24</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                              <span>Heifers:</span> <span className="font-medium">36</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                              <span>Bulls:</span> <span className="font-medium">15</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                              <span>Female Calves:</span> <span className="font-medium">32</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                              <span>Male Calves:</span> <span className="font-medium">28</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-2">Silage & Feed Stock</h3>
                          <ul className="space-y-1">
                            <li className="flex justify-between items-center text-sm">
                              <span>Hay Bales:</span> <span className="font-medium">320 units</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                              <span>Maize Silage:</span> <span className="font-medium">45 tons</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                              <span>Concentrates:</span> <span className="font-medium">1,200 kg</span>
                            </li>
                          </ul>
                        </div>
                      </div>
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
                <CattleFattening isDataEntry={true} />
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
    </div>
  );
};

export default BukomeroDairyDashboard;
