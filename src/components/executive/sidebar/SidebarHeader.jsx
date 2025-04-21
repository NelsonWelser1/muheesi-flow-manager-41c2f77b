
import React from 'react';

const SidebarHeader = () => {
  return (
    <div className="p-4 flex items-center">
      <div className="w-10 h-10 rounded-full bg-[#9B87F5] flex items-center justify-center text-white font-bold">
        CEO
      </div>
      <div className="ml-3">
        <h3 className="font-medium text-[#1A1F2C]">Executive Office</h3>
        <p className="text-xs text-[#8E9196]">Command Center</p>
      </div>
    </div>
  );
};

export default SidebarHeader;
