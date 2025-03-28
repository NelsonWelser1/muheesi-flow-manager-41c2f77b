import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  BookOpen
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { KyalimaPDFExport } from "./kyalima/utils/KyalimaPDFExport";
import CattleManagement from "./kyalima/CattleManagement";
import MilkProduction from "./kyalima/MilkProduction";
import CattleFattening from "./kyalima/CattleFattening";
import LoanManager from "./kyalima/LoanManager";

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
    KyalimaPDFExport.exportDashboard('kyalima-dashboard');
    toast({
      title: "Export Started",
      description: "Preparing your Kyalima Farmers Limited dashboard export...",
    });
  };

  const handlePrint = () => {
    KyalimaPDFExport.printContent('kyalima-content');
    toast({
      title: "Print Prepared",
      description: "Sending Kyalima dashboard to printer...",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Kyalima Farmers Limited</CardTitle>
            <CardDescription>Manage cattle, milk production, fattening program, and loans</CardDescription>
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
              <TabsTrigger value="loans" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>Loan Manager</span>
              </TabsTrigger>
            </TabsList>

            <div id="kyalima-content">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{companyMetrics.totalCattle}</div>
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
                      <div className="text-2xl font-bold">{companyMetrics.milkProduction}</div>
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
                      <div className="text-2xl font-bold">{companyMetrics.activeFattening}</div>
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
                          <dd className="text-lg font-semibold">{companyMetrics.revenue}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Expenses (Monthly)</dt>
                          <dd className="text-lg font-semibold">{companyMetrics.expenses}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Total Loans</dt>
                          <dd className="text-lg font-semibold">{companyMetrics.totalLoans}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Loan Repayment</dt>
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
                          <h3 className="text-sm font-semibold mb-2">Grain Stock</h3>
                          <ul className="space-y-1">
                            <li className="flex justify-between items-center text-sm">
                              <span>Maize:</span> <span className="font-medium">20,000 MT</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                              <span>Soybean:</span> <span className="font-medium">50,000 MT</span>
                            </li>
                          </ul>
                        </div>
                      </div>
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

              <TabsContent value="loans">
                <LoanManager />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KyalimaFarmersLimited;
