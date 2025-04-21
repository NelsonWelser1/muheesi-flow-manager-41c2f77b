
import React, { memo } from 'react';
import { Separator } from "@/components/ui/separator";
import SidebarHeader from './sidebar/SidebarHeader';
import DashboardMenu from './sidebar/DashboardMenu';
import ManagementMenu from './sidebar/ManagementMenu';
import QuickAccessMenu from './sidebar/QuickAccessMenu';

// Memoized CEOSidebar component to prevent unnecessary re-renders
const CEOSidebar = memo(({ activeTab, onChangeTab }) => {
  return (
    <div className="w-64 h-screen bg-[#F1F0FB] border-r border-[#E5DEFF] flex flex-col">
      <SidebarHeader />
      <Separator className="bg-[#E5DEFF]" />
      <DashboardMenu activeTab={activeTab} onChangeTab={onChangeTab} />
      <Separator className="bg-[#E5DEFF]" />
      <ManagementMenu />
      <Separator className="bg-[#E5DEFF]" />
      <QuickAccessMenu />
    </div>
  );
});

// Add display name for debugging
CEOSidebar.displayName = 'CEOSidebar';

export default CEOSidebar;
