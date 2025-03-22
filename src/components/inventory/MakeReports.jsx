import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, MessageSquare, Phone, FileText } from "lucide-react";
import KazoReportsViewer from './kajon/KazoReportsViewer';
import { supabase } from '@/integrations/supabase/supabase';
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from '@/components/ui/notifications';
const MakeReports = ({
  isKazo = false
}) => {
  const [recipient, setRecipient] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [report, setReport] = useState({
    title: '',
    type: '',
    content: '',
    sendVia: []
  });
  const [showReportsViewer, setShowReportsViewer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toast
  } = useToast();
  const reportTypes = ['Daily Stock Summary', 'Weekly Inventory Report', 'Monthly Analysis', 'Quality Control Report', 'Stock Movement Report', 'Custom Report'];
  useEffect(() => {
    // If we need to fetch any initial data in the future, we can add it here
  }, []);
  const handleSendViaToggle = method => {
    setReport(prev => ({
      ...prev,
      sendVia: prev.sendVia.includes(method) ? prev.sendVia.filter(m => m !== method) : [...prev.sendVia, method]
    }));
  };
  const validateForm = () => {
    // Check for empty fields
    if (!report.title.trim()) {
      showErrorToast(toast, "Please enter a report title");
      return false;
    }
    if (!report.type) {
      showErrorToast(toast, "Please select a report type");
      return false;
    }
    if (!report.content.trim()) {
      showErrorToast(toast, "Please enter report content");
      return false;
    }
    if (report.sendVia.length === 0) {
      showErrorToast(toast, "Please select at least one method to send the report");
      return false;
    }
    if (!recipient.name.trim()) {
      showErrorToast(toast, "Please enter recipient name");
      return false;
    }
    if (!recipient.phone.trim()) {
      showErrorToast(toast, "Please enter recipient phone number");
      return false;
    }
    if (!recipient.email.trim()) {
      showErrorToast(toast, "Please enter recipient email");
      return false;
    }

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient.email.trim())) {
      showErrorToast(toast, "Please enter a valid email address");
      return false;
    }
    return true;
  };
  const resetForm = () => {
    setRecipient({
      name: '',
      phone: '',
      email: ''
    });
    setReport({
      title: '',
      type: '',
      content: '',
      sendVia: []
    });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    const loadingToastId = showLoadingToast(toast, "Submitting report...");
    try {
      // Prepare the data to be saved to Supabase
      const reportData = {
        title: report.title,
        report_type: report.type,
        content: report.content,
        recipient_name: recipient.name,
        recipient_phone: recipient.phone,
        recipient_email: recipient.email,
        send_via: report.sendVia,
        location: 'Kazo' // Default location for Kazo Coffee Development Project
      };

      // Insert data into Supabase
      const {
        data,
        error
      } = await supabase.from('kazo_coffee_reports').insert([reportData]).select();
      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message || "Error saving report");
      }
      console.log("Report saved successfully:", data);

      // Dismiss loading toast
      dismissToast(loadingToastId);

      // Show success message
      showSuccessToast(toast, `Report "${report.title}" has been submitted successfully`);

      // Reset form after successful submission
      resetForm();
    } catch (error) {
      console.error("Error submitting report:", error);

      // Dismiss loading toast
      dismissToast(loadingToastId);

      // Show error message
      showErrorToast(toast, error.message || "There was an error sending your report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (showReportsViewer && isKazo) {
    return <KazoReportsViewer onBack={() => setShowReportsViewer(false)} />;
  }
  return <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>
            Kazo Coffee Development Project Reports
          </CardTitle>
          {isKazo && <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowReportsViewer(true)}>
              <FileText className="h-4 w-4" />
              View Reports
            </Button>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="reportTitle">Report Title</Label>
                <Input id="reportTitle" value={report.title} onChange={e => setReport({
                ...report,
                title: e.target.value
              })} placeholder="Enter report title" required />
              </div>

              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={report.type} onValueChange={value => setReport({
                ...report,
                type: value
              })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reportContent">Report Content</Label>
                <Textarea id="reportContent" value={report.content} onChange={e => setReport({
                ...report,
                content: e.target.value
              })} placeholder="Enter report details" className="min-h-[200px]" required />
              </div>

              <div className="space-y-4">
                <Label>Recipient Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Recipient Name" value={recipient.name} onChange={e => setRecipient({
                  ...recipient,
                  name: e.target.value
                })} required />
                  <Input placeholder="Phone Number" type="tel" value={recipient.phone} onChange={e => setRecipient({
                  ...recipient,
                  phone: e.target.value
                })} required />
                  <Input placeholder="Email Address" type="email" value={recipient.email} onChange={e => setRecipient({
                  ...recipient,
                  email: e.target.value
                })} required className="md:col-span-2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Send Via</Label>
                <div className="flex flex-wrap gap-2">
                  
                  
                  <Button type="button" variant={report.sendVia.includes('whatsapp') ? 'default' : 'outline'} onClick={() => handleSendViaToggle('whatsapp')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                  
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Generate and Send Report'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>;
};
export default MakeReports;