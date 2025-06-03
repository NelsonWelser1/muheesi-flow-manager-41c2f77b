
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, CheckCircle, Clock } from 'lucide-react';

const RiskCompliance = () => {
  const riskAssessments = [
    {
      company: "Grand Berna Dairies",
      overallRisk: "Low",
      compliance: 98,
      lastAudit: "2024-05-15",
      nextAudit: "2024-11-15",
      openIssues: 2,
      criticalIssues: 0
    },
    {
      company: "KAJON Coffee Limited",
      overallRisk: "Medium",
      compliance: 94,
      lastAudit: "2024-04-20",
      nextAudit: "2024-10-20",
      openIssues: 5,
      criticalIssues: 1
    },
    {
      company: "Kyalima Farmers Limited",
      overallRisk: "Low",
      compliance: 96,
      lastAudit: "2024-05-01",
      nextAudit: "2024-11-01",
      openIssues: 3,
      criticalIssues: 0
    }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(riskAssessments.reduce((sum, r) => sum + r.compliance, 0) / riskAssessments.length).toFixed(1)}%
            </p>
            <p className="text-xs text-green-600">Above industry standard</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {riskAssessments.reduce((sum, r) => sum + r.openIssues, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Across all companies</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {riskAssessments.reduce((sum, r) => sum + r.criticalIssues, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Immediate attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Companies at Low Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {riskAssessments.filter(r => r.overallRisk === 'Low').length}
            </p>
            <p className="text-xs text-muted-foreground">Out of {riskAssessments.length} total</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {riskAssessments.map((assessment, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{assessment.company}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getRiskColor(assessment.overallRisk)}>
                    {assessment.overallRisk} Risk
                  </Badge>
                  {assessment.criticalIssues > 0 && (
                    <Badge variant="destructive">
                      {assessment.criticalIssues} Critical
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Compliance Score</p>
                  <p className="text-xl font-bold">{assessment.compliance}%</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Last Audit</p>
                  <p className="text-sm font-medium">
                    {new Date(assessment.lastAudit).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Next Audit</p>
                  <p className="text-sm font-medium">
                    {new Date(assessment.nextAudit).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Open Issues</p>
                  <p className="text-xl font-bold flex items-center gap-1">
                    {assessment.openIssues}
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-1">
                    {assessment.criticalIssues === 0 ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Compliant</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">Action Required</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RiskCompliance;
