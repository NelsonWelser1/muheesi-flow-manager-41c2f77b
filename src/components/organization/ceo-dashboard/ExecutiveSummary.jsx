
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

const ExecutiveSummary = ({ selectedCompany }) => {
  const summaryData = {
    'all': {
      kpis: [
        { metric: 'Total Revenue', value: '$2.4M', target: '$2.2M', progress: 109, trend: 'up' },
        { metric: 'Net Profit Margin', value: '18.5%', target: '15%', progress: 123, trend: 'up' },
        { metric: 'Employee Satisfaction', value: '4.2/5', target: '4.0/5', progress: 105, trend: 'up' },
        { metric: 'Market Share', value: '23%', target: '25%', progress: 92, trend: 'down' }
      ],
      priorities: [
        { title: 'Expand Coffee Export Operations', status: 'on-track', completion: 75 },
        { title: 'Dairy Production Optimization', status: 'at-risk', completion: 45 },
        { title: 'Digital Transformation Initiative', status: 'completed', completion: 100 },
        { title: 'Sustainability Certification', status: 'on-track', completion: 60 }
      ],
      insights: [
        {
          type: 'positive',
          title: 'Coffee Export Revenue Up 35%',
          description: 'KAJON Coffee Limited exceeded Q3 targets with strong international demand'
        },
        {
          type: 'warning',
          title: 'Dairy Production Delays',
          description: 'Equipment maintenance at Grand Berna causing 15% production decrease'
        },
        {
          type: 'neutral',
          title: 'New Market Opportunities',
          description: 'Research indicates potential for expansion into East African markets'
        }
      ]
    }
  };

  const data = summaryData[selectedCompany] || summaryData['all'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on-track': return 'bg-blue-500';
      case 'at-risk': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return <TrendingUp className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* KPI Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.kpis.map((kpi, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{kpi.metric}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{kpi.value}</span>
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={kpi.progress} className="flex-1" />
                <span className="text-sm text-muted-foreground">
                  Target: {kpi.target}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strategic Priorities */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Priorities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.priorities.map((priority, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{priority.title}</span>
                <Badge variant="outline" className={getStatusColor(priority.status)}>
                  {priority.status}
                </Badge>
              </div>
              <Progress value={priority.completion} className="w-full" />
              <span className="text-sm text-muted-foreground">
                {priority.completion}% Complete
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Executive Insights */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Executive Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <h4 className="font-semibold">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummary;
