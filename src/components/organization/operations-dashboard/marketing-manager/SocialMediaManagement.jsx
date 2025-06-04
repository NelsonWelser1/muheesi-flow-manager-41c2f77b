
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Heart, MessageCircle, TrendingUp, Calendar, Plus } from 'lucide-react';

const SocialMediaManagement = () => {
  const socialPlatforms = [
    {
      platform: "Facebook",
      followers: "45.2K",
      engagement: "4.8%",
      posts: 156,
      reach: "128K",
      growth: "+12%"
    },
    {
      platform: "Instagram",
      followers: "32.1K",
      engagement: "6.2%",
      posts: 189,
      reach: "95K",
      growth: "+18%"
    },
    {
      platform: "Twitter",
      followers: "18.7K",
      engagement: "3.4%",
      posts: 234,
      reach: "67K",
      growth: "+8%"
    },
    {
      platform: "LinkedIn",
      followers: "12.3K",
      engagement: "5.1%",
      posts: 87,
      reach: "34K",
      growth: "+22%"
    }
  ];

  const scheduledPosts = [
    {
      platform: "Instagram",
      content: "New product showcase - Summer Collection",
      scheduledTime: "Today, 2:00 PM",
      status: "scheduled"
    },
    {
      platform: "Facebook",
      content: "Customer success story feature",
      scheduledTime: "Tomorrow, 10:00 AM",
      status: "scheduled"
    },
    {
      platform: "Twitter",
      content: "Industry insight thread",
      scheduledTime: "Tomorrow, 3:00 PM",
      status: "draft"
    }
  ];

  const getEngagementColor = (rate) => {
    const numeric = parseFloat(rate);
    if (numeric >= 5) return "text-green-600";
    if (numeric >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          <h3 className="text-xl font-semibold">Social Media Management</h3>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {socialPlatforms.map((platform, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex justify-between items-center">
                {platform.platform}
                <Badge variant="outline" className="text-xs">
                  {platform.growth}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Followers</span>
                <span className="font-medium">{platform.followers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Engagement</span>
                <span className={`font-medium ${getEngagementColor(platform.engagement)}`}>
                  {platform.engagement}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Posts</span>
                <span className="font-medium">{platform.posts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Reach</span>
                <span className="font-medium">{platform.reach}</span>
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
            {scheduledPosts.map((post, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{post.platform}</Badge>
                  <Badge className={post.status === 'scheduled' ? 'bg-green-500' : 'bg-yellow-500'}>
                    {post.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium mb-1">{post.content}</p>
                <p className="text-xs text-muted-foreground">{post.scheduledTime}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Engagement Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-2xl font-bold">2.4K</span>
                </div>
                <p className="text-sm text-muted-foreground">Avg. Likes/Post</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-2xl font-bold">186</span>
                </div>
                <p className="text-sm text-muted-foreground">Avg. Comments/Post</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Share2 className="h-4 w-4 text-green-500" />
                  <span className="text-2xl font-bold">347</span>
                </div>
                <p className="text-sm text-muted-foreground">Avg. Shares/Post</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-2xl font-bold">5.2%</span>
                </div>
                <p className="text-sm text-muted-foreground">Overall Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialMediaManagement;
