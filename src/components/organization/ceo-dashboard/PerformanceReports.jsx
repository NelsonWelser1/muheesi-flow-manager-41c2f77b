
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  DollarSign,
  Users,
  Package,
  Target
} from 'lucide-react';

const PerformanceReports = ({ selectedCompany }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('quarterly');

  const reportData = {
    available: [
      {
        id: 1,
        title: 'Q3 2024 Executive Summary',
        type: 'Executive',
        period: 'Q3 2024',
        status: 'Ready',
        generated: '2024-05-25',
        size: '2.4 MB',
        pages: 15,
        company: 'All Companies'
      },
      {
        id: 2,
        title: 'Financial Performance Report',
        type: 'Financial',
        period: 'May 2024',
        status: 'Ready',
        generated: '2024-05-20',
        size: '1.8 MB',
        pages: 22,
        company: 'All Companies'
      },
      {
        id: 3,
        title: 'Operational Metrics Dashboard',
        type: 'Operational',
        period: 'May 2024',
        status: 'Processing',
        generated: '2024-05-23',
        size: '3.1 MB',
        pages: 18,
        company: 'Grand Berna Dairies'
      },
      {
        id: 4,
        title: 'Coffee Export Analysis',
        type: 'Strategic',
        period: 'Q3 2024',
        status: 'Ready',
        generated: '2024-05-22',
        size: '2.7 MB',
        pages: 12,
        company: 'KAJON Coffee Limited'
      },
      {
        id: 5,
        title: 'Risk Assessment Report',
        type: 'Risk',
        period: 'May 2024',
        status: 'Ready',
        generated: '2024-05-21',
        size: '1.5 MB',
        pages: 8,
        company: 'All Companies'
      }
    ],
    kpiSummary: {
      financial: {
        revenue: { current: 2400000, previous: 2150000, change: 11.6 },
        profit: { current: 444000, previous: 387000, change: 14.7 },
        margin: { current: 18.5, previous: 18.0, change: 0.5 },
        roi: { current: 15.2, previous: 13.8, change: 1.4 }
      },
      operational: {
        efficiency: { current: 87, previous: 84, change: 3 },
        quality: { current: 96, previous: 94, change: 2 },
        capacity: { current: 89, previous: 85, change: 4 },
        downtime: { current: 3.2, previous: 4.1, change: -0.9 }
      },
      strategic: {
        marketShare: { current: 23, previous: 21, change: 2 },
        customerSat: { current: 4.2, previous: 4.0, change: 0.2 },
        innovation: { current: 7.3, previous: 6.8, change: 0.5 },
        sustainability: { current: 82, previous: 78, change: 4 }
      }
    },
    scheduled: [
      {
        title: 'Monthly Operations Report',
        frequency: 'Monthly',
        nextDue: '2024-06-01',
        recipients: ['CEO', 'COO', 'Board'],
        autoGenerate: true
      },
      {
        title: 'Quarterly Financial Report',
        frequency: 'Quarterly',
        nextDue: '2024-07-01',
        recipients: ['CEO', 'CFO', 'Board', 'Investors'],
        autoGenerate: true
      },
      {
        title: 'Annual Strategic Review',
        frequency: 'Annually',
        nextDue: '2025-01-15',
        recipients: ['CEO', 'Board', 'Senior Management'],
        autoGenerate: false
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ready': return 'bg-green-500 text-white';
      case 'processing': return 'bg-yellow-500 text-white';
      case 'failed': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'financial': return <DollarSign className="h-4 w-4" />;
      case 'operational': return <BarChart3 className="h-4 w-4" />;
      case 'strategic': return <Target className="h-4 w-4" />;
      case 'risk': return <Package className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getChangeColor = (change, reverse = false) => {
    const positive = reverse ? change < 0 : change > 0;
    return positive ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Report Generation Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Performance Reports</CardTitle>
            <div className="flex items-center space-x-2">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Available Reports</TabsTrigger>
          <TabsTrigger value="kpi">KPI Summary</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {reportData.available.map((report) => (
              <Card key={report.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(report.type)}
                      <div>
                        <CardTitle className="text-sm">{report.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">{report.company}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>Period: {report.period}</div>
                    <div>Pages: {report.pages}</div>
                    <div>Generated: {report.generated}</div>
                    <div>Size: {report.size}</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1" disabled={report.status !== 'Ready'}>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline" disabled={report.status !== 'Ready'}>
                      <Calendar className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kpi" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Financial KPIs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Financial Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(reportData.kpiSummary.financial).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {key === 'revenue' || key === 'profit' ? formatCurrency(value.current) : `${value.current}%`}
                      </div>
                      <div className={`text-sm ${getChangeColor(value.change)}`}>
                        {value.change > 0 ? '+' : ''}{value.change}
                        {key === 'revenue' || key === 'profit' ? '' : '%'}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Operational KPIs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Operational Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(reportData.kpiSummary.operational).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="capitalize">{key}</span>
                    <div className="text-right">
                      <div className="font-semibold">{value.current}%</div>
                      <div className={`text-sm ${getChangeColor(value.change, key === 'downtime')}`}>
                        {value.change > 0 ? '+' : ''}{value.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Strategic KPIs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Strategic Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(reportData.kpiSummary.strategic).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {key === 'customerSat' ? value.current : `${value.current}%`}
                      </div>
                      <div className={`text-sm ${getChangeColor(value.change)}`}>
                        {value.change > 0 ? '+' : ''}{value.change}
                        {key === 'customerSat' ? '' : '%'}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.scheduled.map((scheduled, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{scheduled.title}</h4>
                      <div className="text-sm text-muted-foreground">
                        {scheduled.frequency} • Next due: {scheduled.nextDue}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Recipients: {scheduled.recipients.join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={scheduled.autoGenerate ? "default" : "secondary"}>
                        {scheduled.autoGenerate ? "Auto" : "Manual"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceReports;
