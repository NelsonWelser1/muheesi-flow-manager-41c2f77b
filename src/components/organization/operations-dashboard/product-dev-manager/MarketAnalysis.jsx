
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Globe, BarChart3 } from 'lucide-react';

const MarketAnalysis = () => {
  const marketTrends = [
    {
      trend: "Sustainable Packaging",
      impact: "high",
      opportunity: "85%",
      timeline: "Q3 2024",
      description: "Growing demand for eco-friendly packaging solutions"
    },
    {
      trend: "Digital Agriculture",
      impact: "medium",
      opportunity: "67%",
      timeline: "Q4 2024",
      description: "IoT and automation in farming practices"
    },
    {
      trend: "Premium Organic Products",
      impact: "high",
      opportunity: "92%",
      timeline: "Q2 2024",
      description: "Increasing consumer preference for organic options"
    }
  ];

  const competitorAnalysis = [
    {
      competitor: "AgriTech Solutions",
      marketShare: "23%",
      strength: "Technology",
      weakness: "Price Point",
      threat: "Medium"
    },
    {
      competitor: "Green Valley Co.",
      marketShare: "18%",
      strength: "Brand Recognition",
      weakness: "Innovation",
      threat: "High"
    },
    {
      competitor: "Farm Fresh Ltd.",
      marketShare: "15%",
      strength: "Distribution",
      weakness: "Product Range",
      threat: "Low"
    }
  ];

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getThreatColor = (threat) => {
    switch (threat.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Market Analysis</h3>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Market Trends & Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {marketTrends.map((trend, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{trend.trend}</h4>
                <div className="flex gap-2">
                  <Badge className={getImpactColor(trend.impact)}>
                    {trend.impact} impact
                  </Badge>
                  <Badge variant="outline">{trend.timeline}</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{trend.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm">Market Opportunity</span>
                <span className="text-lg font-bold text-green-600">{trend.opportunity}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Competitive Landscape
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {competitorAnalysis.map((competitor, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium">{competitor.competitor}</h4>
                <div className="flex gap-2">
                  <Badge variant="outline">{competitor.marketShare}</Badge>
                  <Badge className={getThreatColor(competitor.threat)}>
                    {competitor.threat} threat
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Key Strength</p>
                  <p className="font-medium">{competitor.strength}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Weakness</p>
                  <p className="font-medium">{competitor.weakness}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Market Size & Segmentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">$2.8B</p>
              <p className="text-sm text-muted-foreground">Total Addressable Market</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">$680M</p>
              <p className="text-sm text-muted-foreground">Serviceable Market</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">$145M</p>
              <p className="text-sm text-muted-foreground">Target Market</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">12.3%</p>
              <p className="text-sm text-muted-foreground">Growth Rate (CAGR)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalysis;
