
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users
} from 'lucide-react';

const ProceduresMetrics = () => {
  const metrics = [
    {
      title: "Total Procedures",
      value: "156",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Active Procedures",
      value: "142",
      change: "+8%",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Under Review",
      value: "8",
      change: "+2",
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Need Updates",
      value: "6",
      change: "-3",
      icon: AlertCircle,
      color: "text-red-600"
    },
    {
      title: "Compliance Rate",
      value: "94.2%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Staff Trained",
      value: "687",
      change: "+45",
      icon: Users,
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>{metric.title}</span>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProceduresMetrics;
