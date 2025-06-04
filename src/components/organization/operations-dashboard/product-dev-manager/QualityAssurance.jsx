
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle, FileCheck } from 'lucide-react';

const QualityAssurance = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Quality Assurance</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">96.8%</div>
            <p className="text-xs text-muted-foreground">↑ 2.3% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Defect Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0.23%</div>
            <p className="text-xs text-muted-foreground">↓ 0.1% reduction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Testing Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">94%</div>
            <p className="text-xs text-muted-foreground">Automated testing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.1%</div>
            <p className="text-xs text-muted-foreground">All standards met</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Quality Standards & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>ISO 9001:2015</span>
                <Badge className="bg-green-500">Certified</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>ISO 14001:2015</span>
                <Badge className="bg-green-500">Certified</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>HACCP</span>
                <Badge className="bg-green-500">Compliant</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Organic Certification</span>
                <Badge className="bg-yellow-500">Pending Renewal</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>GMP Standards</span>
                <Badge className="bg-green-500">Compliant</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Fair Trade</span>
                <Badge className="bg-green-500">Certified</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>BRC Food Safety</span>
                <Badge className="bg-green-500">Grade A</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>SQF Certification</span>
                <Badge className="bg-blue-500">In Progress</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Quality Metrics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">3,456</p>
              <p className="text-sm text-muted-foreground">Tests Conducted</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">98.7%</p>
              <p className="text-sm text-muted-foreground">Pass Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">12</p>
              <p className="text-sm text-muted-foreground">Quality Audits</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityAssurance;
