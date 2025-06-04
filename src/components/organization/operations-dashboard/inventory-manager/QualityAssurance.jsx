
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle, XCircle, Calendar, FileText } from 'lucide-react';

const QualityAssurance = () => {
  const qualityChecks = [
    {
      id: 'QC001',
      item: 'Arabica Coffee Batch #A2024-156',
      checkType: 'Incoming Inspection',
      inspector: 'Dr. Sarah Mukasa',
      checkDate: '2024-06-04',
      status: 'Passed',
      score: 98,
      criteria: ['Moisture Content', 'Bean Size', 'Color Consistency'],
      findings: 'Excellent quality, meets all standards',
      nextCheck: '2024-06-11'
    },
    {
      id: 'QC002',
      item: 'Dairy Products Batch #D2024-089',
      checkType: 'Process Monitoring',
      inspector: 'James Okello',
      checkDate: '2024-06-04',
      status: 'Failed',
      score: 72,
      criteria: ['Temperature Control', 'pH Levels', 'Contamination'],
      findings: 'Temperature variance detected during processing',
      nextCheck: '2024-06-05'
    },
    {
      id: 'QC003',
      item: 'Packaging Materials Lot #PM2024-234',
      checkType: 'Material Testing',
      inspector: 'Grace Nakato',
      checkDate: '2024-06-03',
      status: 'Under Review',
      score: 85,
      criteria: ['Material Strength', 'Seal Integrity', 'Print Quality'],
      findings: 'Minor printing inconsistencies noted',
      nextCheck: '2024-06-10'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Passed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Passed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Under Review': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Shield className="h-4 w-4 text-blue-600" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Quality Assurance</h3>
          <p className="text-sm text-muted-foreground">Monitor quality standards and inspection results</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Quality Report
          </Button>
          <Button className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            New Inspection
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <p className="text-xs text-muted-foreground">Average this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Inspections Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">8 passed, 1 failed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">97.8%</div>
            <p className="text-xs text-muted-foreground">Regulatory standards</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2</div>
            <p className="text-xs text-muted-foreground">Require immediate action</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {qualityChecks.map((check) => (
          <Card key={check.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <h4 className="font-semibold text-lg">{check.item}</h4>
                    <p className="text-sm text-muted-foreground">
                      {check.checkType} | Inspector: {check.inspector}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-2xl font-bold ${getScoreColor(check.score)}`}>
                    {check.score}%
                  </div>
                  <Badge className={getStatusColor(check.status)}>
                    {check.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Check Date</p>
                    <p className="font-semibold">{check.checkDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Next Check</p>
                    <p className="font-semibold">{check.nextCheck}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Check ID</p>
                    <p className="font-semibold">{check.id}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Quality Criteria</p>
                <div className="flex gap-2 mb-3">
                  {check.criteria.map((criterion, index) => (
                    <Badge key={index} variant="outline">
                      {criterion}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm">
                  <span className="font-medium">Findings: </span>
                  {check.findings}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Full Report
                </Button>
                <Button variant="outline" size="sm">
                  Update Status
                </Button>
                <Button variant="outline" size="sm">
                  Schedule Recheck
                </Button>
                <Button variant="outline" size="sm">
                  Generate Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quality Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Overall Quality Score</span>
              <span className="text-sm font-semibold text-green-600">+2.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Compliance Rate</span>
              <span className="text-sm font-semibold text-blue-600">+1.8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Failed Inspections</span>
              <span className="text-sm font-semibold text-red-600">-15%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Critical Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Temperature Control</span>
              <Badge variant="outline" className="text-red-600">High Risk</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Packaging Quality</span>
              <Badge variant="outline" className="text-yellow-600">Medium Risk</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Raw Material Purity</span>
              <Badge variant="outline" className="text-green-600">Low Risk</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Inspections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="font-semibold">Tomorrow:</span> Coffee Batch QC
            </div>
            <div className="text-sm">
              <span className="font-semibold">June 6:</span> Dairy Equipment Calibration
            </div>
            <div className="text-sm">
              <span className="font-semibold">June 8:</span> Warehouse Environmental Check
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QualityAssurance;
