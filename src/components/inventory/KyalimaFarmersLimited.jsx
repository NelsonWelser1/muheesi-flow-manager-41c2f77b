import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
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
import CattleManagement from "./kyalima/CattleManagement";
import MilkProduction from "./kyalima/MilkProduction";
import CattleFattening from "./kyalima/CattleFattening";
import LoanManager from "./kyalima/LoanManager";
import SilageManager from "./shared/modules/SilageManager";
import StaffMembers from "./shared/modules/StaffMembers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const KyalimaFarmersLimited = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

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
      description: "Preparing your Kyalima Farmers Limited dashboard export..."
    });
  };

  const handlePrint = () => {
    toast({
      title: "Print Prepared",
      description: "Sending Kyalima dashboard to printer..."
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
              <TabsTrigger value="loans" className="flex flex-col py-1 px-1.5 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-purple-800">
                <DollarSign className="h-3.5 w-3.5 mx-auto" />
                <span className="text-xs">Loans</span>
              </TabsTrigger>
              <TabsTrigger value="silage" className="flex flex-col py-1 px-1.5 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-purple-800">
                <Download className="h-3.5 w-3.5 mx-auto" />
                <span className="text-xs">Silage</span>
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex flex-col py-1 px-1.5 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-purple-800">
                <Users className="h-3.5 w-3.5 mx-auto" />
                <span className="text-xs">Staff</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex flex-col py-1 px-1.5 gap-0.5 data-[state=active]:bg-white data-[state=active]:text-purple-800">
                <BarChart3 className="h-3.5 w-3.5 mx-auto" />
                <span className="text-xs">Reports</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Financial Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Revenue</span>
                        <span className="font-bold">{companyMetrics.revenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expenses</span>
                        <span className="font-bold">{companyMetrics.expenses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Loans</span>
                        <span className="font-bold">{companyMetrics.totalLoans}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Operational Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Cattle</span>
                        <span className="font-bold">{companyMetrics.totalCattle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Milk Production</span>
                        <span className="font-bold">{companyMetrics.milkProduction}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Fattening</span>
                        <span className="font-bold">{companyMetrics.activeFattening}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{format(new Date(), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>Cattle Health Check</TableCell>
                        <TableCell>Routine check-up for herd #3</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{format(new Date(), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>Milk Collection</TableCell>
                        <TableCell>Morning milk collection processed</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cattle" className="space-y-4">
              <CattleManagement />
            </TabsContent>

            <TabsContent value="milk" className="space-y-4">
              <MilkProduction />
            </TabsContent>

            <TabsContent value="loans" className="space-y-4">
              <LoanManager />
            </TabsContent>

            <TabsContent value="silage" className="space-y-4">
              <SilageManager />
            </TabsContent>

            <TabsContent value="staff" className="space-y-4">
              <StaffMembers />
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Financial Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Detailed financial reports and analytics.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KyalimaFarmersLimited;
