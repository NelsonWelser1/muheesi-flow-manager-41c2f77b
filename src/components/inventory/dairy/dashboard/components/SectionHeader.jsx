
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

const SectionHeader = ({ title, status, notifications, onBack }) => {
  return (
    <>
      <button 
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        ← Back to Dashboard
      </button>
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          <Badge className={`bg-${status === 'operational' ? 'green' : status === 'maintenance' ? 'yellow' : 'red'}-500`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          {notifications > 0 && (
            <Badge variant="secondary">
              <Bell className="h-4 w-4 mr-1" />
              {notifications} notifications
            </Badge>
          )}
        </div>
      </div>
    </>
  );
};

export default SectionHeader;
