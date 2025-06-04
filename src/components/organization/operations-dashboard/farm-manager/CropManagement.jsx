
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sprout, Calendar, Droplets, Plus } from 'lucide-react';

const CropManagement = () => {
  const crops = [
    {
      id: 1,
      name: 'Coffee - Arabica',
      area: '5.2 acres',
      stage: 'Flowering',
      progress: 65,
      nextAction: 'Pruning in 5 days',
      health: 'Excellent'
    },
    {
      id: 2,
      name: 'Maize',
      area: '3.8 acres',
      stage: 'Vegetative',
      progress: 40,
      nextAction: 'Fertilization needed',
      health: 'Good'
    },
    {
      id: 3,
      name: 'Beans',
      area: '2.1 acres',
      stage: 'Maturity',
      progress: 90,
      nextAction: 'Harvest in 2 weeks',
      health: 'Good'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Crop Management</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Crop
        </Button>
      </div>

      <div className="grid gap-4">
        {crops.map((crop) => (
          <Card key={crop.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Sprout className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{crop.name}</h4>
                    <p className="text-sm text-muted-foreground">Area: {crop.area}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    crop.health === 'Excellent' ? 'bg-green-100 text-green-800' :
                    crop.health === 'Good' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {crop.health}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Growth Stage: {crop.stage}</span>
                  <span className="text-sm text-muted-foreground">{crop.progress}%</span>
                </div>
                <Progress value={crop.progress} className="h-2" />
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {crop.nextAction}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Droplets className="h-4 w-4 mr-1" />
                  Irrigation
                </Button>
                <Button variant="outline" size="sm">
                  Schedule Task
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CropManagement;
