
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Download, Mail, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const RecordActionButtons = ({ record, onViewRecord }) => {
  const { toast } = useToast();

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
      Interview Date: ${record.interview_date_time}
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

  return (
    <div className="flex space-x-2">
      <Button 
        variant="ghost" 
        size="icon" 
        title="View"
        onClick={() => onViewRecord(record)}
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
  );
};

export default RecordActionButtons;
