
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Factory, Users, Truck, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';

const OperationalMetrics = ({ selectedCompany }) => {
  const operationalData = {
    production: [
      { 
        company: 'Grand Berna Dairies',
        capacity: 95,
        efficiency: 87,
        quality: 96,
        downtime: 3.2,
        output: '45,000L/day'
      },
      {
        company: 'KAJON Coffee Limited',
        capacity: 78,
        efficiency: 92,
        quality: 94,
        downtime: 1.8,
        output: '2,500kg/day'
      },
      {
        company: 'Kyalima Farmers Limited',
        capacity: 85,
        efficiency: 79,
        quality: 88,
        downtime: 4.1,
        output: '1,200 units/day'
      }
    ],
    workforce: {
      totalEmployees: 247,
      productivity: 89,
      satisfaction: 4.2,
      turnover: 12.5,
      absenteeism: 3.8,
      trainingCompliance: 94
    },
    supply_chain: {
      suppliers: 45,
      onTimeDelivery: 92,
      qualityRating: 96,
      costVariance: -2.3,
      inventoryTurnover: 8.5
    },
    alerts: [
      {
        type: 'critical',
        title: 'Equipment Maintenance Due',
        company: 'Grand Berna Dairies',
        description: 'Pasteurizer #2 requires scheduled maintenance',
        priority: 'high'
      },
      {
        type: 'warning',
        title: 'Inventory Low',
        company: 'KAJON Coffee Limited',
        description: 'Green coffee bean stock below threshold',
        priority: 'medium'
      },
      {
        type: 'info',
        title: 'Quality Certification Renewal',
        company: 'Kyalima Farmers Limited',
        description: 'Organic certification expires in 30 days',
        priority: 'low'
      }
    ]
  };

  const getStatusColor = (value, type) => {
    if (type === 'efficiency' || type === 'quality') {
      if (value >= 90) return 'text-success';
      if (value >= 80) return 'text-warning';
      return 'text-destructive';
    }
    if (type === 'downtime') {
      if (value <= 2) return 'text-success';
      if (value <= 5) return 'text-warning';
      return 'text-destructive';
    }
    return 'text-primary';
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="secondary">Medium</Badge>;
      case 'low': return <Badge variant="outline">Low</Badge>;
      default: return <Badge variant="outline">Info</Badge>;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-warning" />;
      default: return <CheckCircle className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Production Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Factory className="h-5 w-5 mr-2" />
            Production Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Company</th>
                  <th className="text-left p-2">Capacity</th>
                  <th className="text-left p-2">Efficiency</th>
                  <th className="text-left p-2">Quality</th>
                  <th className="text-left p-2">Downtime</th>
                  <th className="text-left p-2">Output</th>
                </tr>
              </thead>
              <tbody>
                {operationalData.production.map((company, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{company.company}</td>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <Progress value={company.capacity} className="w-16" />
                        <span className="text-sm">{company.capacity}%</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className={`font-semibold ${getStatusColor(company.efficiency, 'efficiency')}`}>
                        {company.efficiency}%
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`font-semibold ${getStatusColor(company.quality, 'quality')}`}>
                        {company.quality}%
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`font-semibold ${getStatusColor(company.downtime, 'downtime')}`}>
                        {company.downtime}%
                      </span>
                    </td>
                    <td className="p-2 font-medium">{company.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Workforce & Supply Chain */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Workforce Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold">{operationalData.workforce.totalEmployees}</div>
                <div className="text-sm text-muted-foreground">Total Employees</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold text-success">{operationalData.workforce.productivity}%</div>
                <div className="text-sm text-muted-foreground">Productivity</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold text-primary">{operationalData.workforce.satisfaction}/5</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold text-warning">{operationalData.workforce.turnover}%</div>
                <div className="text-sm text-muted-foreground">Turnover</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Supply Chain Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Active Suppliers</span>
                <span className="font-semibold">{operationalData.supply_chain.suppliers}</span>
              </div>
              <div className="flex justify-between">
                <span>On-Time Delivery</span>
                <span className="font-semibold text-success">{operationalData.supply_chain.onTimeDelivery}%</span>
              </div>
              <div className="flex justify-between">
                <span>Quality Rating</span>
                <span className="font-semibold text-primary">{operationalData.supply_chain.qualityRating}%</span>
              </div>
              <div className="flex justify-between">
                <span>Cost Variance</span>
                <span className="font-semibold text-success">{operationalData.supply_chain.costVariance}%</span>
              </div>
              <div className="flex justify-between">
                <span>Inventory Turnover</span>
                <span className="font-semibold">{operationalData.supply_chain.inventoryTurnover}x</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Operational Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {operationalData.alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{alert.title}</h4>
                    {getPriorityBadge(alert.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.company}</p>
                  <p className="text-sm mt-1">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperationalMetrics;
