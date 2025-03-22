
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { Loader2 } from 'lucide-react';
import { exportToPDF } from '../../utils/reportExportUtils';

const ShareReportDialog = ({ 
  isOpen, 
  onClose, 
  reportType, 
  dateRange, 
  shareMethod, 
  data 
}) => {
  const [recipients, setRecipients] = useState([]);
  const [recipientInput, setRecipientInput] = useState('');
  const [message, setMessage] = useState(`Please find attached the ${reportType} for ${dateRange}.`);
  const [isSharing, setIsSharing] = useState(false);
  const [systemUsers, setSystemUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { toast } = useToast();

  // Fetch system users if sharing method is 'system'
  React.useEffect(() => {
    if (shareMethod === 'system' && isOpen) {
      fetchSystemUsers();
    }
  }, [shareMethod, isOpen]);

  // Fetch system users from Supabase
  const fetchSystemUsers = async () => {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name', { ascending: true });
        
      if (error) throw error;
      setSystemUsers(users || []);
    } catch (error) {
      console.error('Error fetching system users:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch system users.',
        variant: 'destructive',
      });
    }
  };

  // Add recipient to the list
  const addRecipient = () => {
    if (!recipientInput) return;
    
    // Email validation for email sharing method
    if (shareMethod === 'email' && !validateEmail(recipientInput)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }
    
    // Phone validation for WhatsApp sharing method
    if (shareMethod === 'whatsapp' && !validatePhone(recipientInput)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number.',
        variant: 'destructive',
      });
      return;
    }
    
    setRecipients([...recipients, recipientInput]);
    setRecipientInput('');
  };

  // Handle selecting system users
  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Handle sharing the report
  const handleShare = async () => {
    if ((shareMethod !== 'system' && recipients.length === 0) || 
        (shareMethod === 'system' && selectedUsers.length === 0)) {
      toast({
        title: 'No Recipients',
        description: 'Please add at least one recipient.',
        variant: 'destructive',
      });
      return;
    }

    setIsSharing(true);
    
    try {
      // Prepare the report
      const reportTitle = `${reportType}_${dateRange}`.replace(/\s+/g, '_');
      
      if (shareMethod === 'email') {
        // Log email sharing to Supabase
        await supabase.from('report_shares').insert({
          report_type: reportType,
          share_method: 'email',
          recipients: recipients,
          message: message,
          shared_at: new Date().toISOString()
        });
        
        toast({
          title: 'Report Shared',
          description: `Report sent to ${recipients.length} email address(es).`,
        });
      } 
      else if (shareMethod === 'whatsapp') {
        // For WhatsApp, we'd typically generate a deep link
        // As this is a demo, we'll just log it
        await supabase.from('report_shares').insert({
          report_type: reportType,
          share_method: 'whatsapp',
          recipients: recipients,
          message: message,
          shared_at: new Date().toISOString()
        });
        
        toast({
          title: 'Report Shared',
          description: `Report shared with ${recipients.length} WhatsApp contact(s).`,
        });
      } 
      else if (shareMethod === 'system') {
        // Get selected users' details
        const selectedUserDetails = systemUsers.filter(user => selectedUsers.includes(user.id));
        
        // Log system sharing to Supabase
        await supabase.from('report_shares').insert({
          report_type: reportType,
          share_method: 'system',
          recipients: selectedUserDetails.map(user => user.email),
          recipient_ids: selectedUsers,
          message: message,
          shared_at: new Date().toISOString()
        });
        
        toast({
          title: 'Report Shared',
          description: `Report shared with ${selectedUsers.length} system user(s).`,
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error sharing report:', error);
      toast({
        title: 'Error',
        description: 'Failed to share the report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  // Email validation helper
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Phone validation helper
  const validatePhone = (phone) => {
    return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone);
  };

  // Get placeholder text based on share method
  const getPlaceholder = () => {
    switch (shareMethod) {
      case 'email':
        return 'Enter email address';
      case 'whatsapp':
        return 'Enter phone number';
      default:
        return 'Enter recipient';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {reportType}</DialogTitle>
          <DialogDescription>
            {shareMethod === 'email' && 'Share this report via email'}
            {shareMethod === 'whatsapp' && 'Share this report via WhatsApp'}
            {shareMethod === 'system' && 'Share this report with system users'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {shareMethod !== 'system' ? (
            <>
              <div className="flex items-end space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="recipient">
                    {shareMethod === 'email' ? 'Email' : 'Phone Number'}
                  </Label>
                  <Input
                    id="recipient"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    placeholder={getPlaceholder()}
                  />
                </div>
                <Button type="button" onClick={addRecipient}>Add</Button>
              </div>
              
              {recipients.length > 0 && (
                <div className="border rounded-md p-2">
                  <Label className="text-xs">Recipients:</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {recipients.map((recipient, index) => (
                      <div key={index} className="bg-slate-100 px-2 py-1 rounded text-sm flex items-center">
                        {recipient}
                        <button
                          type="button"
                          className="ml-2 text-slate-500 hover:text-slate-700"
                          onClick={() => setRecipients(recipients.filter((_, i) => i !== index))}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <Label>Select System Users</Label>
              <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                {systemUsers.length > 0 ? (
                  systemUsers.map(user => (
                    <div 
                      key={user.id} 
                      className="flex items-center space-x-2 py-1 border-b last:border-b-0"
                    >
                      <input 
                        type="checkbox" 
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelect(user.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor={`user-${user.id}`} className="text-sm flex-1">
                        {user.full_name} <span className="text-xs text-slate-500">({user.email})</span>
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 py-2">Loading users...</div>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message to accompany the report"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleShare}
            disabled={isSharing || 
              (shareMethod !== 'system' && recipients.length === 0) || 
              (shareMethod === 'system' && selectedUsers.length === 0)}
          >
            {isSharing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Share Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareReportDialog;
