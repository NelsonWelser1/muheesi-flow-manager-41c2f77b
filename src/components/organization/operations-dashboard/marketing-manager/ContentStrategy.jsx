
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Video, Image, Mic, Calendar, Plus, TrendingUp } from 'lucide-react';

const ContentStrategy = () => {
  const contentTypes = [
    {
      type: "Blog Posts",
      icon: FileText,
      published: 24,
      scheduled: 8,
      drafts: 12,
      performance: "+15%"
    },
    {
      type: "Videos",
      icon: Video,
      published: 16,
      scheduled: 4,
      drafts: 7,
      performance: "+28%"
    },
    {
      type: "Infographics",
      icon: Image,
      published: 18,
      scheduled: 6,
      drafts: 9,
      performance: "+12%"
    },
    {
      type: "Podcasts",
      icon: Mic,
      published: 8,
      scheduled: 2,
      drafts: 3,
      performance: "+22%"
    }
  ];

  const contentCalendar = [
    {
      title: "Product Feature Deep Dive",
      type: "Blog Post",
      author: "Marketing Team",
      publishDate: "2024-06-15",
      status: "scheduled"
    },
    {
      title: "Customer Success Story Video",
      type: "Video",
      author: "Video Team",
      publishDate: "2024-06-18",
      status: "in-production"
    },
    {
      title: "Industry Trends Infographic",
      type: "Infographic",
      author: "Design Team",
      publishDate: "2024-06-20",
      status: "draft"
    }
  ];

  const contentPerformance = [
    { metric: "Total Views", value: "2.4M", change: "+18%" },
    { metric: "Engagement Rate", value: "6.8%", change: "+12%" },
    { metric: "Shares", value: "15.2K", change: "+25%" },
    { metric: "Conversion Rate", value: "3.4%", change: "+8%" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'in-production': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h3 className="text-xl font-semibold">Content Strategy</h3>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Content
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contentTypes.map((content, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <content.icon className="h-5 w-5" />
                {content.type}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Published</span>
                <span className="font-medium">{content.published}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Scheduled</span>
                <span className="font-medium text-blue-600">{content.scheduled}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Drafts</span>
                <span className="font-medium text-gray-600">{content.drafts}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm">Performance</span>
                <Badge className="bg-green-500">{content.performance}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Content Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contentCalendar.map((item, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{item.title}</h4>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <div>
                    <p>Type: {item.type}</p>
                  </div>
                  <div>
                    <p>Author: {item.author}</p>
                  </div>
                  <div>
                    <p>Date: {item.publishDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Content Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentPerformance.map((perf, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">{perf.metric}</p>
                  <p className="text-2xl font-bold">{perf.value}</p>
                </div>
                <Badge className="bg-green-500">{perf.change}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Distribution Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">45%</p>
              <p className="text-sm text-muted-foreground">Website/Blog</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">28%</p>
              <p className="text-sm text-muted-foreground">Social Media</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">18%</p>
              <p className="text-sm text-muted-foreground">Email Campaigns</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">9%</p>
              <p className="text-sm text-muted-foreground">Partner Channels</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentStrategy;
