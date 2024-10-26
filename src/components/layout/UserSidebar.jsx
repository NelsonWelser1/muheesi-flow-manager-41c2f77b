import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Clock, Home, LogOut, HelpCircle } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';

const UserSidebar = ({ user, primaryActions }) => {
  const navigate = useNavigate();
  const sessionTime = useTimer();

  return (
    <div className="h-screen w-64 bg-gray-50 p-4 flex flex-col">
      {/* User Info */}
      <div className="mb-6 pb-6 border-b">
        <h2 className="font-semibold text-lg">{user.role}</h2>
        <p className="text-sm text-gray-600 mb-2">{user.name}</p>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Clock className="w-4 h-4 mr-2" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div className="text-sm text-gray-500">
          Session time: {sessionTime}
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex-1 mb-6">
        <h3 className="font-medium mb-3">Primary Responsibilities</h3>
        <div className="space-y-2">
          {primaryActions.map((action, idx) => (
            <Button
              key={idx}
              variant="ghost"
              className="w-full justify-start"
            >
              {action}
            </Button>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 mt-auto">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => navigate('/home')}
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
          onClick={() => navigate('/logout')}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default UserSidebar;