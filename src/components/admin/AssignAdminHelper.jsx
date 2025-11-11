import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

const AssignAdminHelper = () => {
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUserId();
  }, []);

  const sqlCommand = userId
    ? `-- Run this in your Backend SQL Editor to make yourself a system admin
INSERT INTO public.user_roles (user_id, role, company)
VALUES ('${userId}', 'sysadmin', 'All Companies')
ON CONFLICT (user_id, role) DO NOTHING;`
    : '-- Loading your user ID...';

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCommand);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "SQL command copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          System Admin Setup Required
        </CardTitle>
        <CardDescription>
          You need to be assigned as a system administrator to access all features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Quick Setup</AlertTitle>
          <AlertDescription>
            Follow these steps to grant yourself system admin access:
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <p className="text-sm font-medium">Step 1: Copy this SQL command</p>
          <div className="relative">
            <pre className="p-4 bg-slate-900 text-slate-50 rounded-md overflow-x-auto text-xs">
              {sqlCommand}
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Step 2: Open your Backend</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to open your Lovable Cloud dashboard
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Step 3: Run the SQL command</p>
          <p className="text-sm text-muted-foreground">
            Navigate to the SQL Editor and paste the command, then click "Run"
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Step 4: Refresh this page</p>
          <p className="text-sm text-muted-foreground">
            After running the command, refresh your browser to see the changes
          </p>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-xs">
            <strong>Note:</strong> Your user ID is {userId || 'loading...'}. Once you're a system admin, 
            you can assign roles to other users through the User Management interface.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default AssignAdminHelper;
