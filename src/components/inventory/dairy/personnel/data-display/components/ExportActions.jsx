
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown, Printer, Mail, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

const ExportActions = ({ data, title }) => {
  const { toast } = useToast();

  const handleExport = async (exportFormat) => {
    if (!data) return;

    try {
      let content = '';
      const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm');
      let filename = `${title.toLowerCase()}-${timestamp}`;

      if (exportFormat === 'csv') {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(',')).join('\n');
        content = `${headers}\n${rows}`;
        filename += '.csv';
        
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
      } else if (exportFormat === 'print') {
        window.print();
      }

      toast({
        title: "Success",
        description: `${exportFormat.toUpperCase()} export completed`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (method) => {
    try {
      switch (method) {
        case 'email':
          toast({
            title: "Email Share",
            description: "Email sharing feature coming soon",
          });
          break;
        case 'whatsapp':
          toast({
            title: "WhatsApp Share",
            description: "WhatsApp sharing feature coming soon",
          });
          break;
        case 'user':
          toast({
            title: "User Share",
            description: "User sharing feature coming soon",
          });
          break;
      }
    } catch (error) {
      console.error('Sharing error:', error);
      toast({
        title: "Error",
        description: "Failed to share data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => handleExport('csv')}>
        <FileDown className="h-4 w-4 mr-2" />
        CSV
      </Button>
      <Button variant="outline" onClick={() => handleExport('print')}>
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>
      <Button variant="outline" onClick={() => handleShare('email')}>
        <Mail className="h-4 w-4 mr-2" />
        Email
      </Button>
      <Button variant="outline" onClick={() => handleShare('whatsapp')}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  );
};

export default ExportActions;
