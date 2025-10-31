
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, TrendingDown, AlertCircle } from 'lucide-react';

const RiskManagement = ({ selectedCompany }) => {
  const riskData = {
    riskMatrix: [
      {
        id: 1,
        title: 'Supply Chain Disruption',
        category: 'Operational',
        probability: 'Medium',
        impact: 'High',
        severity: 'High',
        company: 'All Companies',
        description: 'Potential disruption in raw material supply due to weather or political factors',
        mitigation: 'Diversify supplier base, maintain strategic inventory',
        status: 'Active',
        lastReviewed: '2024-05-15'
      },
      {
        id: 2,
        title: 'Currency Exchange Fluctuation',
        category: 'Financial',
        probability: 'High',
        impact: 'Medium',
        severity: 'Medium',
        company: 'KAJON Coffee Limited',
        description: 'Exchange rate volatility affecting export revenues',
        mitigation: 'Implement hedging strategies, diversify currency exposure',
        status: 'Monitored',
        lastReviewed: '2024-05-20'
      },
      {
        id: 3,
        title: 'Equipment Failure',
        category: 'Operational',
        probability: 'Low',
        impact: 'High',
        severity: 'Medium',
        company: 'Grand Berna Dairies',
        description: 'Critical production equipment failure causing downtime',
        mitigation: 'Preventive maintenance, backup equipment, service contracts',
        status: 'Mitigated',
        lastReviewed: '2024-05-10'
      },
      {
        id: 4,
        title: 'Regulatory Changes',
        category: 'Compliance',
        probability: 'Medium',
        impact: 'Medium',
        severity: 'Medium',
        company: 'All Companies',
        description: 'New environmental or food safety regulations',
        mitigation: 'Regular compliance monitoring, government relations',
        status: 'Active',
        lastReviewed: '2024-05-18'
      },
      {
        id: 5,
        title: 'Cybersecurity Threats',
        category: 'Technology',
        probability: 'Medium',
        impact: 'High',
        severity: 'High',
        company: 'All Companies',
        description: 'Data breaches, system attacks, or ransomware',
        mitigation: 'Security protocols, staff training, backup systems',
        status: 'Active',
        lastReviewed: '2024-05-22'
      }
    ],
    riskTrends: {
      overall: 72,
      categories: [
        { name: 'Operational', level: 68, trend: 'stable' },
        { name: 'Financial', level: 75, trend: 'improving' },
        { name: 'Compliance', level: 82, trend: 'stable' },
        { name: 'Technology', level: 65, trend: 'deteriorating' },
        { name: 'Strategic', level: 70, trend: 'improving' }
      ]
    },
    compliance: [
      {
        area: 'Food Safety Standards',
        status: 'Compliant',
        lastAudit: '2024-03-15',
        nextReview: '2024-09-15',
        score: 96
      },
      {
        area: 'Environmental Regulations',
        status: 'Minor Issues',
        lastAudit: '2024-04-10',
        nextReview: '2024-10-10',
        score: 88
      },
      {
        area: 'Labor Standards',
        status: 'Compliant',
        lastAudit: '2024-02-20',
        nextReview: '2024-08-20',
        score: 94
      },
      {
        area: 'Export Regulations',
        status: 'Compliant',
        lastAudit: '2024-05-01',
        nextReview: '2024-11-01',
        score: 92
      }
    ]
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-primary-foreground';
      case 'low': return 'bg-success text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'compliant': return 'bg-success text-primary-foreground';
      case 'minor issues': return 'bg-warning text-primary-foreground';
      case 'non-compliant': return 'bg-destructive text-destructive-foreground';
      case 'active': return 'bg-destructive/10 text-destructive border-destructive';
      case 'monitored': return 'bg-warning/10 text-warning border-warning';
      case 'mitigated': return 'bg-success/10 text-success border-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '↗️';
      case 'deteriorating': return '↘️';
      default: return '→';
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {riskData.riskTrends.overall}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Risk Health</div>
              <Progress value={riskData.riskTrends.overall} className="mt-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {riskData.riskTrends.categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{category.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{category.level}%</span>
                    <span>{getTrendIcon(category.trend)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Active Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {riskData.riskMatrix.filter(risk => risk.status === 'Active').map((risk, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{risk.title}</span>
                  <Badge className={getSeverityColor(risk.severity)}>
                    {risk.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Risk</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Probability</th>
                  <th className="text-left p-2">Impact</th>
                  <th className="text-left p-2">Severity</th>
                  <th className="text-left p-2">Company</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Last Reviewed</th>
                </tr>
              </thead>
              <tbody>
                {riskData.riskMatrix.map((risk) => (
                  <tr key={risk.id} className="border-b">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{risk.title}</div>
                        <div className="text-xs text-muted-foreground">{risk.description}</div>
                      </div>
                    </td>
                    <td className="p-2">{risk.category}</td>
                    <td className="p-2">{risk.probability}</td>
                    <td className="p-2">{risk.impact}</td>
                    <td className="p-2">
                      <Badge className={getSeverityColor(risk.severity)}>
                        {risk.severity}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm">{risk.company}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(risk.status)}>
                        {risk.status}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm">{risk.lastReviewed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {riskData.compliance.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{item.area}</h4>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>Score: {item.score}%</div>
                  <div>Last Audit: {item.lastAudit}</div>
                  <div>Next Review: {item.nextReview}</div>
                </div>
                <Progress value={item.score} className="mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskManagement;
