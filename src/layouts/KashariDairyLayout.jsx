
import React from 'react';
import { Outlet } from 'react-router-dom';
import DairySidebar from '../components/inventory/kashari/modules/dairy/DairySidebar';

const KashariDairyLayout = () => {
  return (
    <div className="flex h-full">
      <DairySidebar />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default KashariDairyLayout;
