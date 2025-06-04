
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, DollarSign, Clock } from 'lucide-react';

const ResourcePlanning = () => {
  const teamAllocation = [
    {
      team: "Research & Innovation",
      size: 8,
      utilizationRate: "92%",
      projects: 3,
      allocation: [
        { project: "Smart Packaging", allocation: "50%" },
        { project: "IoT Sensors", allocation: "30%" },
        { project: "Core R&D", allocation: "20%" }
      ]
    },
    {
      team: "Product Design",
      size: 12,
      utilizationRate: "87%",
      projects: 4,
      allocation: [
        { project: "Mobile App Enhancement", allocation: "35%" },
        { project: "Premium Product Line", allocation: "25%" },
        { project: "UX Research", allocation: "20%" },
        { project: "Documentation", allocation: "20%" }
      ]
    },
    {
      team: "Engineering",
      size: 15,
      utilizationRate: "94%",
      projects: 3,
      allocation: [
        { project: "Automated Quality Control", allocation: "40%" },
        { project: "System Infrastructure", allocation: "35%" },
        { project: "Technical Maintenance", allocation: "25%" }
      ]
    }
  ];

  const budgetAllocation = [
    { category: "R&D", allocation: "$850K", percentage: "35%" },
    { category: "Design & Engineering", allocation: "$750K", percentage: "31%" },
    { category: "Testing & QA", allocation: "$420K", percentage: "18%" },
    { category: "Market Research", allocation: "$180K", percentage: "8%" },
    { category: "Documentation", allocation: "$120K", percentage: "5%" },
    { category: "Contingency", allocation: "$80K", percentage: "3%" }
  ];

  const getUtilizationColor = (rate) => {
    const numeric = parseInt(rate);
    if (numeric > 95) return 'text-red-600';
    if (numeric > 85) return 'text-green-600';
    if (numeric > 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Resource Planning</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">35</div>
            <p className="text-xs text-muted-foreground">Product development staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">7</div>
            <p className="text-xs text-muted-foreground">Across all teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">91%</div>
            <p className="text-xs text-muted-foreground">Average across teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">$2.4M</div>
            <p className="text-xs text-muted-foreground">Annual R&D budget</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamAllocation.map((team, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium">{team.team}</h4>
                      <p className="text-sm text-muted-foreground">
                        {team.size} members · {team.projects} projects
                      </p>
                    </div>
                    <Badge className={
                      getUtilizationColor(team.utilizationRate) === "text-green-600" 
                        ? "bg-green-500" 
                        : "bg-yellow-500"
                    }>
                      {team.utilizationRate} utilized
                    </Badge>
                  </div>
                  <div className="space-y-2 mt-3">
                    {team.allocation.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between text-sm">
                        <span>{item.project}</span>
                        <span className="font-medium">{item.allocation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budgetAllocation.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-sm text-muted-foreground">{item.percentage} of total</p>
                  </div>
                  <p className="text-xl font-bold">{item.allocation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Resource Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">+5</span>
              </div>
              <p className="text-sm text-muted-foreground">Planned New Hires</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">$350K</span>
              </div>
              <p className="text-sm text-muted-foreground">Additional Budget</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="text-2xl font-bold">Q3 2024</span>
              </div>
              <p className="text-sm text-muted-foreground">Major Project Timeline</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcePlanning;
