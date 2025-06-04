
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Shield, Award, Eye } from 'lucide-react';

const BrandManagement = () => {
  const brandMetrics = [
    { label: "Brand Recognition", value: "73%", trend: "+8%" },
    { label: "Brand Loyalty", value: "68%", trend: "+5%" },
    { label: "Brand Trust", value: "81%", trend: "+12%" },
    { label: "Market Position", value: "#3", trend: "+1" }
  ];

  const brandAssets = [
    { type: "Logo Variations", count: 12, status: "updated" },
    { type: "Color Palettes", count: 8, status: "current" },
    { type: "Typography Guidelines", count: 5, status: "current" },
    { type: "Brand Photography", count: 247, status: "expanding" },
    { type: "Marketing Templates", count: 34, status: "current" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Brand Management</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {brandMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-green-600">{metric.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Brand Guidelines Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Logo Usage</span>
                <Badge className="bg-green-500">98% Compliant</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Color Standards</span>
                <Badge className="bg-green-500">95% Compliant</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Typography</span>
                <Badge className="bg-yellow-500">87% Compliant</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Messaging Tone</span>
                <Badge className="bg-green-500">92% Compliant</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Brand Asset Library
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {brandAssets.map((asset, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{asset.type}</p>
                  <p className="text-sm text-muted-foreground">{asset.count} items</p>
                </div>
                <Badge variant="outline">{asset.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Brand Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">4.2/5</p>
              <p className="text-sm text-muted-foreground">Brand Perception Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">67%</p>
              <p className="text-sm text-muted-foreground">Unaided Brand Recall</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">85%</p>
              <p className="text-sm text-muted-foreground">Brand Recommendation Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandManagement;
