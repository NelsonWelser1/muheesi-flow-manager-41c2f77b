
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Award } from 'lucide-react';

const PerformanceMetrics = () => {
  const performanceData = [
    {
      company: "Grand Berna Dairies",
      kpis: {
        revenue: { actual: 8.5, target: 8.0, achievement: 106.3 },
        profit: { actual: 2.1, target: 2.0, achievement: 105.0 },
        efficiency: { actual: 94, target: 90, achievement: 104.4 },
        quality: { actual: 98, target: 95, achievement: 103.2 }
      }
    },
    {
      company: "KAJON Coffee Limited",
      kpis: {
        revenue: { actual: 3.2, target: 3.0, achievement: 106.7 },
        profit: { actual: 0.8, target: 0.75, achievement: 106.7 },
        efficiency: { actual: 89, target: 85, achievement: 104.7 },
        quality: { actual: 95, target: 92, achievement: 103.3 }
      }
    },
    {
      company: "Kyalima Farmers Limited",
      kpis: {
        revenue: { actual: 2.8, target: 2.9, achievement: 96.6 },
        profit: { actual: 0.6, target: 0.65, achievement: 92.3 },
        efficiency: { actual: 85, target: 82, achievement: 103.7 },
        quality: { actual: 92, target: 90, achievement: 102.2 }
      }
    }
  ];

  const getAchievementColor = (achievement) => {
    if (achievement >= 100) return 'text-success';
    if (achievement >= 95) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {performanceData.map((company, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              {company.company} - Performance Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Revenue (M)</span>
                  <span className={`text-sm font-bold ${getAchievementColor(company.kpis.revenue.achievement)}`}>
                    {company.kpis.revenue.achievement.toFixed(1)}%
                  </span>
                </div>
                <Progress value={company.kpis.revenue.achievement} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target: ${company.kpis.revenue.target}M</span>
                  <span>Actual: ${company.kpis.revenue.actual}M</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Profit (M)</span>
                  <span className={`text-sm font-bold ${getAchievementColor(company.kpis.profit.achievement)}`}>
                    {company.kpis.profit.achievement.toFixed(1)}%
                  </span>
                </div>
                <Progress value={company.kpis.profit.achievement} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target: ${company.kpis.profit.target}M</span>
                  <span>Actual: ${company.kpis.profit.actual}M</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Efficiency (%)</span>
                  <span className={`text-sm font-bold ${getAchievementColor(company.kpis.efficiency.achievement)}`}>
                    {company.kpis.efficiency.achievement.toFixed(1)}%
                  </span>
                </div>
                <Progress value={company.kpis.efficiency.achievement} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target: {company.kpis.efficiency.target}%</span>
                  <span>Actual: {company.kpis.efficiency.actual}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quality (%)</span>
                  <span className={`text-sm font-bold ${getAchievementColor(company.kpis.quality.achievement)}`}>
                    {company.kpis.quality.achievement.toFixed(1)}%
                  </span>
                </div>
                <Progress value={company.kpis.quality.achievement} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target: {company.kpis.quality.target}%</span>
                  <span>Actual: {company.kpis.quality.actual}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PerformanceMetrics;
