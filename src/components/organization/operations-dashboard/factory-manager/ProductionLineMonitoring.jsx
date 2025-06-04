
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, AlertCircle, CheckCircle, Settings } from 'lucide-react';

const ProductionLineMonitoring = () => {
  const productionLines = [
    {
      id: 1,
      name: "Cheese Production Line A",
      product: "Mozzarella Cheese",
      status: "Running",
      efficiency: 94,
      output: "1,250 kg",
      target: "1,400 kg",
      temperature: "32°C",
      pressure: "2.1 bar",
      lastMaintenance: "2 days ago"
    },
    {
      id: 2,
      name: "Cheese Production Line B",
      product: "Gouda Cheese",
      status: "Running",
      efficiency: 89,
      output: "850 kg",
      target: "1,000 kg",
      temperature: "28°C",
      pressure: "1.9 bar",
      lastMaintenance: "1 week ago"
    },
    {
      id: 3,
      name: "Yogurt Processing Line",
      product: "Greek Yogurt",
      status: "Running",
      efficiency: 96,
      output: "2,100 L",
      target: "2,200 L",
      temperature: "4°C",
      pressure: "1.2 bar",
      lastMaintenance: "3 days ago"
    },
    {
      id: 4,
      name: "Milk Pasteurization Unit",
      product: "Pasteurized Milk",
      status: "Running",
      efficiency: 98,
      output: "8,500 L",
      target: "9,000 L",
      temperature: "72°C",
      pressure: "2.5 bar",
      lastMaintenance: "Yesterday"
    },
    {
      id: 5,
      name: "Coffee Processing Unit",
      product: "Ground Coffee",
      status: "Maintenance",
      efficiency: 0,
      output: "0 kg",
      target: "500 kg",
      temperature: "N/A",
      pressure: "N/A",
      lastMaintenance: "Today"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Running':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Maintenance':
        return <Settings className="h-4 w-4 text-orange-600" />;
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {productionLines.map((line) => (
          <Card key={line.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{line.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{line.product}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(line.status)}
                  <Badge variant={getStatusColor(line.status)}>{line.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Output</p>
                  <p className="font-medium">{line.output}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Target</p>
                  <p className="font-medium">{line.target}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Temperature</p>
                  <p className="font-medium">{line.temperature}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pressure</p>
                  <p className="font-medium">{line.pressure}</p>
                </div>
              </div>
              
              {line.status === 'Running' && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Efficiency</span>
                    <span>{line.efficiency}%</span>
                  </div>
                  <Progress value={line.efficiency} className="h-2" />
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Last maintenance: {line.lastMaintenance}
              </div>
              
              <div className="flex gap-2">
                {line.status === 'Running' ? (
                  <Button size="sm" variant="outline" className="flex-1">
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                ) : (
                  <Button size="sm" className="flex-1">
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Production Line Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col">
              <Play className="h-6 w-6 mb-2" />
              Start All Lines
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Pause className="h-6 w-6 mb-2" />
              Emergency Stop
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              Schedule Maintenance
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <AlertCircle className="h-6 w-6 mb-2" />
              View Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionLineMonitoring;
