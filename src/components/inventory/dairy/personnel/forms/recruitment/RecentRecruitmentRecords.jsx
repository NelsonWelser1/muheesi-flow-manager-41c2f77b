
import React from 'react';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RecentRecruitmentRecords = ({
  records,
  isLoading
}) => {
  // Handle loading state
  if (isLoading) {
    return <Card>
        <CardHeader>
          <CardTitle>Recent Recruitment Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Loading records...</p>
          </div>
        </CardContent>
      </Card>;
  }

  // Handle no records state
  if (!records || records.length === 0) {
    return <Card>
        <CardHeader>
          <CardTitle>Recent Recruitment Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">No recruitment records found</p>
          </div>
        </CardContent>
      </Card>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return "bg-green-100 text-green-800 border-green-300";
      case 'Scheduled':
        return "bg-blue-100 text-blue-800 border-blue-300";
      case 'In Progress':
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 'Pending':
        return "bg-orange-100 text-orange-800 border-orange-300";
      case 'Rejected':
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Recruitment Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate Name</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Interview Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.slice(0, 5).map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.candidate_name}</TableCell>
                <TableCell>{record.job_title}</TableCell>
                <TableCell>
                  {record.interview_date_time ? 
                    format(new Date(record.interview_date_time), 'PPp') : 
                    'Not scheduled'}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentRecruitmentRecords;
