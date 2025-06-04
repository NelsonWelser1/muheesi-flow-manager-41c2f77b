
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Factory, Play, Pause, AlertCircle, CheckCircle } from 'lucide-react';

const ProductionOverview = () => {
  const productionLines = [
    {
      name: "Cheese Production Line A",
      status: "Running",
      efficiency: 96,
      output: "2,450 kg",
      target: "2,500 kg",
      shift: "Morning"
    },
    {
      name: "Yogurt Processing Line",
      status: "Running",
      efficiency: 92,
      output: "1,890 L",
      target: "2,000 L",
      shift: "Morning"
    },
    {
      name: "Coffee Processing Unit",
      status: "Maintenance",
      efficiency: 0,
      output: "0 kg",
      target: "500 kg",
      shift: "Stopped"
    },
    {
      name: "Milk Pasteurization",
      status: "Running",
      efficiency: 98,
      output: "8,750 L",
      target: "9,000 L",
      shift: "Morning"
    }
  ];

  const dailyTargets = [
    {
      product: "Mozzarella Cheese",
      produced: 1250,
      target: 1500,
      unit: "kg"
    },
    {
      product: "Gouda Cheese",
      produced: 850,
      target: 1000,
      unit: "kg"
    },
    {
      product: "Yogurt",
      produced: 1890,
      target: 2000,
      unit: "L"
    },
    {
      product: "Coffee (Processed)",
      produced: 0,
      target: 500,
      unit: "kg"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Running':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Maintenance':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Running':
        return 'default';
      case 'Maintenance':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Production Lines Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {productionLines.map((line, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{line.name}</h3>
                  <p className="text-sm text-muted-foreground">Shift: {line.shift}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(line.status)}
                  <Badge variant={getStatusColor(line.status)}>{line.status}</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Output</p>
                  <p className="font-medium">{line.output}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target</p>
                  <p className="font-medium">{line.target}</p>
                </div>
              </div>
              
              {line.status === 'Running' && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Efficiency</span>
                    <span>{line.efficiency}%</span>
                  </div>
                  <Progress value={line.efficiency} className="h-2" />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Daily Production Targets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dailyTargets.map((target, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">{target.product}</h3>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{target.produced}/{target.target} {target.unit}</span>
              </div>
              <Progress 
                value={(target.produced / target.target) * 100} 
                className="h-2 mb-2" 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{((target.produced / target.target) * 100).toFixed(1)}% Complete</span>
                <span>{target.target - target.produced} {target.unit} remaining</span>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <Button size="sm" className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Production
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Pause className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionOverview;
