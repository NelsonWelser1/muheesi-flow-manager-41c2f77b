
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Settings, TrendingUp, Zap, Clock } from 'lucide-react';

const ProcessOptimization = () => {
  const optimizationProjects = [
    {
      title: "Cheese Production Line Automation",
      description: "Implement automated temperature control and timing systems",
      progress: 75,
      status: "In Progress",
      expectedSavings: "UGX 2.5M/month",
      timeframe: "2 weeks remaining"
    },
    {
      title: "Inventory Management System Upgrade",
      description: "Real-time tracking and automated reordering system",
      progress: 45,
      status: "In Progress",
      expectedSavings: "UGX 1.8M/month",
      timeframe: "4 weeks remaining"
    },
    {
      title: "Energy Efficiency Optimization",
      description: "LED lighting and equipment scheduling optimization",
      progress: 90,
      status: "Near Completion",
      expectedSavings: "UGX 800K/month",
      timeframe: "3 days remaining"
    },
    {
      title: "Waste Reduction Program",
      description: "Implement circular economy principles in production",
      progress: 20,
      status: "Planning",
      expectedSavings: "UGX 1.2M/month",
      timeframe: "8 weeks remaining"
    }
  ];

  const efficiencyMetrics = [
    {
      metric: "Overall Equipment Effectiveness",
      current: 84.5,
      target: 90.0,
      improvement: "+5.2%"
    },
    {
      metric: "Labor Productivity",
      current: 92.8,
      target: 95.0,
      improvement: "+3.1%"
    },
    {
      metric: "Energy Efficiency",
      current: 87.3,
      target: 90.0,
      improvement: "+8.7%"
    },
    {
      metric: "Waste Reduction",
      current: 76.2,
      target: 85.0,
      improvement: "+12.4%"
    }
  ];

  const processImprovements = [
    {
      process: "Milk Pasteurization",
      improvement: "Reduced processing time by 15 minutes",
      impact: "6% increase in daily throughput",
      implementation: "2024-02-01"
    },
    {
      process: "Cheese Aging",
      improvement: "Optimized humidity control system",
      impact: "2% improvement in product quality",
      implementation: "2024-01-15"
    },
    {
      process: "Packaging Line",
      improvement: "Automated quality inspection",
      impact: "50% reduction in packaging defects",
      implementation: "2024-01-28"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'default';
      case 'Near Completion':
        return 'secondary';
      case 'Planning':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {efficiencyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.current}%</div>
              <p className="text-xs text-muted-foreground">
                Target: {metric.target}% • {metric.improvement}
              </p>
              <Progress 
                value={(metric.current / metric.target) * 100} 
                className="mt-2 h-2" 
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Active Optimization Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {optimizationProjects.map((project, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Expected Savings</p>
                    <p className="font-medium text-green-600">{project.expectedSavings}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Timeline</p>
                    <p className="font-medium">{project.timeframe}</p>
                  </div>
                </div>
              </div>
            ))}
            <Button className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Propose New Optimization
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recent Process Improvements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {processImprovements.map((improvement, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{improvement.process}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Improvement</p>
                    <p>{improvement.improvement}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Impact</p>
                    <p className="text-green-600 font-medium">{improvement.impact}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Implementation Date</p>
                    <p>{improvement.implementation}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Clock className="h-4 w-4 mr-2" />
                Performance Analysis
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                View All Improvements
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProcessOptimization;
