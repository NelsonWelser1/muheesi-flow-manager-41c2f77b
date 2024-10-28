import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from 'next-themes';
import { Clock, Home, LogOut, HelpCircle, Moon, Sun } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { useToast } from "@/components/ui/use-toast";
import TechnicalSupportForm from './TechnicalSupportForm';
import SystemAdministratorActions from './SystemAdministratorActions';

const AccountInterface = ({ account, onLogout, onHome }) => {
  const { theme, setTheme } = useTheme();
  const sessionTime = useTimer();
  const [activeResponsibility, setActiveResponsibility] = useState(null);
  const { toast } = useToast();
  const isAdmin = account.title === "System Administrator (SysAdmin)";

  const handleAction = (responsibility) => {
    setActiveResponsibility(responsibility);
    toast({
      title: `${responsibility} Selected`,
      description: "Loading related actions...",
    });
  };

  const renderActionContent = () => {
    if (account.title === "System Administrator (SysAdmin)" && activeResponsibility) {
      return <SystemAdministratorActions responsibility={activeResponsibility} />;
    }
    
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">{activeResponsibility} Actions</h3>
          {/* Implement specific actions based on the selected responsibility */}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-64 bg-background border-r p-4 flex flex-col">
        <div className="mb-6 pb-6 border-b">
          <h2 className="font-semibold text-lg">{account.title}</h2>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Clock className="w-4 h-4 mr-2" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Session time: {sessionTime}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-medium mb-3">Primary Responsibilities</h3>
          <div className="space-y-2">
            {account.responsibilities.map((responsibility, idx) => (
              <Button
                key={idx}
                variant={activeResponsibility === responsibility ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleAction(responsibility)}
              >
                {responsibility}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2 mt-auto">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onHome}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => window.open('/support', '_blank')}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Technical Support
          </Button>
          <Button 
            variant="destructive" 
            className="w-full justify-start"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex justify-between items-center">
          <Tabs defaultValue="actions" className="w-full">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="ml-auto"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </div>

            <TabsContent value="actions" className="p-4">
              {activeResponsibility ? renderActionContent() : (
                <p>Select a responsibility to view available actions</p>
              )}
            </TabsContent>

            <TabsContent value="permissions" className="p-4">
              <Card>
                <CardContent className="p-6">
                  {isAdmin ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Manage Permissions</h3>
                      {/* Add permission management interface for admin */}
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Your Permissions</h3>
                      <p className="mb-4">Contact system administrator to modify permissions.</p>
                      <TechnicalSupportForm />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AccountInterface;
