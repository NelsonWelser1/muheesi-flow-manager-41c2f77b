
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, AlertTriangle, Eye, Key, FileCheck } from 'lucide-react';

const SecurityManagement = () => {
  const securityMetrics = [
    { category: "Firewall Protection", score: 98, status: "excellent" },
    { category: "Antivirus Coverage", score: 96, status: "excellent" },
    { category: "Access Control", score: 92, status: "good" },
    { category: "Data Encryption", score: 94, status: "excellent" },
    { category: "Backup Security", score: 88, status: "good" },
    { category: "Network Monitoring", score: 90, status: "good" }
  ];

  const securityIncidents = [
    {
      type: "Suspicious Login Attempt",
      severity: "medium",
      time: "2 hours ago",
      status: "investigating"
    },
    {
      type: "Failed File Access",
      severity: "low",
      time: "5 hours ago",
      status: "resolved"
    },
    {
      type: "Unusual Network Traffic",
      severity: "high",
      time: "1 day ago",
      status: "mitigated"
    }
  ];

  const complianceStatus = [
    { standard: "ISO 27001", status: "compliant", lastAudit: "2024-03-15" },
    { standard: "GDPR", status: "compliant", lastAudit: "2024-04-02" },
    { standard: "SOX", status: "review", lastAudit: "2024-02-28" },
    { standard: "PCI DSS", status: "compliant", lastAudit: "2024-03-20" }
  ];

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getComplianceColor = (status) => {
    switch (status) {
      case 'compliant': return 'bg-green-500';
      case 'review': return 'bg-yellow-500';
      case 'non-compliant': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Security Management</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{metric.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                  {metric.score}%
                </span>
                <Badge variant="outline" className={metric.status === 'excellent' ? 'text-green-600' : 'text-yellow-600'}>
                  {metric.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Incidents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {securityIncidents.map((incident, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{incident.type}</h4>
                  <Badge className={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{incident.time}</span>
                  <Badge variant="outline">{incident.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {complianceStatus.map((compliance, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{compliance.standard}</p>
                  <p className="text-sm text-muted-foreground">
                    Last audit: {compliance.lastAudit}
                  </p>
                </div>
                <Badge className={getComplianceColor(compliance.status)}>
                  {compliance.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Security Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Lock className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">247</span>
              </div>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Key className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">1,456</span>
              </div>
              <p className="text-sm text-muted-foreground">Access Attempts</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Shield className="h-4 w-4 text-purple-500" />
                <span className="text-2xl font-bold">23</span>
              </div>
              <p className="text-sm text-muted-foreground">Blocked Threats</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-2xl font-bold">5</span>
              </div>
              <p className="text-sm text-muted-foreground">Open Alerts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityManagement;
