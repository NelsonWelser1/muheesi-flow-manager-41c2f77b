
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Syringe, HeartPulse, Pill } from "lucide-react";

const HealthRecordsTable = () => {
  // Placeholder data - would be replaced with real data from API
  const healthRecords = [
    {
      id: 1,
      date: "2025-04-12",
      type: "Vaccination",
      description: "Foot and Mouth Disease vaccination",
      performedBy: "Dr. Sarah Johnson",
      status: "completed"
    },
    {
      id: 2,
      date: "2025-04-10",
      type: "Treatment",
      description: "Mastitis treatment - antibiotics administered",
      performedBy: "Dr. Michael Chen",
      status: "ongoing"
    },
    {
      id: 3,
      date: "2025-04-08",
      type: "Examination",
      description: "Routine health check - all parameters normal",
      performedBy: "Dr. Sarah Johnson",
      status: "completed"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Vaccination':
        return <Syringe className="h-4 w-4 text-purple-500" />;
      case 'Treatment':
        return <Pill className="h-4 w-4 text-blue-500" />;
      case 'Examination':
        return <HeartPulse className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="max-w-[500px]">Description</TableHead>
              <TableHead>Performed By</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {healthRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {record.date}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(record.type)}
                    {record.type}
                  </div>
                </TableCell>
                <TableCell className="max-w-[500px]">{record.description}</TableCell>
                <TableCell>{record.performedBy}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default HealthRecordsTable;
