
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const ReportingDashboard = () => {
  // Sample KPI data
  const kpis = {
    inspectionPassRate: { value: 94.2, trend: 'up', change: '+2.1%' },
    nonComplianceRate: { value: 2.1, trend: 'down', change: '-0.5%' },
    exportReadiness: { value: 98.5, trend: 'up', change: '+1.2%' },
    auditScore: { value: 87.3, trend: 'up', change: '+3.4%' },
    capaCompletionRate: { value: 76.8, trend: 'down', change: '-2.1%' },
    trainingCompletion: { value: 91.5, trend: 'up', change: '+5.2%' }
  };

  const exportMetrics = [
    { region: 'United States', readiness: 98, batches: 45, status: 'ready' },
    { region: 'European Union', readiness: 95, batches: 32, status: 'ready' },
    { region: 'Japan', readiness: 87, batches: 18, status: 'pending' },
    { region: 'Canada', readiness: 92, batches: 23, status: 'ready' }
  ];

  const complianceMetrics = [
    { standard: 'HACCP', compliance: 96, audits: 4, nextAudit: '2024-07-15' },
    { standard: 'ISO 22000', compliance: 89, audits: 2, nextAudit: '2024-08-20' },
    { standard: 'USDA Organic', compliance: 94, audits: 3, nextAudit: '2024-09-10' },
    { standard: 'FDA', compliance: 91, audits: 5, nextAudit: '2024-06-30' }
  ];

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (status) => {
    return status === 'ready' ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Reporting Dashboard</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Inspection Pass Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{kpis.inspectionPassRate.value}%</div>
              <div className={`flex items-center gap-1 text-sm ${getTrendColor(kpis.inspectionPassRate.trend)}`}>
                {getTrendIcon(kpis.inspectionPassRate.trend)}
                {kpis.inspectionPassRate.change}
              </div>
            </div>
            <Progress value={kpis.inspectionPassRate.value} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Non-compliance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{kpis.nonComplianceRate.value}%</div>
              <div className={`flex items-center gap-1 text-sm ${getTrendColor(kpis.nonComplianceRate.trend)}`}>
                {getTrendIcon(kpis.nonComplianceRate.trend)}
                {kpis.nonComplianceRate.change}
              </div>
            </div>
            <Progress value={kpis.nonComplianceRate.value} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Export Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{kpis.exportReadiness.value}%</div>
              <div className={`flex items-center gap-1 text-sm ${getTrendColor(kpis.exportReadiness.trend)}`}>
                {getTrendIcon(kpis.exportReadiness.trend)}
                {kpis.exportReadiness.change}
              </div>
            </div>
            <Progress value={kpis.exportReadiness.value} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Audit Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{kpis.auditScore.value}%</div>
              <div className={`flex items-center gap-1 text-sm ${getTrendColor(kpis.auditScore.trend)}`}>
                {getTrendIcon(kpis.auditScore.trend)}
                {kpis.auditScore.change}
              </div>
            </div>
            <Progress value={kpis.auditScore.value} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CAPA Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{kpis.capaCompletionRate.value}%</div>
              <div className={`flex items-center gap-1 text-sm ${getTrendColor(kpis.capaCompletionRate.trend)}`}>
                {getTrendIcon(kpis.capaCompletionRate.trend)}
                {kpis.capaCompletionRate.change}
              </div>
            </div>
            <Progress value={kpis.capaCompletionRate.value} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Training Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{kpis.trainingCompletion.value}%</div>
              <div className={`flex items-center gap-1 text-sm ${getTrendColor(kpis.trainingCompletion.trend)}`}>
                {getTrendIcon(kpis.trainingCompletion.trend)}
                {kpis.trainingCompletion.change}
              </div>
            </div>
            <Progress value={kpis.trainingCompletion.value} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Export Readiness by Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Export Readiness by Region
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exportMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(metric.status)}
                  <div>
                    <h4 className="font-medium">{metric.region}</h4>
                    <p className="text-sm text-muted-foreground">{metric.batches} batches ready</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{metric.readiness}%</div>
                  <Progress value={metric.readiness} className="w-24 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Standards Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Compliance Standards Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceMetrics.map((standard, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{standard.standard}</h4>
                  <p className="text-sm text-muted-foreground">
                    {standard.audits} audits completed • Next: {standard.nextAudit}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{standard.compliance}%</div>
                  <Progress value={standard.compliance} className="w-24 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Interactive quality trends chart would appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingDashboard;
