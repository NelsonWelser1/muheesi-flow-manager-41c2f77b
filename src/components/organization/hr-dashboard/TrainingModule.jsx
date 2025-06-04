
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Clock, Users, Award } from 'lucide-react';

const TrainingModule = () => {
  const trainings = [
    {
      title: "Food Safety & Hygiene",
      participants: 45,
      completed: 38,
      duration: "4 hours",
      status: "Active",
      nextSession: "2024-02-20"
    },
    {
      title: "Equipment Operation Training",
      participants: 25,
      completed: 20,
      duration: "6 hours",
      status: "Active",
      nextSession: "2024-02-22"
    },
    {
      title: "Quality Control Standards",
      participants: 30,
      completed: 28,
      duration: "3 hours",
      status: "Completed",
      nextSession: "2024-03-01"
    }
  ];

  const certifications = [
    {
      name: "Food Safety Certification",
      expiring: 5,
      total: 45,
      renewalDate: "2024-03-15"
    },
    {
      name: "Equipment Operation License",
      expiring: 2,
      total: 25,
      renewalDate: "2024-04-01"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Training Programs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trainings.map((training, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{training.title}</h3>
                  <Badge variant={training.status === 'Active' ? 'default' : 'secondary'}>
                    {training.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {training.participants} participants
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {training.duration}
                  </div>
                </div>
                <Progress value={(training.completed / training.participants) * 100} className="mb-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm">{training.completed}/{training.participants} completed</span>
                  <Button size="sm">Manage</Button>
                </div>
              </div>
            ))}
            <Button className="w-full">
              <GraduationCap className="h-4 w-4 mr-2" />
              Create New Training
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{cert.name}</h3>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Expiring Soon</span>
                    <span>{cert.expiring}/{cert.total}</span>
                  </div>
                  <Progress value={(cert.expiring / cert.total) * 100} className="mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Renewal due: {cert.renewalDate}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3">
                  Manage Renewals
                </Button>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              Track All Certifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingModule;
