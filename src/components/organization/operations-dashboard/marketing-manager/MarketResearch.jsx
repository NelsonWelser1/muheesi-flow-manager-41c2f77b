
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Users, Target, FileText, Plus } from 'lucide-react';

const MarketResearch = () => {
  const researchProjects = [
    {
      title: "Consumer Behavior Analysis Q2 2024",
      status: "completed",
      completion: "100%",
      insights: 12,
      participants: 1247
    },
    {
      title: "Competitor Pricing Strategy Study",
      status: "in-progress",
      completion: "78%",
      insights: 8,
      participants: 850
    },
    {
      title: "Market Trend Forecasting",
      status: "planning",
      completion: "15%",
      insights: 2,
      participants: 0
    }
  ];

  const marketInsights = [
    {
      category: "Consumer Preferences",
      insight: "64% prefer eco-friendly packaging",
      impact: "High",
      actionable: true
    },
    {
      category: "Price Sensitivity",
      insight: "15% price elasticity in premium segment",
      impact: "Medium",
      actionable: true
    },
    {
      category: "Channel Preference",
      insight: "Online channels growing 23% YoY",
      impact: "High",
      actionable: false
    },
    {
      category: "Demographics",
      insight: "Millennials represent 45% of customer base",
      impact: "Medium",
      actionable: true
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'planning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h3 className="text-xl font-semibold">Market Research</h3>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Research Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Active Research Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {researchProjects.map((project, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{project.title}</h4>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Progress</p>
                    <p className="font-medium">{project.completion}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Insights</p>
                    <p className="font-medium">{project.insights}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Participants</p>
                    <p className="font-medium">{project.participants}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {marketInsights.map((item, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <Badge variant="outline">{item.category}</Badge>
                  <div className="flex gap-2">
                    <span className={`text-xs font-medium ${getImpactColor(item.impact)}`}>
                      {item.impact}
                    </span>
                    {item.actionable && (
                      <Badge className="bg-purple-500 text-xs">Actionable</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm">{item.insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Market Opportunity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">$2.4M</p>
              <p className="text-sm text-muted-foreground">Market Size (TAM)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">$680K</p>
              <p className="text-sm text-muted-foreground">Addressable Market (SAM)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">$145K</p>
              <p className="text-sm text-muted-foreground">Target Market (SOM)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">18.2%</p>
              <p className="text-sm text-muted-foreground">Growth Rate (CAGR)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketResearch;
