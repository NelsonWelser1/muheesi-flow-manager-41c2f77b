
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const StockInsights = ({ stockData }) => {
  // Track which insights are expanded
  const [expandedInsights, setExpandedInsights] = useState({});

  // Calculate insights based on the stock data
  const getTotalStock = () => {
    return stockData.reduce((acc, item) => acc + item.current_stock, 0);
  };
  
  const getStockHealth = () => {
    const healthy = stockData.filter(i => i.health === 'good').length;
    const warning = stockData.filter(i => i.health === 'warning').length;
    const critical = stockData.filter(i => i.health === 'critical').length;
    
    return { healthy, warning, critical };
  };
  
  const getTrends = () => {
    const up = stockData.filter(i => i.trend === 'up').length;
    const down = stockData.filter(i => i.trend === 'down').length;
    const stable = stockData.filter(i => i.trend === 'stable').length;
    
    return { up, down, stable };
  };
  
  const generateInsights = () => {
    const health = getStockHealth();
    const trends = getTrends();
    
    const insights = [];
    
    if (health.critical > 0) {
      const criticalItems = stockData.filter(i => i.health === 'critical');
      insights.push({
        id: 'critical',
        type: 'critical',
        message: `${health.critical} ${health.critical === 1 ? 'item' : 'items'} at critical stock level`,
        action: 'Reorder immediately',
        details: {
          title: 'Critical Stock Items',
          description: 'These items need immediate attention as they are nearly out of stock:',
          items: criticalItems.map(item => ({
            name: item.name,
            location: item.location,
            current: item.current_stock,
            max: item.max_capacity,
            percent: Math.round((item.current_stock / item.max_capacity) * 100)
          }))
        }
      });
    }
    
    if (health.warning > 1) {
      const warningItems = stockData.filter(i => i.health === 'warning');
      insights.push({
        id: 'warning',
        type: 'warning',
        message: `${health.warning} items are running low`,
        action: 'Review and reorder',
        details: {
          title: 'Low Stock Items',
          description: 'These items are running low and should be reordered soon:',
          items: warningItems.map(item => ({
            name: item.name,
            location: item.location,
            current: item.current_stock,
            max: item.max_capacity,
            percent: Math.round((item.current_stock / item.max_capacity) * 100)
          }))
        }
      });
    }
    
    if (trends.up > trends.down) {
      const increasingItems = stockData.filter(i => i.trend === 'up');
      insights.push({
        id: 'increasing',
        type: 'positive',
        message: 'Overall stock levels are increasing',
        action: 'Monitor storage capacity',
        details: {
          title: 'Increasing Stock Levels',
          description: 'These items show an increasing trend in stock levels:',
          items: increasingItems.map(item => ({
            name: item.name,
            location: item.location,
            current: item.current_stock,
            max: item.max_capacity,
            percent: Math.round((item.current_stock / item.max_capacity) * 100)
          }))
        }
      });
    } else if (trends.down > trends.up) {
      const decreasingItems = stockData.filter(i => i.trend === 'down');
      insights.push({
        id: 'decreasing',
        type: 'info',
        message: 'Overall stock levels are decreasing',
        action: 'Check replenishment schedule',
        details: {
          title: 'Decreasing Stock Levels',
          description: 'These items show a decreasing trend in stock levels:',
          items: decreasingItems.map(item => ({
            name: item.name,
            location: item.location,
            current: item.current_stock,
            max: item.max_capacity,
            percent: Math.round((item.current_stock / item.max_capacity) * 100)
          }))
        }
      });
    }
    
    return insights;
  };
  
  const health = getStockHealth();
  const insights = generateInsights();
  
  // Toggle expanded state for an insight
  const toggleInsight = (insightId) => {
    setExpandedInsights(prev => ({
      ...prev,
      [insightId]: !prev[insightId]
    }));
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Stock Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50 p-2 rounded-lg text-center">
              <div className="text-lg font-medium text-green-700">
                {health.healthy}
              </div>
              <div className="text-xs text-green-600">Healthy</div>
            </div>
            <div className="bg-amber-50 p-2 rounded-lg text-center">
              <div className="text-lg font-medium text-amber-700">
                {health.warning}
              </div>
              <div className="text-xs text-amber-600">Low</div>
            </div>
            <div className="bg-red-50 p-2 rounded-lg text-center">
              <div className="text-lg font-medium text-red-700">
                {health.critical}
              </div>
              <div className="text-xs text-red-600">Critical</div>
            </div>
          </div>
          
          <div className="space-y-3">
            {insights.map((insight) => (
              <Collapsible 
                key={insight.id}
                open={!!expandedInsights[insight.id]}
                onOpenChange={() => toggleInsight(insight.id)}
                className={`rounded-lg border ${
                  insight.type === 'critical' ? 'bg-red-50 border-red-100' :
                  insight.type === 'warning' ? 'bg-amber-50 border-amber-100' :
                  insight.type === 'positive' ? 'bg-green-50 border-green-100' :
                  'bg-blue-50 border-blue-100'
                }`}
              >
                <CollapsibleTrigger asChild>
                  <div className="p-3 cursor-pointer hover:opacity-90 transition-opacity">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        {insight.type === 'critical' && <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />}
                        {insight.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />}
                        {insight.type === 'positive' && <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />}
                        {insight.type === 'info' && <TrendingDown className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />}
                        
                        <div>
                          <p className={`text-sm font-medium ${
                            insight.type === 'critical' ? 'text-red-700' :
                            insight.type === 'warning' ? 'text-amber-700' :
                            insight.type === 'positive' ? 'text-green-700' :
                            'text-blue-700'
                          }`}>
                            {insight.message}
                          </p>
                          <p className={`text-xs mt-0.5 flex items-center ${
                            insight.type === 'critical' ? 'text-red-600' :
                            insight.type === 'warning' ? 'text-amber-600' :
                            insight.type === 'positive' ? 'text-green-600' :
                            'text-blue-600'
                          }`}>
                            {insight.action}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </p>
                        </div>
                      </div>
                      
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                        expandedInsights[insight.id] ? 'transform rotate-180' : ''
                      } ${
                        insight.type === 'critical' ? 'text-red-600' :
                        insight.type === 'warning' ? 'text-amber-600' :
                        insight.type === 'positive' ? 'text-green-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className={`px-3 pb-3 pt-1 border-t ${
                    insight.type === 'critical' ? 'border-red-100' :
                    insight.type === 'warning' ? 'border-amber-100' :
                    insight.type === 'positive' ? 'border-green-100' :
                    'border-blue-100'
                  }`}>
                    <h4 className={`text-sm font-medium mb-2 ${
                      insight.type === 'critical' ? 'text-red-700' :
                      insight.type === 'warning' ? 'text-amber-700' :
                      insight.type === 'positive' ? 'text-green-700' :
                      'text-blue-700'
                    }`}>
                      {insight.details.title}
                    </h4>
                    <p className="text-xs mb-3 text-gray-600">
                      {insight.details.description}
                    </p>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {insight.details.items.map((item, idx) => (
                        <div key={idx} className="text-xs bg-white rounded p-2 border border-gray-100 shadow-sm">
                          <div className="font-medium">{item.name}</div>
                          <div className="flex justify-between mt-1">
                            <span>Location: {item.location}</span>
                            <span>{item.current} of {item.max} ({item.percent}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className={`h-1.5 rounded-full ${
                                item.percent < 30 ? 'bg-red-500' :
                                item.percent < 60 ? 'bg-amber-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${item.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {insight.type === 'critical' && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="mt-3 w-full text-xs"
                      >
                        Create Reorder Request
                      </Button>
                    )}
                    
                    {insight.type === 'warning' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 w-full text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                      >
                        Review Stock Levels
                      </Button>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
            
            {insights.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                No insights available for the current stock data.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockInsights;
