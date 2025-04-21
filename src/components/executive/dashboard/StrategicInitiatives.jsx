
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle, ArrowRightCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const StrategicInitiatives = ({ data, loading }) => {
  // Sample strategic initiatives data
  const initiatives = [
    {
      id: 1,
      title: "Coffee Export Expansion",
      company: "KAJON Coffee Limited",
      description: "Expand coffee exports to European markets by 35% over next 12 months",
      progress: 68,
      status: "on-track",
      priority: "high",
      due: "2025-09-15",
      kpis: [
        { name: "New Markets", target: 5, current: 3 },
        { name: "Volume Increase", target: "35%", current: "22%" },
        { name: "Revenue Growth", target: "40%", current: "25%" }
      ]
    },
    {
      id: 2,
      title: "Dairy Factory Automation",
      company: "Grand Berna Dairies",
      description: "Implement automated processing systems to increase efficiency by 25%",
      progress: 42,
      status: "at-risk",
      priority: "high",
      due: "2025-08-30",
      kpis: [
        { name: "Efficiency Gain", target: "25%", current: "12%" },
        { name: "Cost Reduction", target: "15%", current: "7%" },
        { name: "Production Increase", target: "30%", current: "10%" }
      ]
    },
    {
      id: 3,
      title: "Sustainable Farming Practices",
      company: "Kyalima Farmers Limited",
      description: "Implement sustainable farming practices across all operations",
      progress: 85,
      status: "on-track",
      priority: "medium",
      due: "2025-06-30",
      kpis: [
        { name: "Certification", target: "100%", current: "85%" },
        { name: "Water Usage", target: "-30%", current: "-25%" },
        { name: "Organic Yield", target: "+15%", current: "+12%" }
      ]
    },
    {
      id: 4,
      title: "Export Market Diversification",
      company: "Fresheco Farming",
      description: "Diversify export markets to reduce dependency on single regions",
      progress: 32,
      status: "delayed",
      priority: "high",
      due: "2025-10-15",
      kpis: [
        { name: "New Markets", target: 8, current: 3 },
        { name: "Market Share Shift", target: "40%", current: "15%" },
        { name: "Revenue Stability", target: "22%", current: "10%" }
      ]
    }
  ];
  
  // Sample market opportunities
  const marketOpportunities = [
    {
      title: "Middle East Dairy Export",
      description: "Strong demand for high-quality dairy products in Middle Eastern markets",
      potential: "high",
      timeframe: "short-term",
      company: "Grand Berna Dairies"
    },
    {
      title: "Specialty Coffee Development",
      description: "Growing market for specialty coffee varieties in US and European markets",
      potential: "medium",
      timeframe: "medium-term",
      company: "KAJON Coffee Limited"
    },
    {
      title: "Organic Certification Program",
      description: "Premium pricing opportunities for certified organic products",
      potential: "high",
      timeframe: "medium-term",
      company: "All Companies"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'on-track':
        return <Badge className="bg-green-100 text-green-800">On Track</Badge>;
      case 'at-risk':
        return <Badge className="bg-amber-100 text-amber-800">At Risk</Badge>;
      case 'delayed':
        return <Badge className="bg-red-100 text-red-800">Delayed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-[#FFDEE2] text-red-800">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-[#FEF7CD] text-amber-800">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-[#F2FCE2] text-green-800">Low Priority</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getOpportunityBadge = (potential) => {
    switch (potential) {
      case 'high':
        return <Badge className="bg-green-100 text-green-800">High Potential</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800">Medium Potential</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Low Potential</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getTimeframeBadge = (timeframe) => {
    switch (timeframe) {
      case 'short-term':
        return <Badge className="bg-[#E5DEFF] text-[#6E59A5]">Short Term</Badge>;
      case 'medium-term':
        return <Badge className="bg-[#D3E4FD] text-blue-800">Medium Term</Badge>;
      case 'long-term':
        return <Badge className="bg-[#FDE1D3] text-orange-800">Long Term</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading strategic initiatives data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Strategic Initiatives</h2>
      
      {/* Strategic Initiatives Tracker */}
      <div className="space-y-4">
        {initiatives.map((initiative) => (
          <Card key={initiative.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <h3 className="text-lg font-bold">{initiative.title}</h3>
                    <p className="text-sm text-[#8E9196]">{initiative.company}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(initiative.status)}
                    {getPriorityBadge(initiative.priority)}
                  </div>
                </div>
                
                <p className="text-sm">{initiative.description}</p>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm">{initiative.progress}%</span>
                  </div>
                  <Progress 
                    value={initiative.progress} 
                    className={`h-2 ${
                      initiative.status === 'delayed' ? 'bg-red-200' :
                      initiative.status === 'at-risk' ? 'bg-amber-200' : 'bg-green-200'
                    }`} 
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                  {initiative.kpis.map((kpi, kpiIndex) => (
                    <div key={kpiIndex} className="bg-[#F1F0FB] p-3 rounded-lg">
                      <p className="text-xs text-[#8E9196]">{kpi.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm font-medium">Current: {kpi.current}</span>
                        <span className="text-xs text-[#6E59A5]">Target: {kpi.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-[#8E9196] mr-1" />
                    <span className="text-sm text-[#8E9196]">
                      Due: {new Date(initiative.due).toLocaleDateString()}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="h-8">
                    View Details
                    <ArrowRightCircle className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Market Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Market Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketOpportunities.map((opportunity, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                  <div>
                    <h3 className="font-bold">{opportunity.title}</h3>
                    <p className="text-sm text-[#8E9196]">
                      Target: {opportunity.company}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getOpportunityBadge(opportunity.potential)}
                    {getTimeframeBadge(opportunity.timeframe)}
                  </div>
                </div>
                <p className="text-sm">{opportunity.description}</p>
                
                <div className="flex justify-end mt-3">
                  <Button size="sm" variant="outline">
                    Explore Opportunity
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategicInitiatives;
