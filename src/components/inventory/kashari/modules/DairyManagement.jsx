
import React from 'react';
import DairyLayout from './dairy/layout/DairyLayout';
import DairySidebar from './dairy/DairySidebar';
import { DairyProvider } from './dairy/context/DairyContext';
import DairyContent from './dairy/DairyContent';

const DairyManagement = () => {
  return (
    <DairyProvider>
      <div className="space-y-4">
        <div className="flex w-full h-[calc(100vh-12rem)] overflow-hidden rounded-lg border bg-white shadow">
          <DairySidebar />
          <div className="flex-1 p-6 overflow-y-auto">
            <DairyContent />
          </div>
        </div>
      </div>
    </DairyProvider>
  );
};

export default DairyManagement;
