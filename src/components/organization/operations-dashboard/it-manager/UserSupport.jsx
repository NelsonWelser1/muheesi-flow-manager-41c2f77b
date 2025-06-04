
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Headphones, Ticket, Clock } from 'lucide-react';

const UserSupport = () => {
  const supportTickets = [
    {
      id: "T-2024-456",
      user: "Sarah Johnson",
      issue: "Email configuration problem",
      priority: "medium",
      status: "in-progress",
      created: "2 hours ago"
    },
    {
      id: "T-2024-457",
      user: "Mike Chen",
      issue: "Software installation request",
      priority: "low",
      status: "pending",
      created: "4 hours ago"
    },
    {
      id: "T-2024-458",
      user: "Emma Wilson",
      issue: "Network connectivity issue",
      priority: "high",
      status: "resolved",
      created: "1 day ago"
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        <h3 className="text-xl font-semibold">User Support</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">23</div>
            <p className="text-xs text-muted-foreground">↓ 3 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">2.3h</div>
            <p className="text-xs text-muted-foreground">Within SLA target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">94%</div>
            <p className="text-xs text-muted-foreground">First contact resolution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">4.8/5</div>
            <p className="text-xs text-muted-foreground">Based on 156 ratings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Recent Support Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {supportTickets.map((ticket, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{ticket.id}</h4>
                  <p className="text-sm text-muted-foreground">{ticket.user}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>
              </div>
              <p className="text-sm mb-2">{ticket.issue}</p>
              <p className="text-xs text-muted-foreground">{ticket.created}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Support Channels Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">68%</p>
              <p className="text-sm text-muted-foreground">Email Support</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">24%</p>
              <p className="text-sm text-muted-foreground">Phone Support</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">8%</p>
              <p className="text-sm text-muted-foreground">Chat Support</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSupport;
