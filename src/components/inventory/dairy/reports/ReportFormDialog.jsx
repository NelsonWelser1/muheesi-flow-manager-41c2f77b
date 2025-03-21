
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/components/ui/notifications";
import { useSubmitReport } from "./hooks/useSubmitReport";

const ReportFormDialog = ({ open, onOpenChange, onReportSubmitted }) => {
  const [reportData, setReportData] = useState({
    title: '',
    type: '',
    content: '',
    startDate: new Date(),
    endDate: new Date(),
    recipient: {
      name: '',
      email: '',
      phone: ''
    },
    sendVia: []
  });
  const { toast } = useToast();
  const { submitReport, isSubmitting } = useSubmitReport();

  const reportTypes = [
    'Daily Stock Summary',
    'Weekly Inventory Report',
    'Monthly Analysis',
    'Quality Control Report',
    'Stock Movement Report',
    'Custom Report'
  ];

  const handleSendViaToggle = (method) => {
    setReportData(prev => ({
      ...prev,
      sendVia: prev.sendVia.includes(method)
        ? prev.sendVia.filter(m => m !== method)
        : [...prev.sendVia, method]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setReportData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setReportData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, date) => {
    setReportData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!reportData.title) {
      showErrorToast(toast, "Report title is required");
      return;
    }
    
    if (!reportData.type) {
      showErrorToast(toast, "Report type is required");
      return;
    }
    
    if (!reportData.content) {
      showErrorToast(toast, "Report content is required");
      return;
    }
    
    if (reportData.sendVia.length === 0) {
      showErrorToast(toast, "Please select at least one delivery method");
      return;
    }
    
    if (!reportData.recipient.name || !reportData.recipient.email) {
      showErrorToast(toast, "Recipient name and email are required");
      return;
    }
    
    try {
      await submitReport(reportData);
      onReportSubmitted();
    } catch (error) {
      showErrorToast(toast, `Error submitting report: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Report</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Report Title</Label>
            <Input
              id="title"
              name="title"
              value={reportData.title}
              onChange={handleInputChange}
              placeholder="Enter report title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Report Type</Label>
            <Select
              value={reportData.type}
              onValueChange={(value) => handleSelectChange('type', value)}
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
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(reportData.startDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={reportData.startDate}
                    onSelect={(date) => handleDateChange('startDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(reportData.endDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={reportData.endDate}
                    onSelect={(date) => handleDateChange('endDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Report Content</Label>
            <Textarea
              id="content"
              name="content"
              value={reportData.content}
              onChange={handleInputChange}
              placeholder="Enter report details"
              className="min-h-[150px]"
            />
          </div>
          
          <div className="space-y-4">
            <Label>Recipient Information</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="recipient.name"
                value={reportData.recipient.name}
                onChange={handleInputChange}
                placeholder="Recipient Name"
              />
              <Input
                name="recipient.phone"
                value={reportData.recipient.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                type="tel"
              />
              <Input
                className="col-span-2"
                name="recipient.email"
                value={reportData.recipient.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                type="email"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Send Via</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={reportData.sendVia.includes('email') ? 'default' : 'outline'}
                onClick={() => handleSendViaToggle('email')}
              >
                Email
              </Button>
              <Button
                type="button"
                variant={reportData.sendVia.includes('sms') ? 'default' : 'outline'}
                onClick={() => handleSendViaToggle('sms')}
              >
                SMS
              </Button>
              <Button
                type="button"
                variant={reportData.sendVia.includes('system') ? 'default' : 'outline'}
                onClick={() => handleSendViaToggle('system')}
              >
                System
              </Button>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="ml-2">
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportFormDialog;
