import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, MessageSquare, Phone, Calendar as CalendarIcon } from "lucide-react";
import { supabase } from '@/integrations/supabase/supabase';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const MakeReports = ({ isKazo = false }) => {
  const [recipient, setRecipient] = useState({
    name: '',
    phone: '',
    email: '',
  });
  
  const [report, setReport] = useState({
    title: '',
    type: '',
    content: '',
    sendVia: [],
    startDate: new Date(),
    endDate: new Date()
  });

  const [session, setSession] = useState(null);
  const { toast } = useToast();

  // Check authentication status on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      // Subscribe to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    };

    checkSession();
  }, []);

  const reportTypes = [
    'Daily Stock Summary',
    'Weekly Inventory Report',
    'Monthly Analysis',
    'Quality Control Report',
    'Stock Movement Report',
    'Custom Report'
  ];

  const handleSendViaToggle = (method) => {
    setReport(prev => ({
      ...prev,
      sendVia: prev.sendVia.includes(method)
        ? prev.sendVia.filter(m => m !== method)
        : [...prev.sendVia, method]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Checking authentication before submission');
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit reports",
          variant: "destructive",
        });
        return;
      }

      console.log('Submitting report with session:', { recipient, report, sessionId: session.user.id });

      // First, save report configuration
      const { error: configError } = await supabase
        .from('report_configurations')
        .insert([{
          report_type: report.type,
          start_date: report.startDate,
          end_date: report.endDate,
          user_id: session.user.id
        }]);

      if (configError) {
        console.error('Error saving report configuration:', configError);
        throw configError;
      }

      // Then save the maintenance report
      const { error: reportError } = await supabase
        .from('maintenance_reports')
        .insert([{
          title: report.title,
          type: report.type,
          content: report.content,
          recipient_name: recipient.name,
          recipient_email: recipient.email,
          recipient_phone: recipient.phone,
          send_via: report.sendVia,
          start_date: report.startDate,
          end_date: report.endDate,
          user_id: session.user.id
        }]);

      if (reportError) throw reportError;

      toast({
        title: "Report Sent Successfully",
        description: `Report has been sent to ${recipient.name} via ${report.sendVia.join(', ')}`,
      });

      // Reset form
      setRecipient({ name: '', phone: '', email: '' });
      setReport({
        title: '',
        type: '',
        content: '',
        sendVia: [],
        startDate: new Date(),
        endDate: new Date()
      });

    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error Sending Report",
        description: error.message || "There was an error sending your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isKazo ? "Kazo Coffee Development Project Reports" : "KAJON Coffee Limited Reports"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="reportTitle">Report Title</Label>
                <Input
                  id="reportTitle"
                  value={report.title}
                  onChange={(e) => setReport({ ...report, title: e.target.value })}
                  placeholder="Enter report title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select
                  value={report.type}
                  onValueChange={(value) => setReport({ ...report, type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(report.startDate, 'PP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={report.startDate}
                        onSelect={(date) => setReport({ ...report, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(report.endDate, 'PP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={report.endDate}
                        onSelect={(date) => setReport({ ...report, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="reportContent">Report Content</Label>
                <Textarea
                  id="reportContent"
                  value={report.content}
                  onChange={(e) => setReport({ ...report, content: e.target.value })}
                  placeholder="Enter report details"
                  className="min-h-[200px]"
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Recipient Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Recipient Name"
                    value={recipient.name}
                    onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Phone Number"
                    type="tel"
                    value={recipient.phone}
                    onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={recipient.email}
                    onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
                    required
                    className="md:col-span-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Send Via</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={report.sendVia.includes('email') ? 'default' : 'outline'}
                    onClick={() => handleSendViaToggle('email')}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={report.sendVia.includes('sms') ? 'default' : 'outline'}
                    onClick={() => handleSendViaToggle('sms')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    SMS
                  </Button>
                  <Button
                    type="button"
                    variant={report.sendVia.includes('whatsapp') ? 'default' : 'outline'}
                    onClick={() => handleSendViaToggle('whatsapp')}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Generate and Send Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MakeReports;
