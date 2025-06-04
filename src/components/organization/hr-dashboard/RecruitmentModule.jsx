
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Calendar, MessageSquare, CheckCircle } from 'lucide-react';

const RecruitmentModule = () => {
  const openPositions = [
    {
      title: "Cheese Production Specialist",
      department: "Production",
      company: "Grand Berna Dairies",
      applicants: 12,
      status: "Active",
      posted: "2024-01-10"
    },
    {
      title: "Coffee Quality Inspector",
      department: "Quality Control",
      company: "KAJON Coffee",
      applicants: 8,
      status: "Interviewing",
      posted: "2024-01-15"
    },
    {
      title: "Farm Equipment Operator",
      department: "Operations",
      company: "Kyalima Farmers",
      applicants: 15,
      status: "Active",
      posted: "2024-01-20"
    }
  ];

  const interviews = [
    {
      candidate: "Sarah Wilson",
      position: "Cheese Production Specialist",
      date: "2024-02-15",
      time: "10:00 AM",
      interviewer: "John Smith"
    },
    {
      candidate: "David Brown",
      position: "Coffee Quality Inspector",
      date: "2024-02-16",
      time: "2:00 PM",
      interviewer: "Jane Doe"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Open Positions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {openPositions.map((position, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{position.title}</h3>
                <Badge variant={position.status === 'Active' ? 'default' : 'secondary'}>
                  {position.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{position.department} • {position.company}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm">{position.applicants} applicants</span>
                <Button size="sm">View Applications</Button>
              </div>
            </div>
          ))}
          <Button className="w-full">
            <UserPlus className="h-4 w-4 mr-2" />
            Post New Position
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Interviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {interviews.map((interview, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{interview.candidate}</h3>
              <p className="text-sm text-muted-foreground">{interview.position}</p>
              <div className="flex justify-between items-center mt-3">
                <div>
                  <p className="text-sm">{interview.date} at {interview.time}</p>
                  <p className="text-xs text-muted-foreground">Interviewer: {interview.interviewer}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button className="w-full" variant="outline">
            Schedule New Interview
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitmentModule;
