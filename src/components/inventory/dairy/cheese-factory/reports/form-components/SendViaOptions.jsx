
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Phone } from "lucide-react";

export const SendViaOptions = ({ sendVia, onToggle }) => {
  return (
    <div className="space-y-2">
      <Label>Send Via</Label>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={sendVia.includes('email') ? 'default' : 'outline'}
          onClick={() => onToggle('email')}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
        <Button
          type="button"
          variant={sendVia.includes('sms') ? 'default' : 'outline'}
          onClick={() => onToggle('sms')}
        >
          <Phone className="mr-2 h-4 w-4" />
          SMS
        </Button>
        <Button
          type="button"
          variant={sendVia.includes('whatsapp') ? 'default' : 'outline'}
          onClick={() => onToggle('whatsapp')}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
};
