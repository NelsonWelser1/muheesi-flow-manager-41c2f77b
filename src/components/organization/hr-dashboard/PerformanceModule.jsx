
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Star, Calendar, TrendingUp } from 'lucide-react';

const PerformanceModule = () => {
  const performanceOverview = {
    totalReviews: 156,
    completedReviews: 132,
    pendingReviews: 24,
    averageRating: 4.2
  };

  const upcomingReviews = [
    {
      employee: "John Doe",
      position: "Factory Manager",
      dueDate: "2024-02-15",
      lastReview: "2023-08-15",
      status: "Scheduled"
    },
    {
      employee: "Jane Smith",
      position: "Quality Control Officer",
      dueDate: "2024-02-18",
      lastReview: "2023-08-18",
      status: "Pending"
    },
    {
      employee: "Michael Johnson",
      position: "Farm Supervisor",
      dueDate: "2024-02-20",
      lastReview: "2023-08-20",
      status: "Overdue"
    }
  ];

  const performanceMetrics = [
    {
      metric: "Productivity",
      average: 4.3,
      trend: "+5%"
    },
    {
      metric: "Quality of Work",
      average: 4.1,
      trend: "+2%"
    },
    {
      metric: "Teamwork",
      average: 4.4,
      trend: "+8%"
    },
    {
      metric: "Initiative",
      average: 3.9,
      trend: "+3%"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceOverview.totalReviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceOverview.completedReviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceOverview.pendingReviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              {performanceOverview.averageRating}
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingReviews.map((review, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{review.employee}</h3>
                    <p className="text-sm text-muted-foreground">{review.position}</p>
                  </div>
                  <Badge variant={
                    review.status === 'Overdue' ? 'destructive' : 
                    review.status === 'Scheduled' ? 'default' : 'secondary'
                  }>
                    {review.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Due: {review.dueDate}</p>
                  <p>Last Review: {review.lastReview}</p>
                </div>
                <Button size="sm" className="w-full mt-3">
                  Start Review
                </Button>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              Schedule New Review
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{metric.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{metric.average}/5</span>
                    <Badge variant="outline" className="text-green-600">
                      {metric.trend}
                    </Badge>
                  </div>
                </div>
                <Progress value={(metric.average / 5) * 100} className="h-2" />
              </div>
            ))}
            <Button className="w-full mt-4">
              <FileText className="h-4 w-4 mr-2" />
              Generate Performance Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceModule;
