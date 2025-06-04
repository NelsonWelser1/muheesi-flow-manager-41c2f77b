
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Target, Beaker, Rocket, Plus } from 'lucide-react';

const InnovationPipeline = () => {
  const pipelineStages = [
    {
      stage: "Ideation",
      count: 8,
      icon: Lightbulb,
      color: "text-yellow-600",
      projects: [
        { name: "Smart Packaging Solution", priority: "high", progress: 15 },
        { name: "Eco-Friendly Materials", priority: "medium", progress: 30 }
      ]
    },
    {
      stage: "Concept Development",
      count: 5,
      icon: Target,
      color: "text-blue-600",
      projects: [
        { name: "IoT Sensor Integration", priority: "high", progress: 45 },
        { name: "Premium Product Line", priority: "medium", progress: 62 }
      ]
    },
    {
      stage: "Prototyping",
      count: 4,
      icon: Beaker,
      color: "text-purple-600",
      projects: [
        { name: "Mobile App Enhancement", priority: "high", progress: 78 },
        { name: "Automated Quality Control", priority: "low", progress: 34 }
      ]
    },
    {
      stage: "Market Testing",
      count: 3,
      icon: Rocket,
      color: "text-green-600",
      projects: [
        { name: "Customer Portal v2.0", priority: "high", progress: 92 },
        { name: "Supply Chain Analytics", priority: "medium", progress: 67 }
      ]
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-blue-600';
    if (progress >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          <h3 className="text-xl font-semibold">Innovation Pipeline</h3>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Innovation Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pipelineStages.map((stage, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <stage.icon className={`h-5 w-5 ${stage.color}`} />
                {stage.stage}
              </CardTitle>
              <Badge variant="outline">{stage.count} projects</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {stage.projects.map((project, projectIndex) => (
                <div key={projectIndex} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{project.name}</h4>
                    <Badge className={getPriorityColor(project.priority)} size="sm">
                      {project.priority}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className={`text-sm font-medium ${getProgressColor(project.progress)}`}>
                      {project.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">73%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">8.2 months</p>
              <p className="text-sm text-muted-foreground">Avg. Development Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">$145K</p>
              <p className="text-sm text-muted-foreground">Avg. Project Budget</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">20</p>
              <p className="text-sm text-muted-foreground">Active Projects</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InnovationPipeline;
