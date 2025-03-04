
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const AvailablePathsList = ({ paths, currentPath, onNavigate }) => {
  return (
    <div className="mt-4 border rounded-md p-3 max-h-[200px] overflow-y-auto">
      <p className="text-sm text-gray-500 mb-2">Select a page to navigate to:</p>
      <ul className="space-y-2">
        {paths.map((path) => (
          <li key={path}>
            <Button
              variant={currentPath === path ? "default" : "ghost"}
              className={`w-full justify-start text-left ${currentPath === path ? 'bg-blue-100 text-blue-800' : ''}`}
              onClick={() => onNavigate(path)}
            >
              {currentPath === path && (
                <Check className="mr-2 h-4 w-4 text-blue-600" />
              )}
              {path === '/' ? 'Home Page' : path.split('/').pop().replace(/-/g, ' ')}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailablePathsList;
