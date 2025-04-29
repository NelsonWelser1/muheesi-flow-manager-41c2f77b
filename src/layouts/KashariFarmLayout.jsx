
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";

const KashariFarmLayout = () => {
  return (
    <div className="flex h-full">
      <Sidebar className="border-r">
        <SidebarHeader>
          <h2 className="text-lg font-semibold">Kashari Farm</h2>
        </SidebarHeader>
        <SidebarContent>
          <div className="px-4 py-2">
            <nav className="space-y-1">
              <a 
                href="/manage-inventory/kashari-farm/dairy" 
                className="flex items-center px-3 py-2 text-sm rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                Dairy Farm
              </a>
              {/* Additional farm sections can be added here */}
            </nav>
          </div>
        </SidebarContent>
      </Sidebar>
      
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default KashariFarmLayout;
