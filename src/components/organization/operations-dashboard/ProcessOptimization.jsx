
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Settings, TrendingUp, Clock, Target } from 'lucide-react';

const ProcessOptimization = () => {
  const optimizationProjects = [
    {
      name: "Cheese Production Line Efficiency",
      progress: 75,
      target: "95% efficiency",
      current: "92% efficiency",
      timeRemaining: "2 weeks"
    },
    {
      name: "Inventory Management System",
      progress: 60,
      target: "Real-time tracking",
      current: "Daily updates",
      timeRemaining: "1 month"
    },
    {
      name: "Quality Control Automation",
      progress: 90,
      target: "100% automated testing",
      current: "85% automated",
      timeRemaining: "1 week"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Process Optimization Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {optimizationProjects.map((project, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold">{project.name}</h3>
                <span className="text-sm text-muted-foreground">{project.timeRemaining}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Current</p>
                  <p className="font-medium">{project.current}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target</p>
                  <p className="font-medium">{project.target}</p>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="h-20 flex-col">
          <TrendingUp className="h-6 w-6 mb-2" />
          Analyze Performance
        </Button>
        <Button variant="outline" className="h-20 flex-col">
          <Target className="h-6 w-6 mb-2" />
          Set New Targets
        </Button>
      </div>
    </div>
  );
};

export default ProcessOptimization;
