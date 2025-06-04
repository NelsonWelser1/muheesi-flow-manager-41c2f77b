
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, Users, Target } from 'lucide-react';

const ProjectManagement = () => {
  const projects = [
    {
      name: "Cloud Migration Phase 2",
      progress: 78,
      status: "on-track",
      deadline: "2024-08-15",
      team: 8,
      budget: "$125,000"
    },
    {
      name: "Security Infrastructure Upgrade",
      progress: 45,
      status: "delayed",
      deadline: "2024-07-30",
      team: 5,
      budget: "$85,000"
    },
    {
      name: "Employee Device Refresh",
      progress: 92,
      status: "ahead",
      deadline: "2024-06-30",
      team: 3,
      budget: "$45,000"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'bg-blue-500';
      case 'ahead': return 'bg-green-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'text-green-600';
    if (progress >= 70) return 'text-blue-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Briefcase className="h-5 w-5" />
        <h3 className="text-xl font-semibold">IT Project Management</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-xs text-muted-foreground">3 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">On Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">75%</div>
            <p className="text-xs text-muted-foreground">9 of 12 projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">$2.4M</div>
            <p className="text-xs text-muted-foreground">68% allocated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">34</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className={`text-2xl font-bold ${getProgressColor(project.progress)}`}>
                    {project.progress}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium">{project.deadline}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Team Size</p>
                  <p className="font-medium">{project.team} members</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">{project.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{project.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Project Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">92%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">2.3 weeks</p>
              <p className="text-sm text-muted-foreground">Avg Delivery Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">$1.8M</p>
              <p className="text-sm text-muted-foreground">Budget Utilized</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">96%</p>
              <p className="text-sm text-muted-foreground">Stakeholder Satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectManagement;
