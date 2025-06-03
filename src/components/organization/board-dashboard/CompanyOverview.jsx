
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Activity
} from 'lucide-react';

const CompanyOverview = () => {
  const companies = [
    {
      name: "Grand Berna Dairies",
      sector: "Dairy & Livestock",
      revenue: "$8.5M",
      employees: 347,
      performance: 87,
      status: "Excellent",
      statusColor: "bg-green-500",
      growth: "+12.3%",
      keyMetrics: {
        production: "2,450 tons",
        efficiency: "94%",
        quality: "98%"
      }
    },
    {
      name: "KAJON Coffee Limited",
      sector: "Coffee Production",
      revenue: "$3.2M",
      employees: 156,
      performance: 82,
      status: "Good",
      statusColor: "bg-blue-500",
      growth: "+8.7%",
      keyMetrics: {
        production: "1,850 tons",
        efficiency: "89%",
        quality: "95%"
      }
    },
    {
      name: "Kyalima Farmers Limited",
      sector: "Agriculture",
      revenue: "$2.8M",
      employees: 234,
      performance: 79,
      status: "Good",
      statusColor: "bg-blue-500",
      growth: "+5.2%",
      keyMetrics: {
        production: "3,200 tons",
        efficiency: "85%",
        quality: "92%"
      }
    },
    {
      name: "Fresheco Farming Limited",
      sector: "Sustainable Agriculture",
      revenue: "$650K",
      employees: 78,
      performance: 75,
      status: "Developing",
      statusColor: "bg-yellow-500",
      growth: "+15.1%",
      keyMetrics: {
        production: "450 tons",
        efficiency: "81%",
        quality: "88%"
      }
    }
  ];

  const aggregateData = {
    totalRevenue: companies.reduce((sum, company) => {
      const revenue = parseFloat(company.revenue.replace(/[$M,K]/g, ''));
      return sum + (company.revenue.includes('M') ? revenue : revenue / 1000);
    }, 0),
    totalEmployees: companies.reduce((sum, company) => sum + company.employees, 0),
    avgPerformance: companies.reduce((sum, company) => sum + company.performance, 0) / companies.length
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${aggregateData.totalRevenue.toFixed(1)}M</p>
            <p className="text-xs text-muted-foreground">Across all companies</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Workforce
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{aggregateData.totalEmployees.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Avg Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{aggregateData.avgPerformance.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Portfolio average</p>
          </CardContent>
        </Card>
      </div>

      {/* Company Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {companies.map((company, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                </div>
                <Badge className={company.statusColor}>
                  {company.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{company.sector}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Annual Revenue</p>
                  <p className="text-xl font-bold">{company.revenue}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {company.growth}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employees</p>
                  <p className="text-xl font-bold">{company.employees}</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-muted-foreground">Overall Performance</p>
                  <p className="text-sm font-medium">{company.performance}%</p>
                </div>
                <Progress value={company.performance} className="h-2" />
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Production</p>
                  <p className="text-sm font-medium">{company.keyMetrics.production}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Efficiency</p>
                  <p className="text-sm font-medium">{company.keyMetrics.efficiency}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Quality</p>
                  <p className="text-sm font-medium">{company.keyMetrics.quality}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompanyOverview;
