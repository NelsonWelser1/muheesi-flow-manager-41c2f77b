import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

const DairyMetricsCard = ({ section, icon: Icon, onSectionClick }) => {
  console.log('Rendering DairyMetricsCard for:', section.title);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'attention':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow relative ${
        section.status === 'attention' ? 'border-red-500' : ''
      }`}
      onClick={() => onSectionClick(section.id)}
    >
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center flex-1">
          <Icon className="h-6 w-6 mr-2" />
          <CardTitle className="text-xl">{section.title}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${getStatusColor(section.status)}`} />
          {section.notifications > 0 && (
            <Badge variant="secondary" className="ml-2">
              {section.notifications}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Click to manage {section.title.toLowerCase()} operations
        </p>
      </CardContent>
    </Card>
  );
};

export default DairyMetricsCard;