
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, TrendingUp, MapPin } from 'lucide-react';

const CustomerInsights = () => {
  const customerSegments = [
    {
      segment: "Young Professionals",
      percentage: "35%",
      size: "4,200",
      value: "$125",
      growth: "+8%"
    },
    {
      segment: "Families",
      percentage: "28%",
      size: "3,360",
      value: "$98",
      growth: "+12%"
    },
    {
      segment: "Seniors",
      percentage: "22%",
      size: "2,640",
      value: "$156",
      growth: "+5%"
    },
    {
      segment: "Students",
      percentage: "15%",
      size: "1,800",
      value: "$67",
      growth: "+15%"
    }
  ];

  const behaviorInsights = [
    {
      behavior: "Purchase Frequency",
      metric: "2.3x/month",
      trend: "increasing",
      impact: "High"
    },
    {
      behavior: "Avg. Session Duration",
      metric: "4m 32s",
      trend: "stable",
      impact: "Medium"
    },
    {
      behavior: "Cart Abandonment",
      metric: "23%",
      trend: "decreasing",
      impact: "High"
    },
    {
      behavior: "Return Rate",
      metric: "8.5%",
      trend: "decreasing",
      impact: "Low"
    }
  ];

  const geographicData = [
    { region: "Urban Centers", percentage: "45%", growth: "+10%" },
    { region: "Suburban Areas", percentage: "35%", growth: "+7%" },
    { region: "Rural Areas", percentage: "20%", growth: "+12%" }
  ];

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return '↗';
      case 'decreasing': return '↘';
      case 'stable': return '→';
      default: return '—';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Customer Insights</h3>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Customer Segmentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {customerSegments.map((segment, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{segment.segment}</h4>
                  <Badge variant="outline">{segment.percentage}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size</span>
                    <span className="font-medium">{segment.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Value</span>
                    <span className="font-medium">{segment.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Growth</span>
                    <span className="font-medium text-green-600">{segment.growth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Behavior Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {behaviorInsights.map((insight, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{insight.behavior}</p>
                  <p className="text-2xl font-bold">{insight.metric}</p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 ${getTrendColor(insight.trend)}`}>
                    <span>{getTrendIcon(insight.trend)}</span>
                    <span className="text-sm">{insight.trend}</span>
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {insight.impact} Impact
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {geographicData.map((data, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{data.region}</p>
                  <p className="text-2xl font-bold">{data.percentage}</p>
                </div>
                <Badge className="bg-green-500">{data.growth}</Badge>
              </div>
            ))}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Insight:</strong> Rural areas showing highest growth rate, 
                indicating expansion opportunity for targeted campaigns.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Journey Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">23%</p>
              <p className="text-sm text-muted-foreground">Awareness</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">18%</p>
              <p className="text-sm text-muted-foreground">Consideration</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">12%</p>
              <p className="text-sm text-muted-foreground">Purchase</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">68%</p>
              <p className="text-sm text-muted-foreground">Retention</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">34%</p>
              <p className="text-sm text-muted-foreground">Advocacy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerInsights;
