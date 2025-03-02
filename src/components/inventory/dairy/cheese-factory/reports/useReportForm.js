
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

export const useReportForm = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Current session:', currentSession);
        setSession(currentSession);
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          console.log('Auth state changed:', session);
          setSession(session);
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!session?.user?.id) {
        console.error('No authenticated user found');
        toast({
          title: "Authentication Required",
          description: "Please log in to submit reports",
          variant: "destructive",
        });
        return;
      }

      // Save report configuration
      const { data: configData, error: configError } = await supabase
        .from('report_configurations')
        .insert([{
          report_type: report.type,
          start_date: report.startDate,
          end_date: report.endDate,
          user_id: session.user.id
        }])
        .select();

      if (configError) {
        console.error('Error saving report configuration:', configError);
        throw configError;
      }

      console.log('Report configuration saved:', configData);

      // Save the maintenance report
      const { data: reportData, error: reportError } = await supabase
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
        }])
        .select();

      if (reportError) {
        console.error('Error saving maintenance report:', reportError);
        throw reportError;
      }

      console.log('Maintenance report saved:', reportData);

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
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recipient,
    setRecipient,
    report,
    setReport,
    isLoading,
    handleSubmit
  };
};
