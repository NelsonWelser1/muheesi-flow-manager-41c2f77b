
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown } from 'lucide-react';

const StockCards = ({ data, onViewDetails }) => {
  const getStockLevelColor = (current, max) => {
    const ratio = current / max;
    if (ratio < 0.3) return 'bg-red-200';
    if (ratio < 0.6) return 'bg-amber-200';
    return 'bg-green-200';
  };

  const getStatusBadge = (health) => {
    switch (health) {
      case 'good':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map(item => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.type} - Grade {item.grade}
                </p>
              </div>
              {getStatusBadge(item.health)}
            </div>
            
            <div className="mt-2">
              <div className="flex justify-between items-center text-sm">
                <span>Stock Level:</span>
                <span className="font-medium flex items-center">
                  {item.current_stock} / {item.max_capacity}
                  {item.trend === 'up' ? 
                    <TrendingUp className="h-3 w-3 ml-1 text-green-600" /> : 
                    item.trend === 'down' ? 
                    <TrendingDown className="h-3 w-3 ml-1 text-red-600" /> : 
                    null
                  }
                </span>
              </div>
              <Progress 
                value={(item.current_stock / item.max_capacity) * 100} 
                className={`h-2 mt-1 ${getStockLevelColor(item.current_stock, item.max_capacity)}`}
              />
            </div>
            
            <div className="mt-3 text-sm">
              <p>Location: {item.location}</p>
              <p>Last Updated: {new Date(item.updated_at).toLocaleDateString()}</p>
            </div>
            
            <div className="mt-3 flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewDetails(item)}
                className="text-xs"
              >
                View Details
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                More Actions
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StockCards;
