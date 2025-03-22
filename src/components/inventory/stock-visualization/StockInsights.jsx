
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle, ArrowRight } from 'lucide-react';

const StockInsights = ({ stockData }) => {
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
      insights.push({
        type: 'critical',
        message: `${health.critical} ${health.critical === 1 ? 'item' : 'items'} at critical stock level`,
        action: 'Reorder immediately'
      });
    }
    
    if (health.warning > 1) {
      insights.push({
        type: 'warning',
        message: `${health.warning} items are running low`,
        action: 'Review and reorder'
      });
    }
    
    if (trends.up > trends.down) {
      insights.push({
        type: 'positive',
        message: 'Overall stock levels are increasing',
        action: 'Monitor storage capacity'
      });
    } else if (trends.down > trends.up) {
      insights.push({
        type: 'info',
        message: 'Overall stock levels are decreasing',
        action: 'Check replenishment schedule'
      });
    }
    
    return insights;
  };
  
  const health = getStockHealth();
  const insights = generateInsights();
  
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
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${
                  insight.type === 'critical' ? 'bg-red-50 border-red-100' :
                  insight.type === 'warning' ? 'bg-amber-50 border-amber-100' :
                  insight.type === 'positive' ? 'bg-green-50 border-green-100' :
                  'bg-blue-50 border-blue-100'
                }`}
              >
                <div className="flex items-start">
                  {insight.type === 'critical' && <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 mr-2" />}
                  {insight.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 mr-2" />}
                  {insight.type === 'positive' && <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 mr-2" />}
                  {insight.type === 'info' && <TrendingDown className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />}
                  
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
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockInsights;
