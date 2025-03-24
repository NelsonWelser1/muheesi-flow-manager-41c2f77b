
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

export const useMessages = (associationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('association_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setMessages(data || []);
      return data;
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message);
      showErrorToast(toast, `Failed to load messages: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const saveMessage = async (messageData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      // Validate required fields
      if (!messageData.subject?.trim()) {
        throw new Error("Subject is required");
      }
      
      if (!messageData.message?.trim()) {
        throw new Error("Message content is required");
      }
      
      if (!messageData.recipients) {
        throw new Error("Recipients must be selected");
      }
      
      if (!messageData.type) {
        throw new Error("Message type must be selected");
      }
      
      // Prepare data for insertion
      const newMessage = {
        subject: messageData.subject.trim(),
        message: messageData.message.trim(),
        recipients: messageData.recipients,
        type: messageData.type,
        status: messageData.status || 'sent',
        association_id: associationId || null,
        scheduled_date: messageData.status === 'scheduled' ? messageData.scheduledDate : null,
        sent_date: messageData.status === 'sent' ? new Date().toISOString() : null,
        sent_by: 'Current User' // This would be replaced with the actual user in a real authentication scenario
      };
      
      // Insert message into Supabase
      const { data, error } = await supabase
        .from('association_messages')
        .insert([newMessage])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setMessages(prev => [data, ...prev]);
      
      showSuccessToast(toast, "Message saved successfully");
      return { success: true, data };
      
    } catch (err) {
      console.error('Error saving message:', err);
      setError(err.message);
      showErrorToast(toast, err.message || "Failed to save message");
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  const sendMessageToRecipients = async (message, channel) => {
    // In a real application, this would connect to an SMS, WhatsApp, or Email API
    // For now, we'll just update the status in the database
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('association_messages')
        .update({ 
          status: 'sent',
          sent_date: new Date().toISOString()
        })
        .eq('id', message.id);
      
      if (error) throw error;
      
      showSuccessToast(toast, `Message sent via ${channel}`);
      
      // Update the local state
      setMessages(prev => prev.map(m => 
        m.id === message.id 
          ? {...m, status: 'sent', sent_date: new Date().toISOString()} 
          : m
      ));
      
      return { success: true };
    } catch (err) {
      console.error(`Error sending message via ${channel}:`, err);
      showErrorToast(toast, `Failed to send message via ${channel}: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    messages,
    loading,
    submitting,
    error,
    fetchMessages,
    saveMessage,
    sendMessageToRecipients
  };
};
