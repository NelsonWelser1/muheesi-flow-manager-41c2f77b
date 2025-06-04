
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

const InventoryOverview = () => {
  const inventoryCategories = [
    {
      category: "Raw Materials",
      items: [
        { name: "Fresh Milk", current: 8500, minimum: 5000, maximum: 12000, unit: "L" },
        { name: "Coffee Beans", current: 450, minimum: 500, maximum: 2000, unit: "kg" },
        { name: "Rennet Enzyme", current: 15, minimum: 10, maximum: 50, unit: "kg" },
        { name: "Salt", current: 85, minimum: 20, maximum: 100, unit: "kg" }
      ]
    },
    {
      category: "Finished Products",
      items: [
        { name: "Mozzarella Cheese", current: 250, minimum: 100, maximum: 500, unit: "kg" },
        { name: "Gouda Cheese", current: 180, minimum: 150, maximum: 400, unit: "kg" },
        { name: "Yogurt", current: 420, minimum: 200, maximum: 800, unit: "L" },
        { name: "Processed Coffee", current: 75, minimum: 50, maximum: 200, unit: "kg" }
      ]
    },
    {
      category: "Packaging Materials",
      items: [
        { name: "Cheese Packaging", current: 1200, minimum: 500, maximum: 2000, unit: "units" },
        { name: "Yogurt Containers", current: 850, minimum: 300, maximum: 1500, unit: "units" },
        { name: "Coffee Bags", current: 180, minimum: 200, maximum: 1000, unit: "units" },
        { name: "Labels", current: 2500, minimum: 1000, maximum: 5000, unit: "units" }
      ]
    }
  ];

  const getStockStatus = (current, minimum, maximum) => {
    if (current < minimum) return { status: 'Low', color: 'destructive', icon: TrendingDown };
    if (current > maximum * 0.9) return { status: 'High', color: 'secondary', icon: TrendingUp };
    return { status: 'Normal', color: 'default', icon: Package };
  };

  const getStockPercentage = (current, minimum, maximum) => {
    return ((current - minimum) / (maximum - minimum)) * 100;
  };

  const lowStockItems = inventoryCategories
    .flatMap(category => category.items)
    .filter(item => item.current < item.minimum);

  return (
    <div className="space-y-6">
      {lowStockItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alerts ({lowStockItems.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white rounded border">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Current: {item.current} {item.unit} (Min: {item.minimum} {item.unit})
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Reorder
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {inventoryCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.items.map((item, index) => {
                const stockStatus = getStockStatus(item.current, item.minimum, item.maximum);
                const stockPercentage = getStockPercentage(item.current, item.minimum, item.maximum);
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{item.name}</span>
                      <Badge variant={stockStatus.color} className="flex items-center gap-1">
                        <stockStatus.icon className="h-3 w-3" />
                        {stockStatus.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.current} {item.unit}</span>
                      <span>Max: {item.maximum} {item.unit}</span>
                    </div>
                    <Progress 
                      value={Math.max(0, Math.min(100, stockPercentage))} 
                      className="h-2"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Button className="flex-1">
          <Package className="h-4 w-4 mr-2" />
          Generate Reorder Report
        </Button>
        <Button variant="outline" className="flex-1">
          <TrendingUp className="h-4 w-4 mr-2" />
          Inventory Forecast
        </Button>
      </div>
    </div>
  );
};

export default InventoryOverview;
