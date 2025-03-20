
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, Download, Mail, Phone } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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

const RecruitmentRecordsTable = ({ records, isLoading, error }) => {
  const [sortColumn, setSortColumn] = useState('interview_date_time');
  const [sortDirection, setSortDirection] = useState('desc');
  const { toast } = useToast();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'PPp');
    } catch (error) {
      return dateString;
    }
  };

  const sortedRecords = [...(records || [])].sort((a, b) => {
    let valueA = a[sortColumn];
    let valueB = b[sortColumn];

    if (sortColumn === 'interview_date_time') {
      valueA = new Date(valueA || 0).getTime();
      valueB = new Date(valueB || 0).getTime();
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
    
    toast({
      title: "Record Details",
      description: `Viewing details for ${record.candidate_name}`,
    });
  };

  const handleDownloadRecord = (record) => {
    // Create a JSON string from the record
    const recordData = JSON.stringify(record, null, 2);
    
    // Create a blob from the data
    const blob = new Blob([recordData], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `recruitment_record_${record.id}.json`;
    
    // Append the link to the document, trigger click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Complete",
      description: `Record for ${record.candidate_name} has been downloaded`,
    });
  };

  const handleEmailRecord = (record) => {
    // In a real application, this would connect to an email service
    // For now, simulate sending an email with a toast notification
    
    // Format the record data for email body (in a real app)
    const emailSubject = `Recruitment Record for ${record.candidate_name}`;
    const emailBody = `
      Candidate: ${record.candidate_name}
      Position: ${record.job_title}
      Interview Date: ${formatDate(record.interview_date_time)}
      Status: ${record.status}
    `;
    
    console.log("Email would be sent with:", { subject: emailSubject, body: emailBody });
    
    toast({
      title: "Email Sent",
      description: `Recruitment record for ${record.candidate_name} has been emailed`,
    });
  };

  const handlePhoneCall = (record) => {
    // In a real application, this might use a telephony API or open a phone app
    // For now, simulate initiating a call with a toast notification
    
    // Format phone for dialing (assuming hiring_manager_id contains a phone in this context)
    const phoneNumber = record.hiring_manager_id;
    
    // On mobile devices, this could actually initiate a call
    // window.location.href = `tel:${phoneNumber}`;
    
    console.log("Call would be initiated to:", phoneNumber);
    
    toast({
      title: "Call Initiated",
      description: `Initiating call regarding ${record.candidate_name}`,
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading recruitment records...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading recruitment records: {error.message}</div>;
  }

  if (!records || records.length === 0) {
    return <div className="text-center p-6 text-gray-500">No recruitment records found</div>;
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('candidate_name')} className="cursor-pointer">
                Candidate Name
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('job_title')} className="cursor-pointer">
                Job Title
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('interview_date_time')} className="cursor-pointer">
                Interview Date/Time
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('hiring_manager_id')} className="cursor-pointer">
                Hiring Manager
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                Status
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('created_at')} className="cursor-pointer">
                Created At
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.candidate_name}</TableCell>
                <TableCell>{record.job_title}</TableCell>
                <TableCell>{formatDate(record.interview_date_time)}</TableCell>
                <TableCell>{record.hiring_manager_id}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(record.created_at)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="View"
                      onClick={() => handleViewRecord(record)}
                      className="hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Download"
                      onClick={() => handleDownloadRecord(record)}
                      className="hover:bg-green-50"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Email"
                      onClick={() => handleEmailRecord(record)}
                      className="hover:bg-amber-50"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Call"
                      onClick={() => handlePhoneCall(record)}
                      className="hover:bg-purple-50"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recruitment Record Details</DialogTitle>
            <DialogDescription>
              Complete information for this recruitment record.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">Candidate:</span>
                <span className="col-span-3">{selectedRecord.candidate_name}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">Job Title:</span>
                <span className="col-span-3">{selectedRecord.job_title}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">Interview:</span>
                <span className="col-span-3">{formatDate(selectedRecord.interview_date_time)}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">Manager ID:</span>
                <span className="col-span-3">{selectedRecord.hiring_manager_id}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">Status:</span>
                <span className="col-span-3">
                  <Badge className={getStatusColor(selectedRecord.status)}>
                    {selectedRecord.status}
                  </Badge>
                </span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">Feedback:</span>
                <span className="col-span-3">{selectedRecord.feedback || "No feedback provided"}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">Created:</span>
                <span className="col-span-3">{formatDate(selectedRecord.created_at)}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium col-span-1">Updated:</span>
                <span className="col-span-3">{formatDate(selectedRecord.updated_at)}</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecruitmentRecordsTable;
